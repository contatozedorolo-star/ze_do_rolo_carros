import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get request body
    const { user_id_to_delete } = await req.json();
    if (!user_id_to_delete) {
      return new Response(
        JSON.stringify({ error: 'user_id_to_delete is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Request to delete user:', user_id_to_delete);

    // Create client with user's token to verify identity
    const supabaseUser = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    // Get user from token
    const { data: { user }, error: userError } = await supabaseUser.auth.getUser();
    if (userError || !user) {
      console.error('Auth error:', userError);
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Requesting admin:', user.id);

    // Prevent self-deletion
    if (user.id === user_id_to_delete) {
      console.log('User tried to delete themselves');
      return new Response(
        JSON.stringify({ error: 'Você não pode excluir seu próprio perfil.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create admin client for privileged operations
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Check if requesting user is admin
    const { data: roleData, error: roleError } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (roleError) {
      console.error('Role check error:', roleError);
      return new Response(
        JSON.stringify({ error: 'Error checking permissions' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!roleData) {
      console.log('User is not admin:', user.id);
      return new Response(
        JSON.stringify({ error: 'Access denied. Admin role required.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Admin verified, proceeding with deletion...');

    // Check if user to delete exists
    const { data: profileToDelete, error: profileCheckError } = await supabaseAdmin
      .from('profiles')
      .select('id, full_name')
      .eq('id', user_id_to_delete)
      .maybeSingle();

    if (profileCheckError || !profileToDelete) {
      console.error('User to delete not found:', profileCheckError);
      return new Response(
        JSON.stringify({ error: 'Usuário não encontrado.' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Deleting user:', profileToDelete.full_name);

    // Step 1: Delete vehicle images from storage
    const { data: vehicles } = await supabaseAdmin
      .from('vehicles')
      .select('id')
      .eq('user_id', user_id_to_delete);

    if (vehicles && vehicles.length > 0) {
      console.log(`Found ${vehicles.length} vehicles to clean up`);
      
      for (const vehicle of vehicles) {
        // Delete vehicle images from storage
        const { data: images } = await supabaseAdmin
          .from('vehicle_images')
          .select('image_url')
          .eq('vehicle_id', vehicle.id);

        if (images) {
          for (const img of images) {
            try {
              // Extract path from URL and delete from storage
              const url = new URL(img.image_url);
              const pathMatch = url.pathname.match(/\/storage\/v1\/object\/public\/vehicle-images\/(.+)/);
              if (pathMatch) {
                await supabaseAdmin.storage.from('vehicle-images').remove([pathMatch[1]]);
              }
            } catch (e) {
              console.log('Could not delete image:', e);
            }
          }
        }
      }
    }

    // Step 2: Delete avatar from storage
    try {
      const { data: avatarFiles } = await supabaseAdmin.storage
        .from('avatars')
        .list(user_id_to_delete);
      
      if (avatarFiles && avatarFiles.length > 0) {
        const filesToDelete = avatarFiles.map(f => `${user_id_to_delete}/${f.name}`);
        await supabaseAdmin.storage.from('avatars').remove(filesToDelete);
        console.log('Deleted avatar files');
      }
    } catch (e) {
      console.log('Could not delete avatar:', e);
    }

    // Step 3: Delete KYC documents from storage
    try {
      const { data: kycFiles } = await supabaseAdmin.storage
        .from('kyc-documents')
        .list(user_id_to_delete);
      
      if (kycFiles && kycFiles.length > 0) {
        const filesToDelete = kycFiles.map(f => `${user_id_to_delete}/${f.name}`);
        await supabaseAdmin.storage.from('kyc-documents').remove(filesToDelete);
        console.log('Deleted KYC documents');
      }
    } catch (e) {
      console.log('Could not delete KYC documents:', e);
    }

    // Step 4: Delete from auth (this will cascade delete profile due to FK constraint)
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user_id_to_delete);

    if (deleteError) {
      console.error('Error deleting auth user:', deleteError);
      return new Response(
        JSON.stringify({ error: 'Erro ao excluir usuário: ' + deleteError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('User deleted successfully:', user_id_to_delete);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Usuário ${profileToDelete.full_name || 'Sem nome'} excluído com sucesso.` 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

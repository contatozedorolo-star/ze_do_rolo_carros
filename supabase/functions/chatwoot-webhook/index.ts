import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    
    console.log("Chatwoot webhook received:", JSON.stringify(payload).slice(0, 500));

    // Only process outgoing messages (agent replies)
    // Chatwoot sends event "message_created" with message_type 1 = outgoing (from agent)
    const event = payload.event;
    const messageType = payload.message_type;
    const content = payload.content;
    const conversationId = payload.conversation?.id || payload.conversation_id;
    const senderName = payload.sender?.name || "Administrador";

    // message_type: 0 = incoming (user), 1 = outgoing (agent), 2 = activity
    if (event !== "message_created" || messageType !== 1 || !content) {
      console.log("Skipping non-agent message:", { event, messageType });
      return new Response(JSON.stringify({ ok: true, skipped: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Skip messages sent by the bot itself (to avoid echo)
    const senderType = payload.sender?.type;
    if (senderType === "agent_bot" || payload.content_attributes?.external_created_at) {
      console.log("Skipping bot message to avoid echo");
      return new Response(JSON.stringify({ ok: true, skipped: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Find the session_id from conversation metadata or contact identifier
    // We need to map chatwoot conversation back to session
    const contactIdentifier = payload.conversation?.contact?.identifier || 
                              payload.conversation?.meta?.sender?.identifier || "";
    
    // The contact identifier is the sessionId or email we used when creating
    const sessionId = contactIdentifier;

    if (!sessionId) {
      console.log("No session identifier found, cannot route message");
      return new Response(JSON.stringify({ ok: true, skipped: true, reason: "no_session" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Routing admin message to session:", sessionId, "from:", senderName);

    // Insert into chatwoot_admin_messages for real-time delivery
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error } = await supabase
      .from("chatwoot_admin_messages")
      .insert({
        session_id: sessionId,
        content: content,
        sender_name: senderName,
        chatwoot_conversation_id: conversationId,
      });

    if (error) {
      console.error("Error inserting admin message:", error);
      return new Response(JSON.stringify({ ok: false, error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Admin message saved successfully for session:", sessionId);

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

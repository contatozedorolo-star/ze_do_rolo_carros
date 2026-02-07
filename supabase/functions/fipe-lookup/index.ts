import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const FIPE_API_BASE = "https://parallelum.com.br/fipe/api/v1";

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { path } = body;

    if (!path || typeof path !== "string") {
      return new Response(
        JSON.stringify({ success: false, error: "Parâmetro 'path' é obrigatório" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Sanitize path - only allow alphanumeric, slashes, and hyphens
    const sanitizedPath = path.replace(/[^a-zA-Z0-9/\-]/g, "");
    const url = `${FIPE_API_BASE}/${sanitizedPath}`;
    console.log("[fipe-lookup] Proxying request to:", url);

    const response = await fetch(url);

    if (!response.ok) {
      console.error("[fipe-lookup] FIPE API error:", response.status);
      return new Response(
        JSON.stringify({ success: false, error: `Erro na API FIPE: ${response.status}` }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: response.status }
      );
    }

    const data = await response.json();

    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[fipe-lookup] Error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Erro ao consultar FIPE",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});

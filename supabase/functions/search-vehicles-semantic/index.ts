import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { query, match_count = 5 } = await req.json();
    if (!query) throw new Error("query is required");

    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) throw new Error("OPENAI_API_KEY not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Gerar embedding da pergunta
    const embeddingRes = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "text-embedding-3-small",
        input: query,
      }),
    });

    if (!embeddingRes.ok) {
      const errText = await embeddingRes.text();
      console.error("OpenAI error:", errText);
      throw new Error(`OpenAI API error: ${embeddingRes.status}`);
    }

    const embeddingData = await embeddingRes.json();
    const queryEmbedding = embeddingData.data[0].embedding;

    // Buscar veículos similares
    const { data: vehicles, error: matchError } = await supabase.rpc("match_vehicles", {
      query_embedding: queryEmbedding,
      match_count: Math.min(match_count, 10),
    });

    if (matchError) {
      console.error("match_vehicles error:", matchError);
      throw new Error(`Search error: ${matchError.message}`);
    }

    // Formatar resultados
    const results = (vehicles || []).map((v: any) => ({
      id: v.id,
      title: v.title,
      brand: v.brand,
      model: v.model,
      year: v.year_model,
      price: v.price,
      price_formatted: `R$ ${Number(v.price).toLocaleString("pt-BR")}`,
      city: v.city,
      state: v.state,
      vehicle_type: v.vehicle_type,
      km: v.km,
      fuel: v.fuel,
      transmission: v.transmission,
      description: v.description,
      link: `/veiculo/${v.id}`,
      similarity: Math.round(v.similarity * 100) / 100,
    }));

    console.log(`Search for "${query}" returned ${results.length} results`);

    return new Response(JSON.stringify({ results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("search-vehicles-semantic error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

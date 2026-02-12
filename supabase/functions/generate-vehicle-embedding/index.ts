import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { vehicle_id } = await req.json();
    if (!vehicle_id) throw new Error("vehicle_id is required");

    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) throw new Error("OPENAI_API_KEY not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Buscar dados do veículo
    const { data: vehicle, error: fetchError } = await supabase
      .from("vehicles")
      .select("brand, model, title, year_model, year_manufacture, price, description, optionals, city, state, body_type, fuel, transmission, km, vehicle_type, color, version, engine, doors, power_cv, traction, moto_style, moto_optionals, bus_optionals, truck_type, van_subcategory, trator_subcategory, implemento_subcategory")
      .eq("id", vehicle_id)
      .single();

    if (fetchError || !vehicle) {
      console.error("Vehicle not found:", fetchError);
      return new Response(JSON.stringify({ error: "Vehicle not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Montar texto descritivo
    const parts: string[] = [];
    parts.push(`${vehicle.brand} ${vehicle.model}${vehicle.version ? " " + vehicle.version : ""} ${vehicle.year_model}.`);
    if (vehicle.vehicle_type) parts.push(`Tipo: ${vehicle.vehicle_type}.`);
    if (vehicle.body_type) parts.push(`Carroceria: ${vehicle.body_type}.`);
    if (vehicle.fuel) parts.push(`Combustível: ${vehicle.fuel}.`);
    if (vehicle.transmission) parts.push(`Câmbio: ${vehicle.transmission}.`);
    if (vehicle.km != null) parts.push(`${vehicle.km} km.`);
    if (vehicle.price != null) parts.push(`Preço: R$ ${Number(vehicle.price).toLocaleString("pt-BR")}.`);
    if (vehicle.color) parts.push(`Cor: ${vehicle.color}.`);
    if (vehicle.doors) parts.push(`${vehicle.doors} portas.`);
    if (vehicle.power_cv) parts.push(`${vehicle.power_cv} cv.`);
    if (vehicle.engine) parts.push(`Motor: ${vehicle.engine}.`);
    if (vehicle.traction) parts.push(`Tração: ${vehicle.traction}.`);
    if (vehicle.city || vehicle.state) parts.push(`Localização: ${[vehicle.city, vehicle.state].filter(Boolean).join("/")}.`);
    if (vehicle.moto_style) parts.push(`Estilo: ${vehicle.moto_style}.`);
    if (vehicle.truck_type) parts.push(`Tipo caminhão: ${vehicle.truck_type}.`);

    const allOptionals = [
      ...(vehicle.optionals || []),
      ...(vehicle.moto_optionals || []),
      ...(vehicle.bus_optionals || []),
    ];
    if (allOptionals.length > 0) parts.push(`Opcionais: ${allOptionals.join(", ")}.`);
    if (vehicle.description) parts.push(`Descrição: ${vehicle.description}`);

    const text = parts.join(" ");
    console.log(`Generating embedding for vehicle ${vehicle_id}, text length: ${text.length}`);

    // Gerar embedding via OpenAI
    const embeddingRes = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "text-embedding-3-small",
        input: text,
      }),
    });

    if (!embeddingRes.ok) {
      const errText = await embeddingRes.text();
      console.error("OpenAI error:", errText);
      throw new Error(`OpenAI API error: ${embeddingRes.status}`);
    }

    const embeddingData = await embeddingRes.json();
    const embedding = embeddingData.data[0].embedding;

    // Salvar embedding no banco
    const { error: updateError } = await supabase
      .from("vehicles")
      .update({ embedding } as any)
      .eq("id", vehicle_id);

    if (updateError) {
      console.error("Update error:", updateError);
      throw new Error(`Failed to update embedding: ${updateError.message}`);
    }

    console.log(`Embedding saved for vehicle ${vehicle_id}`);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-vehicle-embedding error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

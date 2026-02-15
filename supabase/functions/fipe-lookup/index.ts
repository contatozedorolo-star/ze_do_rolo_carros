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
    const { path, vehicleType, brand, model, year } = body;

    // Mode 1: Direct path proxy (used by TabelaFipe)
    if (path && typeof path === "string") {
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
    }

    // Mode 2: Search by vehicle details (used by ProductDetail)
    if (vehicleType && brand) {
      const type = vehicleType.replace(/[^a-zA-Z0-9]/g, "");
      console.log("[fipe-lookup] Searching FIPE for:", { type, brand, model, year });

      // Step 1: Get brands
      const brandsRes = await fetch(`${FIPE_API_BASE}/${type}/marcas`);
      if (!brandsRes.ok) {
        return new Response(
          JSON.stringify({ success: false, error: "Erro ao buscar marcas FIPE" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
      }
      const brands = await brandsRes.json();
      const brandLower = brand.toLowerCase();
      const matchedBrand = brands.find((b: { nome: string }) => b.nome.toLowerCase().includes(brandLower));

      if (!matchedBrand) {
        return new Response(
          JSON.stringify({ success: false, error: "Marca não encontrada na FIPE" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 }
        );
      }

      // Step 2: Get models
      const modelsRes = await fetch(`${FIPE_API_BASE}/${type}/marcas/${matchedBrand.codigo}/modelos`);
      if (!modelsRes.ok) {
        return new Response(
          JSON.stringify({ success: false, error: "Erro ao buscar modelos FIPE" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
      }
      const modelsData = await modelsRes.json();
      const modelLower = (model || "").toLowerCase();
      const matchedModel = modelsData.modelos?.find((m: { nome: string }) =>
        m.nome.toLowerCase().includes(modelLower)
      );

      if (!matchedModel) {
        return new Response(
          JSON.stringify({ success: false, error: "Modelo não encontrado na FIPE" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 }
        );
      }

      // Step 3: Get years
      const yearsRes = await fetch(`${FIPE_API_BASE}/${type}/marcas/${matchedBrand.codigo}/modelos/${matchedModel.codigo}/anos`);
      if (!yearsRes.ok) {
        return new Response(
          JSON.stringify({ success: false, error: "Erro ao buscar anos FIPE" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
      }
      const years = await yearsRes.json();
      const yearStr = String(year || "");
      const matchedYear = years.find((y: { nome: string }) => y.nome.includes(yearStr)) || years[0];

      if (!matchedYear) {
        return new Response(
          JSON.stringify({ success: false, error: "Ano não encontrado na FIPE" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 }
        );
      }

      // Step 4: Get price
      const priceRes = await fetch(`${FIPE_API_BASE}/${type}/marcas/${matchedBrand.codigo}/modelos/${matchedModel.codigo}/anos/${matchedYear.codigo}`);
      if (!priceRes.ok) {
        return new Response(
          JSON.stringify({ success: false, error: "Erro ao buscar preço FIPE" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
      }
      const priceData = await priceRes.json();
      const priceNumber = parseInt(priceData.Valor?.replace(/[^\d]/g, "") || "0", 10);

      return new Response(
        JSON.stringify({
          success: true,
          data: {
            price: priceData.Valor,
            priceNumber,
            brand: priceData.Marca,
            model: priceData.Modelo,
            year: priceData.AnoModelo,
            fuel: priceData.Combustivel,
            fipeCode: priceData.CodigoFipe,
            referenceMonth: priceData.MesReferencia,
          },
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: "Parâmetro 'path' ou 'vehicleType'+'brand' são obrigatórios" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
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

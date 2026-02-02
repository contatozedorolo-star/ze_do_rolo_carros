import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const FIPE_API_BASE = "https://parallelum.com.br/fipe/api/v1";

interface FipeRequest {
  vehicleType?: "carros" | "motos" | "caminhoes";
  brandCode?: string;
  modelCode?: string;
  yearCode?: string;
  // Para busca automática por nome
  brand?: string;
  model?: string;
  year?: number;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: FipeRequest = await req.json();
    console.log("[fipe-lookup] Request received:", JSON.stringify(body));

    const vehicleType = body.vehicleType || "carros";

    // Se temos códigos diretos, buscar valor diretamente
    if (body.brandCode && body.modelCode && body.yearCode) {
      const url = `${FIPE_API_BASE}/${vehicleType}/marcas/${body.brandCode}/modelos/${body.modelCode}/anos/${body.yearCode}`;
      console.log("[fipe-lookup] Fetching price from:", url);

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`FIPE API error: ${response.status}`);
      }

      const data = await response.json();
      console.log("[fipe-lookup] Price data:", JSON.stringify(data));

      return new Response(
        JSON.stringify({
          success: true,
          data: {
            price: data.Valor,
            priceNumber: parseFloat(
              data.Valor?.replace("R$ ", "").replace(/\./g, "").replace(",", ".") || "0"
            ),
            brand: data.Marca,
            model: data.Modelo,
            year: data.AnoModelo,
            fuel: data.Combustivel,
            fipeCode: data.CodigoFipe,
            referenceMonth: data.MesReferencia,
          },
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Busca automática por nome de marca e modelo
    if (body.brand) {
      // 1. Buscar marcas
      const brandsUrl = `${FIPE_API_BASE}/${vehicleType}/marcas`;
      console.log("[fipe-lookup] Fetching brands from:", brandsUrl);

      const brandsRes = await fetch(brandsUrl);
      if (!brandsRes.ok) {
        throw new Error(`FIPE API brands error: ${brandsRes.status}`);
      }

      const brands = await brandsRes.json();
      const brandNormalized = body.brand.toLowerCase().trim();

      // Encontrar marca mais próxima
      const matchedBrand = brands.find(
        (b: { nome: string; codigo: string }) =>
          b.nome.toLowerCase().includes(brandNormalized) ||
          brandNormalized.includes(b.nome.toLowerCase())
      );

      if (!matchedBrand) {
        console.log("[fipe-lookup] Brand not found:", body.brand);
        return new Response(
          JSON.stringify({
            success: false,
            error: "Marca não encontrada na tabela FIPE",
            availableBrands: brands.slice(0, 20).map((b: { nome: string }) => b.nome),
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log("[fipe-lookup] Matched brand:", matchedBrand.nome, matchedBrand.codigo);

      // 2. Buscar modelos da marca
      const modelsUrl = `${FIPE_API_BASE}/${vehicleType}/marcas/${matchedBrand.codigo}/modelos`;
      console.log("[fipe-lookup] Fetching models from:", modelsUrl);

      const modelsRes = await fetch(modelsUrl);
      if (!modelsRes.ok) {
        throw new Error(`FIPE API models error: ${modelsRes.status}`);
      }

      const modelsData = await modelsRes.json();
      const models = modelsData.modelos || [];

      // Se não temos modelo específico, retornar lista de modelos
      if (!body.model) {
        return new Response(
          JSON.stringify({
            success: true,
            data: {
              brand: matchedBrand,
              models: models.slice(0, 50),
            },
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Encontrar modelo mais próximo
      const modelNormalized = body.model.toLowerCase().trim();
      const matchedModel = models.find(
        (m: { nome: string; codigo: number }) =>
          m.nome.toLowerCase().includes(modelNormalized) ||
          modelNormalized.includes(m.nome.toLowerCase().split(" ").slice(0, 2).join(" "))
      );

      if (!matchedModel) {
        console.log("[fipe-lookup] Model not found:", body.model);
        return new Response(
          JSON.stringify({
            success: false,
            error: "Modelo não encontrado na tabela FIPE",
            brand: matchedBrand,
            availableModels: models.slice(0, 20).map((m: { nome: string }) => m.nome),
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log("[fipe-lookup] Matched model:", matchedModel.nome, matchedModel.codigo);

      // 3. Buscar anos disponíveis
      const yearsUrl = `${FIPE_API_BASE}/${vehicleType}/marcas/${matchedBrand.codigo}/modelos/${matchedModel.codigo}/anos`;
      console.log("[fipe-lookup] Fetching years from:", yearsUrl);

      const yearsRes = await fetch(yearsUrl);
      if (!yearsRes.ok) {
        throw new Error(`FIPE API years error: ${yearsRes.status}`);
      }

      const years = await yearsRes.json();

      // Se não temos ano específico, retornar lista de anos
      if (!body.year) {
        return new Response(
          JSON.stringify({
            success: true,
            data: {
              brand: matchedBrand,
              model: matchedModel,
              years,
            },
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Encontrar ano mais próximo
      const matchedYear = years.find(
        (y: { nome: string; codigo: string }) =>
          y.nome.includes(String(body.year)) || y.codigo.includes(String(body.year))
      );

      if (!matchedYear) {
        console.log("[fipe-lookup] Year not found:", body.year);
        // Pegar o ano mais recente disponível
        const fallbackYear = years[0];
        if (fallbackYear) {
          console.log("[fipe-lookup] Using fallback year:", fallbackYear.nome);

          const priceUrl = `${FIPE_API_BASE}/${vehicleType}/marcas/${matchedBrand.codigo}/modelos/${matchedModel.codigo}/anos/${fallbackYear.codigo}`;
          const priceRes = await fetch(priceUrl);

          if (priceRes.ok) {
            const priceData = await priceRes.json();
            return new Response(
              JSON.stringify({
                success: true,
                data: {
                  price: priceData.Valor,
                  priceNumber: parseFloat(
                    priceData.Valor?.replace("R$ ", "").replace(/\./g, "").replace(",", ".") || "0"
                  ),
                  brand: priceData.Marca,
                  model: priceData.Modelo,
                  year: priceData.AnoModelo,
                  fuel: priceData.Combustivel,
                  fipeCode: priceData.CodigoFipe,
                  referenceMonth: priceData.MesReferencia,
                  note: `Ano ${body.year} não disponível, usando ${fallbackYear.nome}`,
                },
              }),
              { headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }
        }

        return new Response(
          JSON.stringify({
            success: false,
            error: "Ano não encontrado na tabela FIPE",
            brand: matchedBrand,
            model: matchedModel,
            availableYears: years.map((y: { nome: string }) => y.nome),
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // 4. Buscar preço final
      const priceUrl = `${FIPE_API_BASE}/${vehicleType}/marcas/${matchedBrand.codigo}/modelos/${matchedModel.codigo}/anos/${matchedYear.codigo}`;
      console.log("[fipe-lookup] Fetching price from:", priceUrl);

      const priceRes = await fetch(priceUrl);
      if (!priceRes.ok) {
        throw new Error(`FIPE API price error: ${priceRes.status}`);
      }

      const priceData = await priceRes.json();
      console.log("[fipe-lookup] Final price data:", JSON.stringify(priceData));

      return new Response(
        JSON.stringify({
          success: true,
          data: {
            price: priceData.Valor,
            priceNumber: parseFloat(
              priceData.Valor?.replace("R$ ", "").replace(/\./g, "").replace(",", ".") || "0"
            ),
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
      JSON.stringify({
        success: false,
        error: "Parâmetros inválidos. Envie brand/model/year ou brandCode/modelCode/yearCode",
      }),
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

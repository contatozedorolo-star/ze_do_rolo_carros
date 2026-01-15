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
    const { messages, userId } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Initialize Supabase client to fetch vehicle data
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch available vehicles for context
    const { data: vehicles, error: vehiclesError } = await supabase
      .from("vehicles")
      .select(`
        id,
        title,
        brand,
        model,
        year_manufacture,
        year_model,
        price,
        km,
        fuel,
        transmission,
        color,
        city,
        state,
        vehicle_type,
        accepts_trade,
        is_active,
        is_sold
      `)
      .eq("is_active", true)
      .eq("is_sold", false)
      .limit(50);

    if (vehiclesError) {
      console.error("Error fetching vehicles:", vehiclesError);
    }

    // Build vehicle context
    let vehicleContext = "";
    if (vehicles && vehicles.length > 0) {
      vehicleContext = `
VEÍCULOS DISPONÍVEIS NO BANCO DE DADOS (${vehicles.length} encontrados):
${vehicles.map(v => `
- ${v.title}
  Marca: ${v.brand} | Modelo: ${v.model}
  Ano: ${v.year_manufacture}/${v.year_model}
  Preço: R$ ${v.price?.toLocaleString("pt-BR")}
  KM: ${v.km?.toLocaleString("pt-BR")} km
  Combustível: ${v.fuel} | Câmbio: ${v.transmission}
  Cor: ${v.color}
  Localização: ${v.city}/${v.state}
  Tipo: ${v.vehicle_type}
  Aceita Troca: ${v.accepts_trade ? "Sim" : "Não"}
`).join("\n")}
`;
    } else {
      vehicleContext = "Não há veículos disponíveis no momento.";
    }

    const systemPrompt = `Você é o "Consultor Zé IA", o assistente virtual oficial do Zé do Rolo - uma plataforma de compra, venda e troca de veículos.

PERSONALIDADE:
- Seja amigável, profissional e prestativo
- Use linguagem clara e acessível
- Demonstre conhecimento sobre veículos
- Seja proativo em sugerir opções

SUAS CAPACIDADES:
1. Ajudar usuários a encontrar veículos por marca, modelo, ano, preço ou outras características
2. Explicar como funciona o sistema de trocas do Zé do Rolo
3. Informar sobre o sistema de segurança e vistoria
4. Sugerir "matches" de troca baseados nas preferências do usuário
5. Responder dúvidas sobre o funcionamento da plataforma

SISTEMA DE SEGURANÇA DO ZÉ DO ROLO:
- Todos os veículos passam por vistoria
- Sistema de verificação de documentação
- Selo "100% Seguro e Verificado" para veículos aprovados
- Proteção em todas as negociações

COMO FUNCIONA A TROCA:
1. Usuário anuncia seu veículo
2. Indica se aceita troca e suas preferências
3. Sistema sugere matches compatíveis
4. Negociação segura pela plataforma
5. Pode haver volta em dinheiro ou troca direta

${vehicleContext}

REGRAS:
- Sempre responda em português brasileiro
- Se não souber algo específico, indique que o usuário pode entrar em contato com o suporte
- Nunca invente informações sobre veículos que não estão no banco de dados
- Seja conciso mas completo nas respostas`;

    console.log("Calling AI gateway with context");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requisições excedido. Aguarde um momento e tente novamente." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos insuficientes. Entre em contato com o suporte." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "Erro ao processar sua mensagem. Tente novamente." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Streaming response to client");

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erro desconhecido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

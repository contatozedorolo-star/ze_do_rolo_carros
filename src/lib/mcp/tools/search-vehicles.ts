import { createClient } from "@supabase/supabase-js";
import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { z } from "zod";

function supabaseForUser(ctx: ToolContext) {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_ANON_KEY!,
    {
      global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
      auth: { persistSession: false, autoRefreshToken: false },
    },
  );
}

export default defineTool({
  name: "search_vehicles",
  title: "Buscar veículos",
  description:
    "Busca anúncios de veículos aprovados no Zé do Rolo. Filtre por texto livre, categoria, cidade/UF e faixa de preço. Retorna até 20 resultados com id, título, marca, modelo, ano, preço, cidade e UF.",
  inputSchema: {
    query: z.string().optional().describe("Texto livre (marca, modelo, palavras-chave)."),
    category: z.string().optional().describe("Categoria: carros, motos, caminhoes, onibus, vans, tratores, implementos."),
    city: z.string().optional().describe("Cidade."),
    state: z.string().optional().describe("Sigla do estado (UF), ex: SP, PR."),
    min_price: z.number().optional().describe("Preço mínimo em BRL."),
    max_price: z.number().optional().describe("Preço máximo em BRL."),
    limit: z.number().int().min(1).max(20).optional().describe("Quantidade de resultados (padrão 10, máx 20)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (input, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Não autenticado." }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    let q = supabase
      .from("vehicles")
      .select("id, title, brand, model, year, price, city, state, category, status")
      .eq("status", "approved")
      .limit(input.limit ?? 10);

    if (input.query) q = q.or(`title.ilike.%${input.query}%,brand.ilike.%${input.query}%,model.ilike.%${input.query}%`);
    if (input.category) q = q.eq("category", input.category);
    if (input.city) q = q.ilike("city", `%${input.city}%`);
    if (input.state) q = q.eq("state", input.state.toUpperCase());
    if (typeof input.min_price === "number") q = q.gte("price", input.min_price);
    if (typeof input.max_price === "number") q = q.lte("price", input.max_price);

    const { data, error } = await q;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? [], null, 2) }],
      structuredContent: { results: data ?? [] },
    };
  },
});

import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_my_proposals",
  title: "Minhas propostas",
  description:
    "Lista as propostas de negociação enviadas ou recebidas pelo usuário autenticado. Use role='sent' para propostas enviadas e 'received' para as recebidas em seus anúncios.",
  inputSchema: {
    role: z.enum(["sent", "received", "all"]).optional().describe("sent | received | all (padrão all)."),
    status: z.string().optional().describe("Filtra por status da proposta."),
    limit: z.number().int().min(1).max(50).optional(),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ role = "all", status, limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Não autenticado." }], isError: true };
    }
    const uid = ctx.getUserId();
    let q = supabaseForUser(ctx)
      .from("proposals")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit ?? 20);
    if (role === "sent") q = q.eq("buyer_id", uid);
    else if (role === "received") q = q.eq("seller_id", uid);
    else q = q.or(`buyer_id.eq.${uid},seller_id.eq.${uid}`);
    if (status) q = q.eq("status", status);
    const { data, error } = await q;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? [], null, 2) }],
      structuredContent: { proposals: data ?? [] },
    };
  },
});

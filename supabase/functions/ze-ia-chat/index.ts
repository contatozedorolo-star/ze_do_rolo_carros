import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const N8N_WEBHOOK_URL = "https://n8n.autoia.store/webhook/ze_do_rolo";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, userId, sessionId: providedSessionId } = await req.json();
    
    // Get the last user message
    const lastUserMessage = messages
      .filter((m: { role: string }) => m.role === "user")
      .pop();

    if (!lastUserMessage) {
      return new Response(
        JSON.stringify({ error: "Nenhuma mensagem do usuário encontrada" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate or use provided sessionId
    const sessionId = providedSessionId || `session_${Date.now()}_${userId || 'anonymous'}`;

    console.log("Sending message to n8n webhook:", {
      mensagem: lastUserMessage.content,
      sessionId
    });

    // Call n8n webhook
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mensagem: lastUserMessage.content,
        sessionId: sessionId
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("n8n webhook error:", response.status, errorText);
      
      return new Response(
        JSON.stringify({ error: "Erro ao processar sua mensagem. Tente novamente." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get the response from n8n
    const n8nResponse = await response.text();
    console.log("n8n response:", n8nResponse);

    // Try to parse as JSON first, if it fails, use as plain text
    let assistantMessage = n8nResponse;
    try {
      const jsonResponse = JSON.parse(n8nResponse);
      // Check common response structures from n8n
      assistantMessage = jsonResponse.response || jsonResponse.message || jsonResponse.output || jsonResponse.text || n8nResponse;
    } catch {
      // Response is plain text, use as-is
      assistantMessage = n8nResponse;
    }

    // Format response as SSE stream to match existing frontend
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        // Send the complete message as a single SSE event
        const data = {
          choices: [{
            delta: {
              content: assistantMessage
            }
          }]
        };
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      }
    });

    return new Response(stream, {
      headers: { 
        ...corsHeaders, 
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive"
      },
    });

  } catch (error) {
    console.error("Chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erro desconhecido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const N8N_WEBHOOK_URL = "https://n8n.autoia.store/webhook/ze_do_rolo";
const CHATWOOT_BASE_URL = "https://chatwootapp.autoia.store";

// Helper function to get or create a Chatwoot contact
async function getOrCreateChatwootContact(
  accountId: string,
  inboxId: string,
  apiToken: string,
  identifier: string,
  name?: string
): Promise<{ contactId: number; conversationId: number } | null> {
  try {
    // First, try to find existing contact by identifier
    const searchResponse = await fetch(
      `${CHATWOOT_BASE_URL}/api/v1/accounts/${accountId}/contacts/search?q=${identifier}`,
      {
        headers: {
          "api_access_token": apiToken,
          "Content-Type": "application/json",
        },
      }
    );

    let contactId: number;

    if (searchResponse.ok) {
      const searchData = await searchResponse.json();
      if (searchData.payload && searchData.payload.length > 0) {
        contactId = searchData.payload[0].id;
        console.log("Found existing contact:", contactId);
      } else {
        // Create new contact
        const createContactResponse = await fetch(
          `${CHATWOOT_BASE_URL}/api/v1/accounts/${accountId}/contacts`,
          {
            method: "POST",
            headers: {
              "api_access_token": apiToken,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              inbox_id: inboxId,
              name: name || `Usuário ${identifier.slice(-6)}`,
              identifier: identifier,
            }),
          }
        );

        if (!createContactResponse.ok) {
          const errorText = await createContactResponse.text();
          console.error("Failed to create contact:", errorText);
          return null;
        }

        const contactData = await createContactResponse.json();
        contactId = contactData.payload.contact.id;
        console.log("Created new contact:", contactId);
      }
    } else {
      console.error("Failed to search contacts");
      return null;
    }

    // Get or create conversation for this contact
    const conversationsResponse = await fetch(
      `${CHATWOOT_BASE_URL}/api/v1/accounts/${accountId}/contacts/${contactId}/conversations`,
      {
        headers: {
          "api_access_token": apiToken,
          "Content-Type": "application/json",
        },
      }
    );

    let conversationId: number;

    if (conversationsResponse.ok) {
      const conversationsData = await conversationsResponse.json();
      // Find open conversation in the target inbox
      const openConversation = conversationsData.payload?.find(
        (conv: { status: string; inbox_id: number }) => 
          conv.status === "open" && conv.inbox_id === parseInt(inboxId)
      );

      if (openConversation) {
        conversationId = openConversation.id;
        console.log("Found existing conversation:", conversationId);
      } else {
        // Create new conversation
        const createConvResponse = await fetch(
          `${CHATWOOT_BASE_URL}/api/v1/accounts/${accountId}/conversations`,
          {
            method: "POST",
            headers: {
              "api_access_token": apiToken,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              inbox_id: inboxId,
              contact_id: contactId,
              status: "open",
            }),
          }
        );

        if (!createConvResponse.ok) {
          const errorText = await createConvResponse.text();
          console.error("Failed to create conversation:", errorText);
          return null;
        }

        const convData = await createConvResponse.json();
        conversationId = convData.id;
        console.log("Created new conversation:", conversationId);
      }
    } else {
      console.error("Failed to get conversations");
      return null;
    }

    return { contactId, conversationId };
  } catch (error) {
    console.error("Error in getOrCreateChatwootContact:", error);
    return null;
  }
}

// Helper function to send message to Chatwoot
async function sendMessageToChatwoot(
  accountId: string,
  conversationId: number,
  apiToken: string,
  content: string,
  messageType: "incoming" | "outgoing"
): Promise<boolean> {
  try {
    const response = await fetch(
      `${CHATWOOT_BASE_URL}/api/v1/accounts/${accountId}/conversations/${conversationId}/messages`,
      {
        method: "POST",
        headers: {
          "api_access_token": apiToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: content,
          message_type: messageType,
          private: false,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to send ${messageType} message to Chatwoot:`, errorText);
      return false;
    }

    console.log(`Successfully sent ${messageType} message to Chatwoot`);
    return true;
  } catch (error) {
    console.error("Error sending message to Chatwoot:", error);
    return false;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, userId, sessionId: providedSessionId, userName } = await req.json();
    
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

    // Get Chatwoot credentials
    const chatwootApiToken = Deno.env.get("CHATWOOT_API_TOKEN");
    const chatwootAccountId = Deno.env.get("CHATWOOT_ACCOUNT_ID");
    const chatwootInboxId = Deno.env.get("CHATWOOT_INBOX_ID");

    let chatwootConversationId: number | null = null;

    // Sync with Chatwoot if credentials are available
    if (chatwootApiToken && chatwootAccountId && chatwootInboxId) {
      console.log("Chatwoot integration enabled, syncing conversation...");
      
      const contactResult = await getOrCreateChatwootContact(
        chatwootAccountId,
        chatwootInboxId,
        chatwootApiToken,
        sessionId,
        userName
      );

      if (contactResult) {
        chatwootConversationId = contactResult.conversationId;
        
        // Send user message to Chatwoot (incoming = from user)
        await sendMessageToChatwoot(
          chatwootAccountId,
          chatwootConversationId,
          chatwootApiToken,
          lastUserMessage.content,
          "incoming"
        );
      }
    } else {
      console.log("Chatwoot credentials not configured, skipping sync");
    }

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

    // Send assistant response to Chatwoot (outgoing = from agent/bot)
    if (chatwootApiToken && chatwootAccountId && chatwootConversationId) {
      await sendMessageToChatwoot(
        chatwootAccountId,
        chatwootConversationId,
        chatwootApiToken,
        assistantMessage,
        "outgoing"
      );
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

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const N8N_WEBHOOK_URL = "https://n8n.autoia.store/webhook/ze_do_rolo";
const CHATWOOT_BASE_URL = "https://chatwootapp.autoia.store";

// Helper function to update contact with email
async function updateChatwootContactEmail(
  accountId: string,
  apiToken: string,
  contactId: number,
  email: string,
  name?: string
): Promise<boolean> {
  try {
    const updateResponse = await fetch(
      `${CHATWOOT_BASE_URL}/api/v1/accounts/${accountId}/contacts/${contactId}`,
      {
        method: "PUT",
        headers: {
          "api_access_token": apiToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          name: name || email.split('@')[0],
        }),
      }
    );

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      console.error("Failed to update contact email:", errorText);
      return false;
    }

    console.log("Successfully updated contact email:", email);
    return true;
  } catch (error) {
    console.error("Error updating contact email:", error);
    return false;
  }
}

// Helper function to get contact inbox source_id for sending user messages
async function getContactInboxSourceId(
  accountId: string,
  inboxId: string,
  apiToken: string,
  contactId: number
): Promise<string | null> {
  try {
    // Get contact inboxes
    const response = await fetch(
      `${CHATWOOT_BASE_URL}/api/v1/accounts/${accountId}/contacts/${contactId}/contact_inboxes`,
      {
        headers: {
          "api_access_token": apiToken,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      // Find the contact inbox for our target inbox
      const contactInbox = data.payload?.find(
        (ci: { inbox: { id: number }; source_id: string }) => 
          ci.inbox?.id === parseInt(inboxId)
      );
      
      if (contactInbox) {
        console.log("Found contact inbox source_id:", contactInbox.source_id);
        return contactInbox.source_id;
      }
    }

    // If not found, create a contact inbox
    const createResponse = await fetch(
      `${CHATWOOT_BASE_URL}/api/v1/accounts/${accountId}/contacts/${contactId}/contact_inboxes`,
      {
        method: "POST",
        headers: {
          "api_access_token": apiToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inbox_id: parseInt(inboxId),
        }),
      }
    );

    if (createResponse.ok) {
      const createData = await createResponse.json();
      console.log("Created contact inbox, source_id:", createData.source_id);
      return createData.source_id;
    } else {
      const errorText = await createResponse.text();
      console.error("Failed to create contact inbox:", errorText);
    }

    return null;
  } catch (error) {
    console.error("Error getting contact inbox source_id:", error);
    return null;
  }
}

// Helper function to get or create a Chatwoot contact
async function getOrCreateChatwootContact(
  accountId: string,
  inboxId: string,
  apiToken: string,
  identifier: string,
  name?: string,
  email?: string
): Promise<{ contactId: number; conversationId: number; sourceId: string | null } | null> {
  try {
    // First, try to find existing contact by email (priority) or identifier
    let contactId: number | null = null;
    let existingContact: { id: number; email?: string } | null = null;

    // Search by email first if available
    if (email) {
      const emailSearchResponse = await fetch(
        `${CHATWOOT_BASE_URL}/api/v1/accounts/${accountId}/contacts/search?q=${encodeURIComponent(email)}`,
        {
          headers: {
            "api_access_token": apiToken,
            "Content-Type": "application/json",
          },
        }
      );

      if (emailSearchResponse.ok) {
        const emailSearchData = await emailSearchResponse.json();
        if (emailSearchData.payload && emailSearchData.payload.length > 0) {
          const foundContact = emailSearchData.payload[0];
          existingContact = foundContact;
          contactId = foundContact.id;
          console.log("Found existing contact by email:", contactId);
        }
      }
    }

    // If not found by email, search by identifier
    if (!contactId) {
      const searchResponse = await fetch(
        `${CHATWOOT_BASE_URL}/api/v1/accounts/${accountId}/contacts/search?q=${encodeURIComponent(identifier)}`,
        {
          headers: {
            "api_access_token": apiToken,
            "Content-Type": "application/json",
          },
        }
      );

      if (searchResponse.ok) {
        const searchData = await searchResponse.json();
        if (searchData.payload && searchData.payload.length > 0) {
          const foundContact = searchData.payload[0];
          existingContact = foundContact;
          contactId = foundContact.id;
          console.log("Found existing contact by identifier:", contactId);

          // Update contact with email if we have one and the contact doesn't have it
          if (email && contactId && (!foundContact.email || foundContact.email !== email)) {
            console.log("Updating contact with new email:", email);
            await updateChatwootContactEmail(accountId, apiToken, contactId, email, name);
          }
        }
      }
    }

    // Create new contact if not found
    if (!contactId) {
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
            name: name || (email ? email.split('@')[0] : `Usuário ${identifier.slice(-6)}`),
            identifier: identifier,
            email: email || undefined,
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
      console.log("Created new contact with email:", contactId, email);
    }

    // Get contact inbox source_id for sending user messages
    const sourceId = await getContactInboxSourceId(accountId, inboxId, apiToken, contactId!);

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

    return { contactId: contactId!, conversationId, sourceId };
  } catch (error) {
    console.error("Error in getOrCreateChatwootContact:", error);
    return null;
  }
}

// Helper function to send user message via Client API (works for any inbox type)
async function sendUserMessageViaPubAPI(
  inboxId: string,
  sourceId: string,
  content: string
): Promise<boolean> {
  try {
    // Use the public client API endpoint that works for all inbox types
    const response = await fetch(
      `${CHATWOOT_BASE_URL}/public/api/v1/inboxes/${inboxId}/contacts/${sourceId}/conversations/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: content,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to send user message via public API:", errorText);
      return false;
    }

    console.log("Successfully sent user message via public API");
    return true;
  } catch (error) {
    console.error("Error sending user message via public API:", error);
    return false;
  }
}

// Helper function to send message to Chatwoot
async function sendMessageToChatwoot(
  accountId: string,
  conversationId: number,
  apiToken: string,
  content: string,
  messageType: "incoming" | "outgoing",
  inboxId?: string,
  sourceId?: string | null
): Promise<boolean> {
  try {
    // For incoming (user) messages, try the public API first if we have sourceId
    if (messageType === "incoming" && sourceId && inboxId) {
      const pubSuccess = await sendUserMessageViaPubAPI(inboxId, sourceId, content);
      if (pubSuccess) {
        return true;
      }
      console.log("Public API failed, falling back to admin API...");
    }

    // Use admin API for outgoing messages or as fallback
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
    const { messages, userId, sessionId: providedSessionId, userName, userEmail } = await req.json();
    
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

    // Generate or use provided sessionId - prefer email as identifier if available
    const contactIdentifier = userEmail || providedSessionId || `session_${Date.now()}_${userId || 'anonymous'}`;
    const sessionId = providedSessionId || `session_${Date.now()}_${userId || 'anonymous'}`;

    console.log("Processing message:", {
      mensagem: lastUserMessage.content,
      sessionId,
      contactIdentifier,
      userEmail,
      userName
    });

    // Get Chatwoot credentials
    const chatwootApiToken = Deno.env.get("CHATWOOT_API_TOKEN");
    const chatwootAccountId = Deno.env.get("CHATWOOT_ACCOUNT_ID");
    const chatwootInboxId = Deno.env.get("CHATWOOT_INBOX_ID");

    let chatwootConversationId: number | null = null;
    let chatwootSourceId: string | null = null;

    // Sync with Chatwoot if credentials are available
    if (chatwootApiToken && chatwootAccountId && chatwootInboxId) {
      console.log("Chatwoot integration enabled, syncing conversation...");
      
      const contactResult = await getOrCreateChatwootContact(
        chatwootAccountId,
        chatwootInboxId,
        chatwootApiToken,
        contactIdentifier,
        userName || (userEmail ? userEmail.split('@')[0] : undefined),
        userEmail
      );

      if (contactResult) {
        chatwootConversationId = contactResult.conversationId;
        chatwootSourceId = contactResult.sourceId;
        
        // Send user message to Chatwoot (incoming = from user)
        await sendMessageToChatwoot(
          chatwootAccountId,
          chatwootConversationId,
          chatwootApiToken,
          lastUserMessage.content,
          "incoming",
          chatwootInboxId,
          chatwootSourceId
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
        "outgoing",
        chatwootInboxId,
        chatwootSourceId
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

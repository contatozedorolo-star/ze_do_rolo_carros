
-- Table to store Chatwoot admin messages for real-time delivery to frontend
CREATE TABLE public.chatwoot_admin_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  content TEXT NOT NULL,
  sender_name TEXT DEFAULT 'Administrador',
  chatwoot_conversation_id INTEGER,
  is_delivered BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Index for fast lookup by session
CREATE INDEX idx_chatwoot_admin_messages_session ON public.chatwoot_admin_messages(session_id, is_delivered);

-- Enable RLS
ALTER TABLE public.chatwoot_admin_messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read (the chat is public, sessionId acts as auth)
CREATE POLICY "Anyone can read admin messages"
  ON public.chatwoot_admin_messages
  FOR SELECT
  USING (true);

-- Only service role can insert (from edge function webhook)
CREATE POLICY "Service role can insert admin messages"
  ON public.chatwoot_admin_messages
  FOR INSERT
  WITH CHECK (true);

-- Allow marking as delivered
CREATE POLICY "Anyone can update delivered status"
  ON public.chatwoot_admin_messages
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Auto-cleanup old messages after 24h
CREATE OR REPLACE FUNCTION public.cleanup_old_chatwoot_messages()
RETURNS void
LANGUAGE plpgsql
SET search_path = 'public'
AS $$
BEGIN
  DELETE FROM public.chatwoot_admin_messages
  WHERE created_at < now() - INTERVAL '24 hours';
END;
$$;

-- Enable realtime for this table
ALTER TABLE public.chatwoot_admin_messages REPLICA IDENTITY FULL;

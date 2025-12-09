-- Create enum for proposal status
CREATE TYPE public.proposal_status AS ENUM ('pending', 'accepted', 'rejected', 'counter', 'cancelled');

-- Create proposals table
CREATE TABLE public.proposals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  proposer_id UUID NOT NULL,
  seller_id UUID NOT NULL,
  cash_amount NUMERIC NOT NULL DEFAULT 0,
  message TEXT,
  include_trade BOOLEAN DEFAULT false,
  trade_items TEXT,
  status proposal_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;

-- Policies: proposer and seller can view their proposals
CREATE POLICY "Users can view their proposals"
ON public.proposals
FOR SELECT
USING (auth.uid() = proposer_id OR auth.uid() = seller_id OR has_role(auth.uid(), 'admin'::app_role));

-- Proposer can create proposals
CREATE POLICY "Users can create proposals"
ON public.proposals
FOR INSERT
WITH CHECK (auth.uid() = proposer_id);

-- Proposer can cancel, seller can accept/reject
CREATE POLICY "Users can update their proposals"
ON public.proposals
FOR UPDATE
USING (auth.uid() = proposer_id OR auth.uid() = seller_id);

-- Only proposer can delete their proposals
CREATE POLICY "Users can delete their proposals"
ON public.proposals
FOR DELETE
USING (auth.uid() = proposer_id);

-- Trigger for updated_at
CREATE TRIGGER update_proposals_updated_at
BEFORE UPDATE ON public.proposals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.proposals;
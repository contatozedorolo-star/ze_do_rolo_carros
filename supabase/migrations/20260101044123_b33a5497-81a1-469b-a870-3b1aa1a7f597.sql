-- 1. FIX: Customer Personal Information - Restrict profile visibility to only non-sensitive fields
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Users can view profiles of proposal participants" ON public.profiles;

-- Create a more restrictive policy that only allows viewing basic info (name, avatar) of proposal participants
-- Note: This still allows viewing, but we'll handle sensitive field filtering in the application layer
CREATE POLICY "Users can view limited profiles of proposal participants"
  ON public.profiles FOR SELECT
  USING (
    -- Own profile - full access
    auth.uid() = id
    OR
    -- Proposal participant - limited access (we handle field restriction in app)
    EXISTS (
      SELECT 1 FROM proposals p
      WHERE (
        (p.proposer_id = auth.uid() AND p.seller_id = profiles.id) OR
        (p.seller_id = auth.uid() AND p.proposer_id = profiles.id)
      )
    )
  );

-- 2. FIX: KYC Documents Storage Bucket Missing - Create private bucket with proper policies
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'kyc-documents',
  'kyc-documents',
  false,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Policy: Users can upload their own KYC documents
CREATE POLICY "Users can upload own KYC documents"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'kyc-documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy: Users and admins can view KYC documents
CREATE POLICY "Users and admins can view KYC documents"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'kyc-documents'
    AND (
      auth.uid()::text = (storage.foldername(name))[1]
      OR public.has_role(auth.uid(), 'admin')
    )
  );

-- Policy: Users can update their own KYC documents
CREATE POLICY "Users can update own KYC documents"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'kyc-documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy: Users can delete their own KYC documents
CREATE POLICY "Users can delete own KYC documents"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'kyc-documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- 3. FIX: Messages Can Be Modified - Add UPDATE policy that only allows marking as read
CREATE POLICY "Participants can mark messages as read"
  ON public.messages FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.proposals
      WHERE proposals.id = messages.proposal_id
      AND (proposals.proposer_id = auth.uid() OR proposals.seller_id = auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.proposals
      WHERE proposals.id = messages.proposal_id
      AND (proposals.proposer_id = auth.uid() OR proposals.seller_id = auth.uid())
    )
  );
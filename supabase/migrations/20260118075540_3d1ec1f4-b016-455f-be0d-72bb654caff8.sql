-- Create security definer function to check KYC status
CREATE OR REPLACE FUNCTION public.has_approved_kyc(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.kyc_verifications
    WHERE user_id = _user_id
      AND status = 'approved'
  )
$$;

-- Drop existing INSERT policy if exists (to avoid conflicts)
DROP POLICY IF EXISTS "Users can create proposals" ON public.proposals;
DROP POLICY IF EXISTS "Users with approved KYC can create proposals" ON public.proposals;

-- Create new INSERT policy that requires approved KYC
CREATE POLICY "Users with approved KYC can create proposals"
ON public.proposals
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = proposer_id
  AND public.has_approved_kyc(auth.uid())
);
-- Fix 1: Restrict profiles table SELECT policy to only allow users to view their own profile
-- Drop existing overly permissive policy
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

-- Create secure policy: users can only view their own profile
CREATE POLICY "Users can view own profile only"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Allow viewing other profiles only when needed for proposals (seller/proposer interaction)
CREATE POLICY "Users can view profiles of proposal participants"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.proposals p
    WHERE (p.proposer_id = auth.uid() AND p.seller_id = profiles.id)
       OR (p.seller_id = auth.uid() AND p.proposer_id = profiles.id)
  )
);

-- Fix 2: Update kyc_verifications - Ensure only authenticated users can access their own data
-- The existing policies are already restrictive, but let's verify and strengthen them
DROP POLICY IF EXISTS "Users can view own KYC" ON public.kyc_verifications;
DROP POLICY IF EXISTS "Users can insert own KYC" ON public.kyc_verifications;
DROP POLICY IF EXISTS "Users can update pending KYC" ON public.kyc_verifications;

-- Recreate with explicit authenticated requirement
CREATE POLICY "Users can view own KYC only"
ON public.kyc_verifications
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own KYC only"
ON public.kyc_verifications
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pending KYC only"
ON public.kyc_verifications
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id AND status = 'pending')
WITH CHECK (auth.uid() = user_id);

-- Admin policies for KYC review (using has_role function)
CREATE POLICY "Admins can view all KYC"
ON public.kyc_verifications
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all KYC"
ON public.kyc_verifications
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
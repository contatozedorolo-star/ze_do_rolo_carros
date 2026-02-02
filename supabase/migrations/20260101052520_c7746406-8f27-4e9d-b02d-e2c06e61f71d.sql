-- Fix: Prevent exposure of sensitive profile fields (CPF/phone) to other users
-- The policy "Users can view limited profiles of proposal participants" allows proposal participants to read the full profiles row.
-- Since RLS is row-based (not column-based), this risks exposing CPF/phone.

DROP POLICY IF EXISTS "Users can view limited profiles of proposal participants" ON public.profiles;

-- Ensure admins can still review users (e.g., Admin KYC)
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

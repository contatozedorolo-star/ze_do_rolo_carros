-- Remove the old overly permissive policy that still exists
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
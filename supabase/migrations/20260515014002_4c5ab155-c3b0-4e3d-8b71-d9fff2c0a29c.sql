
-- 1) Tighten vehicle-images bucket INSERT to require user folder ownership
DROP POLICY IF EXISTS "Authenticated users can upload vehicle images" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload vehicle images to their folder" ON storage.objects;

CREATE POLICY "Users can upload vehicle images to their folder"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'vehicle-images'
  AND (auth.uid())::text = (storage.foldername(name))[1]
);

-- 2) Defensive RESTRICTIVE policy: only admins can ever insert into user_roles
DROP POLICY IF EXISTS "Only admins may insert roles" ON public.user_roles;
CREATE POLICY "Only admins may insert roles"
ON public.user_roles
AS RESTRICTIVE
FOR INSERT
TO authenticated, anon
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- 3) Defensive RESTRICTIVE policy: only admins can update/delete roles
DROP POLICY IF EXISTS "Only admins may modify roles" ON public.user_roles;
CREATE POLICY "Only admins may modify roles"
ON public.user_roles
AS RESTRICTIVE
FOR UPDATE
TO authenticated, anon
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Only admins may delete roles" ON public.user_roles;
CREATE POLICY "Only admins may delete roles"
ON public.user_roles
AS RESTRICTIVE
FOR DELETE
TO authenticated, anon
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

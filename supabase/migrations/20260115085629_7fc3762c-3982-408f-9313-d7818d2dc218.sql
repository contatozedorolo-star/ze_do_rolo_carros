-- Update existing profiles with phone and cpf from auth.users metadata
UPDATE public.profiles p
SET 
  phone = COALESCE(p.phone, au.raw_user_meta_data ->> 'phone'),
  cpf = COALESCE(p.cpf, au.raw_user_meta_data ->> 'cpf')
FROM auth.users au
WHERE p.id = au.id
  AND (p.phone IS NULL OR p.cpf IS NULL);
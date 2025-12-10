-- Inserir role admin para o usuário contatozedorolo@gmail.com
-- Buscamos pelo email na tabela profiles e inserimos o role
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM public.profiles
WHERE email = 'contatozedorolo@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;
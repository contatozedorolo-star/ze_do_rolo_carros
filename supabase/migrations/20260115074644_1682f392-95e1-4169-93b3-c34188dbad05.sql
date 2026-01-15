-- Adiciona role de admin para o usuário contatozedorolo@gmail.com
INSERT INTO public.user_roles (user_id, role) 
VALUES ('c68e1ece-ff5e-4486-b286-1c44b4d1d885', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
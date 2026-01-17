-- Corrigir o preço do Honda HR-V que foi salvo incorretamente
-- O usuário digitou 110.000 mas foi salvo como 110.00
UPDATE public.vehicles 
SET price = 110000 
WHERE id = '44cf97bb-5b10-4b14-a60b-41219e24936a' AND price = 110;
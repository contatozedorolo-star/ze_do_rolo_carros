-- Add CNPJ column to profiles table for legal entities
ALTER TABLE public.profiles 
ADD COLUMN cnpj TEXT DEFAULT NULL;

-- Add a comment to document the column
COMMENT ON COLUMN public.profiles.cnpj IS 'CNPJ for legal entities (pessoa jurídica), 14 digits without formatting';
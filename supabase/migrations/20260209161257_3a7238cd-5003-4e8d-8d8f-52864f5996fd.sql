-- Add subcategory columns for trator and implemento
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS trator_subcategory text;
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS implemento_subcategory text;
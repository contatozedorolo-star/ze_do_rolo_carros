ALTER TABLE public.vehicles
  ADD COLUMN IF NOT EXISTS consta_documento boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS has_sinistro boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS has_spare_key boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS has_owner_manual boolean DEFAULT false;
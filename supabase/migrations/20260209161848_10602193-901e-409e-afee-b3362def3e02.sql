-- Add hours_use for tractors/implements and power_cv for tractors
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS hours_use integer;
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS power_cv integer;
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS traction text;
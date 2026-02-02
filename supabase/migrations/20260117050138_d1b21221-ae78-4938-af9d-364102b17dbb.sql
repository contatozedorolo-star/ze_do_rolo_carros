-- Remove all check constraints on rating columns
ALTER TABLE public.vehicles DROP CONSTRAINT IF EXISTS vehicles_rating_documentacao_check;
ALTER TABLE public.vehicles DROP CONSTRAINT IF EXISTS vehicles_rating_motor_check;
ALTER TABLE public.vehicles DROP CONSTRAINT IF EXISTS vehicles_rating_cambio_check;
ALTER TABLE public.vehicles DROP CONSTRAINT IF EXISTS vehicles_rating_freios_check;
ALTER TABLE public.vehicles DROP CONSTRAINT IF EXISTS vehicles_rating_estetica_check;
ALTER TABLE public.vehicles DROP CONSTRAINT IF EXISTS vehicles_rating_lataria_check;
ALTER TABLE public.vehicles DROP CONSTRAINT IF EXISTS vehicles_rating_suspensao_check;
ALTER TABLE public.vehicles DROP CONSTRAINT IF EXISTS vehicles_rating_pneus_check;
ALTER TABLE public.vehicles DROP CONSTRAINT IF EXISTS vehicles_rating_mecanica_geral_check;
ALTER TABLE public.vehicles DROP CONSTRAINT IF EXISTS vehicles_rating_eletrica_check;
ALTER TABLE public.vehicles DROP CONSTRAINT IF EXISTS vehicles_rating_interior_check;

-- Ensure all rating columns allow NULL and have default values
ALTER TABLE public.vehicles 
  ALTER COLUMN rating_documentacao SET DEFAULT 5,
  ALTER COLUMN rating_motor SET DEFAULT 5,
  ALTER COLUMN rating_cambio SET DEFAULT 5,
  ALTER COLUMN rating_freios SET DEFAULT 5,
  ALTER COLUMN rating_estetica SET DEFAULT 5,
  ALTER COLUMN rating_lataria SET DEFAULT 5,
  ALTER COLUMN rating_suspensao SET DEFAULT 5,
  ALTER COLUMN rating_pneus SET DEFAULT 5,
  ALTER COLUMN rating_mecanica_geral SET DEFAULT 5,
  ALTER COLUMN rating_eletrica SET DEFAULT 5,
  ALTER COLUMN rating_interior SET DEFAULT 5;

-- Make rating columns nullable
ALTER TABLE public.vehicles 
  ALTER COLUMN rating_documentacao DROP NOT NULL,
  ALTER COLUMN rating_motor DROP NOT NULL,
  ALTER COLUMN rating_cambio DROP NOT NULL,
  ALTER COLUMN rating_freios DROP NOT NULL,
  ALTER COLUMN rating_estetica DROP NOT NULL,
  ALTER COLUMN rating_lataria DROP NOT NULL,
  ALTER COLUMN rating_suspensao DROP NOT NULL,
  ALTER COLUMN rating_pneus DROP NOT NULL,
  ALTER COLUMN rating_mecanica_geral DROP NOT NULL,
  ALTER COLUMN rating_eletrica DROP NOT NULL,
  ALTER COLUMN rating_interior DROP NOT NULL;
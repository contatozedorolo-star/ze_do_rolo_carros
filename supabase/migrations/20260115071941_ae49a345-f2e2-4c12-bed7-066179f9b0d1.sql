-- Adicionar "onibus" ao enum vehicle_type
ALTER TYPE vehicle_type ADD VALUE IF NOT EXISTS 'onibus';

-- Adicionar campo bus_subcategory para subcategorias de ônibus (onibus ou micro_onibus)
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS bus_subcategory text;

-- Adicionar campo bus_optionals para opcionais específicos de ônibus
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS bus_optionals text[];
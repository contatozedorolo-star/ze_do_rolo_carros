-- Adicionar campos específicos para MOTOS
ALTER TABLE public.vehicles 
ADD COLUMN IF NOT EXISTS is_chassis_remarked BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS fuel_system VARCHAR(50);

-- Atualizar enum moto_style para incluir mais estilos
-- Primeiro precisamos adicionar os novos valores
DO $$ 
BEGIN
  -- Adicionar novos estilos de moto se não existirem
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'ciclomotor' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'moto_style_enum')) THEN
    ALTER TYPE moto_style_enum ADD VALUE 'ciclomotor';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'eletrica' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'moto_style_enum')) THEN
    ALTER TYPE moto_style_enum ADD VALUE 'eletrica';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'quadriciclo' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'moto_style_enum')) THEN
    ALTER TYPE moto_style_enum ADD VALUE 'quadriciclo';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'supermotard' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'moto_style_enum')) THEN
    ALTER TYPE moto_style_enum ADD VALUE 'supermotard';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'big_trail' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'moto_style_enum')) THEN
    ALTER TYPE moto_style_enum ADD VALUE 'big_trail';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'trial' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'moto_style_enum')) THEN
    ALTER TYPE moto_style_enum ADD VALUE 'trial';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'triciclo' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'moto_style_enum')) THEN
    ALTER TYPE moto_style_enum ADD VALUE 'triciclo';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'utilitaria' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'moto_style_enum')) THEN
    ALTER TYPE moto_style_enum ADD VALUE 'utilitaria';
  END IF;
END $$;
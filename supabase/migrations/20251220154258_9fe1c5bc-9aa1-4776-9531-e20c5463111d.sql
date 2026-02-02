-- Adicionar novos campos de diagnóstico
ALTER TABLE public.vehicles 
ADD COLUMN IF NOT EXISTS rating_cambio integer DEFAULT 5 CHECK (rating_cambio >= 0 AND rating_cambio <= 10),
ADD COLUMN IF NOT EXISTS rating_freios integer DEFAULT 5 CHECK (rating_freios >= 0 AND rating_freios <= 10),
ADD COLUMN IF NOT EXISTS rating_suspensao integer DEFAULT 5 CHECK (rating_suspensao >= 0 AND rating_suspensao <= 10),
ADD COLUMN IF NOT EXISTS rating_estetica integer DEFAULT 5 CHECK (rating_estetica >= 0 AND rating_estetica <= 10),
ADD COLUMN IF NOT EXISTS rating_mecanica_geral integer DEFAULT 5 CHECK (rating_mecanica_geral >= 0 AND rating_mecanica_geral <= 10),
ADD COLUMN IF NOT EXISTS rating_eletrica integer DEFAULT 5 CHECK (rating_eletrica >= 0 AND rating_eletrica <= 10);

-- Atualizar ratings existentes para escala 0-10
ALTER TABLE public.vehicles 
ALTER COLUMN rating_motor TYPE integer,
ALTER COLUMN rating_lataria TYPE integer,
ALTER COLUMN rating_pneus TYPE integer,
ALTER COLUMN rating_interior TYPE integer,
ALTER COLUMN rating_documentacao TYPE integer;

-- Adicionar campos de negociação/troca
ALTER TABLE public.vehicles 
ADD COLUMN IF NOT EXISTS ideal_trade_description text,
ADD COLUMN IF NOT EXISTS trade_value_accepted numeric,
ADD COLUMN IF NOT EXISTS min_cash_return numeric,
ADD COLUMN IF NOT EXISTS ownership_time text;

-- Campos de procedência
ALTER TABLE public.vehicles 
ADD COLUMN IF NOT EXISTS is_auction boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS auction_reason text,
ADD COLUMN IF NOT EXISTS is_chassis_remarked boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS is_single_owner boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS has_service_history boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS ipva_paid boolean DEFAULT false;

-- Campos específicos para CARROS
ALTER TABLE public.vehicles 
ADD COLUMN IF NOT EXISTS is_armored boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS body_type text,
ADD COLUMN IF NOT EXISTS need_type text[];

-- Campos específicos para MOTOS
ALTER TABLE public.vehicles 
ADD COLUMN IF NOT EXISTS cylinders integer,
ADD COLUMN IF NOT EXISTS start_type text,
ADD COLUMN IF NOT EXISTS motor_type text,
ADD COLUMN IF NOT EXISTS brake_type text,
ADD COLUMN IF NOT EXISTS fuel_system text,
ADD COLUMN IF NOT EXISTS moto_style text,
ADD COLUMN IF NOT EXISTS moto_optionals text[];

-- Campos específicos para CAMINHÕES
ALTER TABLE public.vehicles 
ADD COLUMN IF NOT EXISTS truck_type text,
ADD COLUMN IF NOT EXISTS truck_traction text,
ADD COLUMN IF NOT EXISTS truck_body text,
ADD COLUMN IF NOT EXISTS truck_cabin text;

-- Campos específicos para VANS
ALTER TABLE public.vehicles 
ADD COLUMN IF NOT EXISTS van_subcategory text;

-- Criar enum para tipos de carroceria de carro
DO $$ BEGIN
    CREATE TYPE body_type_enum AS ENUM ('suv', 'sedan', 'hatch', 'pickup', 'coupe', 'conversivel', 'wagon', 'minivan');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Criar enum para estilos de moto
DO $$ BEGIN
    CREATE TYPE moto_style_enum AS ENUM ('custom', 'esportiva', 'naked', 'scooter', 'trail', 'touring', 'street', 'cross');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Criar enum para tipos de caminhão
DO $$ BEGIN
    CREATE TYPE truck_type_enum AS ENUM ('3_4', 'toco', 'truck', 'bitruck', 'cavalo_mecanico', 'vuc');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Criar índices para melhorar performance dos filtros
CREATE INDEX IF NOT EXISTS idx_vehicles_body_type ON public.vehicles(body_type);
CREATE INDEX IF NOT EXISTS idx_vehicles_cylinders ON public.vehicles(cylinders);
CREATE INDEX IF NOT EXISTS idx_vehicles_truck_type ON public.vehicles(truck_type);
CREATE INDEX IF NOT EXISTS idx_vehicles_van_subcategory ON public.vehicles(van_subcategory);
CREATE INDEX IF NOT EXISTS idx_vehicles_is_armored ON public.vehicles(is_armored);
CREATE INDEX IF NOT EXISTS idx_vehicles_is_auction ON public.vehicles(is_auction);
CREATE INDEX IF NOT EXISTS idx_vehicles_ipva_paid ON public.vehicles(ipva_paid);
CREATE INDEX IF NOT EXISTS idx_vehicles_is_single_owner ON public.vehicles(is_single_owner);
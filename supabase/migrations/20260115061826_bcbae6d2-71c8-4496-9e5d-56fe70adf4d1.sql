-- Add new fields to vehicles table for the comprehensive car registration form

-- Etapa 1: Identificação e Carroceria expandida
-- (body_type já existe, mas vamos garantir os novos valores)

-- Etapa 2: Dados Técnicos adicionais
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS seats INTEGER DEFAULT NULL;
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS engine_liters DECIMAL(3,1) DEFAULT NULL;

-- Etapa 3: Checklist e Histórico
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS is_financed BOOLEAN DEFAULT FALSE;
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS auction_reason TEXT DEFAULT NULL;
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS insurance_covers_100 TEXT DEFAULT NULL; -- 'sim', 'nao', 'nao_sei'
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS insurance_coverage_percent INTEGER DEFAULT NULL;
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS has_warranty BOOLEAN DEFAULT FALSE;

-- Etapa 4: Diagnóstico - adicionar campos faltantes
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS rating_lataria INTEGER DEFAULT NULL;
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS rating_interior INTEGER DEFAULT NULL;

-- Etapa 5: O Negócio Ideal - adicionar campos para restrições de troca
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS trade_priority TEXT DEFAULT 'dinheiro'; -- 'dinheiro', 'troca', 'indiferente'
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS max_cash_return INTEGER DEFAULT NULL;
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS trade_restrictions TEXT[] DEFAULT NULL;

-- Etapa 6: Galeria expandida - campo para controlar quais fotos foram enviadas
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS photo_checklist JSONB DEFAULT NULL;

-- Add new body types for cars (buggy, van are new)
-- These will be handled in the body_type column which already exists as TEXT

-- Update body_type_enum to include new types (if it exists)
-- Note: We're using TEXT for body_type in vehicles table, so no enum update needed
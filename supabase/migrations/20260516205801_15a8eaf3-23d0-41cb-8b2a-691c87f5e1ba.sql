ALTER TABLE public.vehicles
  ADD COLUMN IF NOT EXISTS perfect_deal_description TEXT,
  ADD COLUMN IF NOT EXISTS negative_filters_description TEXT;
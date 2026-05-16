ALTER TABLE public.vehicles 
  ADD COLUMN IF NOT EXISTS trade_vehicle_preference TEXT,
  ADD COLUMN IF NOT EXISTS trade_unaccepted_description TEXT;
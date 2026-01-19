-- Add 'trator' and 'implemento' to the vehicle_type enum
ALTER TYPE vehicle_type ADD VALUE IF NOT EXISTS 'trator';
ALTER TYPE vehicle_type ADD VALUE IF NOT EXISTS 'implemento';
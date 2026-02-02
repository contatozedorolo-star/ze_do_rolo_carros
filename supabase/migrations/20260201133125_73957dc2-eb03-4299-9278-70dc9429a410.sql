-- Create ENUM for vehicle moderation status
CREATE TYPE vehicle_moderation_status AS ENUM ('pending', 'approved', 'rejected');

-- Add moderation_status column to vehicles table
ALTER TABLE vehicles 
ADD COLUMN moderation_status vehicle_moderation_status DEFAULT 'pending';

-- Approve all existing vehicles automatically
UPDATE vehicles SET moderation_status = 'approved';

-- Drop and recreate the public view policy to include moderation check
DROP POLICY IF EXISTS "Anyone can view active vehicles" ON vehicles;

CREATE POLICY "Anyone can view active approved vehicles" 
ON vehicles 
FOR SELECT 
USING (is_active = true AND moderation_status = 'approved');

-- Allow admins to view ALL vehicles (including pending) for moderation
CREATE POLICY "Admins can view all vehicles for moderation"
ON vehicles
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow vehicle owners to view their own vehicles regardless of status
CREATE POLICY "Users can view their own vehicles"
ON vehicles
FOR SELECT
USING (auth.uid() = user_id);
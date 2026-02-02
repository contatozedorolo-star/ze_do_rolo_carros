-- Create table to track vehicle views
CREATE TABLE public.vehicle_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  viewer_id UUID,
  ip_hash TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.vehicle_views ENABLE ROW LEVEL SECURITY;

-- Policy for inserting views (anyone can insert)
CREATE POLICY "Anyone can insert vehicle views"
ON public.vehicle_views
FOR INSERT
WITH CHECK (true);

-- Policy for admins to read all views
CREATE POLICY "Admins can read all vehicle views"
ON public.vehicle_views
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- Policy for vehicle owners to read their vehicle views
CREATE POLICY "Owners can read their vehicle views"
ON public.vehicle_views
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.vehicles
    WHERE vehicles.id = vehicle_views.vehicle_id
    AND vehicles.user_id = auth.uid()
  )
);

-- Create index for faster queries
CREATE INDEX idx_vehicle_views_vehicle_id ON public.vehicle_views(vehicle_id);
CREATE INDEX idx_vehicle_views_viewed_at ON public.vehicle_views(viewed_at);
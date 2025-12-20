-- Create storage bucket for vehicle images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'vehicle-images', 
  'vehicle-images', 
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- Policy: Anyone can view vehicle images (public bucket)
CREATE POLICY "Anyone can view vehicle images"
ON storage.objects FOR SELECT
USING (bucket_id = 'vehicle-images');

-- Policy: Authenticated users can upload vehicle images
CREATE POLICY "Authenticated users can upload vehicle images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'vehicle-images' 
  AND auth.role() = 'authenticated'
);

-- Policy: Users can update their own vehicle images
CREATE POLICY "Users can update their own vehicle images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'vehicle-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Users can delete their own vehicle images
CREATE POLICY "Users can delete their own vehicle images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'vehicle-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Ensure pgvector extension is active
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;

-- Create match_documents function for n8n Supabase Vector Store integration
CREATE OR REPLACE FUNCTION public.match_documents(
  query_embedding extensions.vector(1536),
  match_count int DEFAULT 5,
  filter jsonb DEFAULT '{}'::jsonb
)
RETURNS TABLE(
  id uuid,
  content text,
  metadata jsonb,
  similarity float
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = 'public', 'extensions'
AS $$
BEGIN
  RETURN QUERY
  SELECT
    v.id,
    (v.brand || ' ' || v.model || ' - ' || COALESCE(v.description, ''))::text AS content,
    jsonb_build_object(
      'price', v.price,
      'year_model', v.year_model,
      'city', v.city,
      'state', v.state,
      'vehicle_type', v.vehicle_type,
      'km', v.km
    ) AS metadata,
    (1 - (v.embedding OPERATOR(extensions.<=>) query_embedding))::float AS similarity
  FROM vehicles v
  WHERE v.is_active = true
    AND v.is_sold = false
    AND v.embedding IS NOT NULL
  ORDER BY v.embedding OPERATOR(extensions.<=>) query_embedding
  LIMIT match_count;
END;
$$;

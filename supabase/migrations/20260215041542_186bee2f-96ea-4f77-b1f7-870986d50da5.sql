
CREATE OR REPLACE FUNCTION public.match_documents(
  query_embedding extensions.vector(1536),
  match_count int DEFAULT 5,
  filter jsonb DEFAULT '{}'::jsonb
)
RETURNS TABLE (
  id uuid,
  content text,
  metadata jsonb,
  similarity float
)
LANGUAGE plpgsql
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
      'km', v.km,
      'url', 'https://zedorolo.com/veiculo/' ||
        regexp_replace(
          regexp_replace(
            regexp_replace(
              lower(extensions.unaccent(v.brand || '-' || v.model || '-' || v.year_model::text || COALESCE('-' || v.version, ''))),
              '[^a-z0-9\s-]', '', 'g'
            ),
            '\s+', '-', 'g'
          ),
          '-+', '-', 'g'
        ) || '-' || v.id::text
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

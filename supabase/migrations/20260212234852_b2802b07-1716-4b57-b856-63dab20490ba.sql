
-- Mover extensão vector para schema extensions (caso já exista em outro schema)
DROP EXTENSION IF EXISTS vector;
CREATE EXTENSION vector WITH SCHEMA extensions;

-- Adicionar coluna embedding
ALTER TABLE public.vehicles
ADD COLUMN embedding extensions.vector(1536);

-- Índice HNSW
CREATE INDEX idx_vehicles_embedding_hnsw
ON public.vehicles
USING hnsw (embedding extensions.vector_cosine_ops);

-- Função de busca semântica
CREATE OR REPLACE FUNCTION public.match_vehicles(
  query_embedding extensions.vector(1536),
  match_count int DEFAULT 5
)
RETURNS TABLE(
  id uuid,
  title text,
  brand text,
  model text,
  year_model int,
  price numeric,
  city text,
  state text,
  description text,
  vehicle_type text,
  km int,
  fuel text,
  transmission text,
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
    v.title,
    v.brand,
    v.model,
    v.year_model,
    v.price::numeric,
    v.city,
    v.state,
    v.description,
    v.vehicle_type::text,
    v.km,
    v.fuel::text,
    v.transmission::text,
    (1 - (v.embedding OPERATOR(extensions.<=>) query_embedding))::float AS similarity
  FROM vehicles v
  WHERE v.is_active = true
    AND v.is_sold = false
    AND v.embedding IS NOT NULL
  ORDER BY v.embedding OPERATOR(extensions.<=>) query_embedding
  LIMIT match_count;
END;
$$;

-- Trigger para gerar embedding via pg_net
CREATE OR REPLACE FUNCTION public.trigger_generate_embedding()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  IF TG_OP = 'INSERT' OR
     OLD.brand IS DISTINCT FROM NEW.brand OR
     OLD.model IS DISTINCT FROM NEW.model OR
     OLD.title IS DISTINCT FROM NEW.title OR
     OLD.price IS DISTINCT FROM NEW.price OR
     OLD.description IS DISTINCT FROM NEW.description OR
     OLD.city IS DISTINCT FROM NEW.city OR
     OLD.state IS DISTINCT FROM NEW.state OR
     OLD.optionals IS DISTINCT FROM NEW.optionals OR
     OLD.body_type IS DISTINCT FROM NEW.body_type OR
     OLD.fuel IS DISTINCT FROM NEW.fuel OR
     OLD.transmission IS DISTINCT FROM NEW.transmission OR
     OLD.km IS DISTINCT FROM NEW.km OR
     OLD.year_model IS DISTINCT FROM NEW.year_model OR
     OLD.vehicle_type IS DISTINCT FROM NEW.vehicle_type OR
     OLD.color IS DISTINCT FROM NEW.color
  THEN
    PERFORM net.http_post(
      url := 'https://muvornzsnhncihxawntz.supabase.co/functions/v1/generate-vehicle-embedding',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11dm9ybnpzbmhuY2loeGF3bnR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyMzY5ODQsImV4cCI6MjA4MTgxMjk4NH0.ZRdSA52XyWOPvw7cS6xnkeUyfqsCFq-mUu_PYaymTyA'
      ),
      body := jsonb_build_object('vehicle_id', NEW.id::text)
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Trigger
DROP TRIGGER IF EXISTS on_vehicle_upsert_generate_embedding ON public.vehicles;
CREATE TRIGGER on_vehicle_upsert_generate_embedding
AFTER INSERT OR UPDATE ON public.vehicles
FOR EACH ROW
EXECUTE FUNCTION public.trigger_generate_embedding();

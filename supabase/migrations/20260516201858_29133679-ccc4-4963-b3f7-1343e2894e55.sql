-- Profiles: novos campos da Etapa 01
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS birth_date date,
  ADD COLUMN IF NOT EXISTS address_street text,
  ADD COLUMN IF NOT EXISTS address_number text,
  ADD COLUMN IF NOT EXISTS address_complement text,
  ADD COLUMN IF NOT EXISTS address_neighborhood text;

-- KYC: novos uploads da Etapa 02
ALTER TABLE public.kyc_verifications
  ADD COLUMN IF NOT EXISTS selfie_with_document_url text,
  ADD COLUMN IF NOT EXISTS residence_proof_url text;

-- Proposals: rastreio do match e do KYC de cada lado
ALTER TABLE public.proposals
  ADD COLUMN IF NOT EXISTS buyer_kyc_completed boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS seller_kyc_completed boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS matched_at timestamptz;

-- Libera INSERT de proposta sem exigir KYC aprovado
DROP POLICY IF EXISTS "Users with approved KYC can create proposals" ON public.proposals;
CREATE POLICY "Authenticated users can create proposals"
  ON public.proposals
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = proposer_id);

-- Trigger: marca matched_at quando vendedor aceita
CREATE OR REPLACE FUNCTION public.handle_proposal_match()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'accepted' AND (OLD.status IS NULL OR OLD.status <> 'accepted') THEN
    NEW.matched_at := now();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_proposal_match ON public.proposals;
CREATE TRIGGER trg_proposal_match
  BEFORE UPDATE ON public.proposals
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_proposal_match();

-- handle_new_user: gravar novos campos do profile vindos do signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE _full_name TEXT; _email TEXT; _avatar_url TEXT;
BEGIN
  _full_name := COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', '');
  _email := COALESCE(NEW.email, '');
  _avatar_url := COALESCE(NEW.raw_user_meta_data ->> 'avatar_url', NEW.raw_user_meta_data ->> 'picture', NULL);

  INSERT INTO public.profiles (
    id, full_name, phone, cpf, state, avatar_url,
    birth_date, cep, address_street, address_number, address_complement, address_neighborhood, city
  ) VALUES (
    NEW.id,
    _full_name,
    NEW.raw_user_meta_data ->> 'phone',
    NEW.raw_user_meta_data ->> 'cpf',
    NEW.raw_user_meta_data ->> 'state',
    _avatar_url,
    NULLIF(NEW.raw_user_meta_data ->> 'birth_date','')::date,
    NEW.raw_user_meta_data ->> 'cep',
    NEW.raw_user_meta_data ->> 'address_street',
    NEW.raw_user_meta_data ->> 'address_number',
    NEW.raw_user_meta_data ->> 'address_complement',
    NEW.raw_user_meta_data ->> 'address_neighborhood',
    NEW.raw_user_meta_data ->> 'city'
  );

  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');

  IF _email <> '' THEN
    PERFORM net.http_post(
      url := 'https://muvornzsnhncihxawntz.supabase.co/functions/v1/send-welcome-email',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11dm9ybnpzbmhuY2loeGF3bnR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyMzY5ODQsImV4cCI6MjA4MTgxMjk4NH0.ZRdSA52XyWOPvw7cS6xnkeUyfqsCFq-mUu_PYaymTyA',
        'x-internal-secret', private.get_internal_secret()
      ),
      body := jsonb_build_object('email', _email, 'name', _full_name)
    );
  END IF;
  RETURN NEW;
END;
$$;
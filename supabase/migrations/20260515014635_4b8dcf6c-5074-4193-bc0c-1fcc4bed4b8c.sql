
-- 1. Private schema with the shared secret
CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon, authenticated;

CREATE TABLE IF NOT EXISTS private.app_secrets (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
REVOKE ALL ON private.app_secrets FROM PUBLIC, anon, authenticated;

INSERT INTO private.app_secrets (key, value)
VALUES ('internal_function_secret', '64bbc96998bc9ea35aecdbf94fb709d87bd257a2f7f0786f25102096c2f0e235')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

CREATE OR REPLACE FUNCTION private.get_internal_secret()
RETURNS TEXT
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = private
AS $$
  SELECT value FROM private.app_secrets WHERE key = 'internal_function_secret'
$$;
REVOKE ALL ON FUNCTION private.get_internal_secret() FROM PUBLIC, anon, authenticated;

-- 2. Update all email trigger functions to send x-internal-secret header
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE _full_name TEXT; _email TEXT; _avatar_url TEXT;
BEGIN
  _full_name := COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', '');
  _email := COALESCE(NEW.email, '');
  _avatar_url := COALESCE(NEW.raw_user_meta_data ->> 'avatar_url', NEW.raw_user_meta_data ->> 'picture', NULL);

  INSERT INTO public.profiles (id, full_name, phone, cpf, state, avatar_url)
  VALUES (NEW.id, _full_name, NEW.raw_user_meta_data ->> 'phone', NEW.raw_user_meta_data ->> 'cpf', NEW.raw_user_meta_data ->> 'state', _avatar_url);

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

CREATE OR REPLACE FUNCTION public.handle_kyc_under_review()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE _email TEXT; _name TEXT;
BEGIN
  IF NEW.status = 'under_review' AND (OLD.status IS NULL OR OLD.status <> 'under_review') THEN
    SELECT email INTO _email FROM auth.users WHERE id = NEW.user_id;
    SELECT full_name INTO _name FROM public.profiles WHERE id = NEW.user_id;
    IF _email IS NOT NULL AND _email <> '' THEN
      PERFORM net.http_post(
        url := 'https://muvornzsnhncihxawntz.supabase.co/functions/v1/send-document-status-email',
        headers := jsonb_build_object('Content-Type', 'application/json',
          'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11dm9ybnpzbmhuY2loeGF3bnR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyMzY5ODQsImV4cCI6MjA4MTgxMjk4NH0.ZRdSA52XyWOPvw7cS6xnkeUyfqsCFq-mUu_PYaymTyA',
          'x-internal-secret', private.get_internal_secret()),
        body := jsonb_build_object('email', _email, 'name', COALESCE(_name, ''))
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_kyc_approved()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE _email TEXT; _name TEXT;
BEGIN
  IF NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status <> 'approved') THEN
    SELECT email INTO _email FROM auth.users WHERE id = NEW.user_id;
    SELECT full_name INTO _name FROM public.profiles WHERE id = NEW.user_id;
    IF _email IS NOT NULL AND _email <> '' THEN
      PERFORM net.http_post(
        url := 'https://muvornzsnhncihxawntz.supabase.co/functions/v1/send-account-approved-email',
        headers := jsonb_build_object('Content-Type', 'application/json',
          'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11dm9ybnpzbmhuY2loeGF3bnR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyMzY5ODQsImV4cCI6MjA4MTgxMjk4NH0.ZRdSA52XyWOPvw7cS6xnkeUyfqsCFq-mUu_PYaymTyA',
          'x-internal-secret', private.get_internal_secret()),
        body := jsonb_build_object('email', _email, 'name', COALESCE(_name, ''))
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_kyc_rejected()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE _email TEXT; _name TEXT;
BEGIN
  IF NEW.status = 'rejected' AND (OLD.status IS NULL OR OLD.status <> 'rejected') THEN
    SELECT email INTO _email FROM auth.users WHERE id = NEW.user_id;
    SELECT full_name INTO _name FROM public.profiles WHERE id = NEW.user_id;
    IF _email IS NOT NULL AND _email <> '' THEN
      PERFORM net.http_post(
        url := 'https://muvornzsnhncihxawntz.supabase.co/functions/v1/send-document-rejected-email',
        headers := jsonb_build_object('Content-Type', 'application/json',
          'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11dm9ybnpzbmhuY2loeGF3bnR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyMzY5ODQsImV4cCI6MjA4MTgxMjk4NH0.ZRdSA52XyWOPvw7cS6xnkeUyfqsCFq-mUu_PYaymTyA',
          'x-internal-secret', private.get_internal_secret()),
        body := jsonb_build_object('email', _email, 'name', COALESCE(_name, ''),
          'rejection_reason', COALESCE(NEW.rejection_reason, 'Documento não atendeu aos critérios de verificação.'))
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_vehicle_pending()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE _email TEXT; _name TEXT;
BEGIN
  IF NEW.moderation_status = 'pending' THEN
    SELECT email INTO _email FROM auth.users WHERE id = NEW.user_id;
    SELECT full_name INTO _name FROM public.profiles WHERE id = NEW.user_id;
    IF _email IS NOT NULL AND _email <> '' THEN
      PERFORM net.http_post(
        url := 'https://muvornzsnhncihxawntz.supabase.co/functions/v1/send-ad-pending-email',
        headers := jsonb_build_object('Content-Type', 'application/json',
          'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11dm9ybnpzbmhuY2loeGF3bnR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyMzY5ODQsImV4cCI6MjA4MTgxMjk4NH0.ZRdSA52XyWOPvw7cS6xnkeUyfqsCFq-mUu_PYaymTyA',
          'x-internal-secret', private.get_internal_secret()),
        body := jsonb_build_object('email', _email, 'name', COALESCE(_name, ''), 'vehicle_title', NEW.title)
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_vehicle_approved()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE _email TEXT; _name TEXT;
BEGIN
  IF NEW.moderation_status = 'approved' AND (OLD.moderation_status IS NULL OR OLD.moderation_status <> 'approved') THEN
    SELECT email INTO _email FROM auth.users WHERE id = NEW.user_id;
    SELECT full_name INTO _name FROM public.profiles WHERE id = NEW.user_id;
    IF _email IS NOT NULL AND _email <> '' THEN
      PERFORM net.http_post(
        url := 'https://muvornzsnhncihxawntz.supabase.co/functions/v1/send-ad-approved-email',
        headers := jsonb_build_object('Content-Type', 'application/json',
          'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11dm9ybnpzbmhuY2loeGF3bnR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyMzY5ODQsImV4cCI6MjA4MTgxMjk4NH0.ZRdSA52XyWOPvw7cS6xnkeUyfqsCFq-mUu_PYaymTyA',
          'x-internal-secret', private.get_internal_secret()),
        body := jsonb_build_object('email', _email, 'name', COALESCE(_name, ''), 'vehicle_title', NEW.title)
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_vehicle_rejected()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE _email TEXT; _name TEXT;
BEGIN
  IF NEW.moderation_status = 'rejected' AND (OLD.moderation_status IS NULL OR OLD.moderation_status <> 'rejected') THEN
    SELECT email INTO _email FROM auth.users WHERE id = NEW.user_id;
    SELECT full_name INTO _name FROM public.profiles WHERE id = NEW.user_id;
    IF _email IS NOT NULL AND _email <> '' THEN
      PERFORM net.http_post(
        url := 'https://muvornzsnhncihxawntz.supabase.co/functions/v1/send-ad-rejected-email',
        headers := jsonb_build_object('Content-Type', 'application/json',
          'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11dm9ybnpzbmhuY2loeGF3bnR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyMzY5ODQsImV4cCI6MjA4MTgxMjk4NH0.ZRdSA52XyWOPvw7cS6xnkeUyfqsCFq-mUu_PYaymTyA',
          'x-internal-secret', private.get_internal_secret()),
        body := jsonb_build_object('email', _email, 'name', COALESCE(_name, ''), 'vehicle_title', NEW.title,
          'rejection_reason', COALESCE(NEW.diagnostic_notes, 'O anúncio não atendeu aos critérios da plataforma.'))
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_proposal()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE _seller_email TEXT; _seller_name TEXT; _proposer_name TEXT; _vehicle_title TEXT;
BEGIN
  SELECT email INTO _seller_email FROM auth.users WHERE id = NEW.seller_id;
  SELECT full_name INTO _seller_name FROM public.profiles WHERE id = NEW.seller_id;
  SELECT full_name INTO _proposer_name FROM public.profiles WHERE id = NEW.proposer_id;
  SELECT title INTO _vehicle_title FROM public.vehicles WHERE id = NEW.vehicle_id;
  IF _seller_email IS NOT NULL AND _seller_email <> '' THEN
    PERFORM net.http_post(
      url := 'https://muvornzsnhncihxawntz.supabase.co/functions/v1/send-new-proposal-email',
      headers := jsonb_build_object('Content-Type', 'application/json',
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11dm9ybnpzbmhuY2loeGF3bnR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyMzY5ODQsImV4cCI6MjA4MTgxMjk4NH0.ZRdSA52XyWOPvw7cS6xnkeUyfqsCFq-mUu_PYaymTyA',
        'x-internal-secret', private.get_internal_secret()),
      body := jsonb_build_object('email', _seller_email, 'seller_name', COALESCE(_seller_name, ''),
        'proposer_name', COALESCE(_proposer_name, ''), 'vehicle_title', COALESCE(_vehicle_title, ''),
        'offer_amount', NEW.offer_amount)
    );
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_kyc_admin_alert()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE _user_email TEXT; _user_name TEXT;
BEGIN
  IF NEW.status = 'under_review' THEN
    SELECT email INTO _user_email FROM auth.users WHERE id = NEW.user_id;
    SELECT full_name INTO _user_name FROM public.profiles WHERE id = NEW.user_id;
    PERFORM net.http_post(
      url := 'https://muvornzsnhncihxawntz.supabase.co/functions/v1/send-admin-alert-email',
      headers := jsonb_build_object('Content-Type', 'application/json',
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11dm9ybnpzbmhuY2loeGF3bnR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyMzY5ODQsImV4cCI6MjA4MTgxMjk4NH0.ZRdSA52XyWOPvw7cS6xnkeUyfqsCFq-mUu_PYaymTyA',
        'x-internal-secret', private.get_internal_secret()),
      body := jsonb_build_object('alert_type', 'kyc_pending', 'user_name', COALESCE(_user_name, ''),
        'user_email', COALESCE(_user_email, ''))
    );
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_vehicle_admin_alert()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE _user_email TEXT; _user_name TEXT;
BEGIN
  IF NEW.moderation_status = 'pending' THEN
    SELECT email INTO _user_email FROM auth.users WHERE id = NEW.user_id;
    SELECT full_name INTO _user_name FROM public.profiles WHERE id = NEW.user_id;
    PERFORM net.http_post(
      url := 'https://muvornzsnhncihxawntz.supabase.co/functions/v1/send-admin-alert-email',
      headers := jsonb_build_object('Content-Type', 'application/json',
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11dm9ybnpzbmhuY2loeGF3bnR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyMzY5ODQsImV4cCI6MjA4MTgxMjk4NH0.ZRdSA52XyWOPvw7cS6xnkeUyfqsCFq-mUu_PYaymTyA',
        'x-internal-secret', private.get_internal_secret()),
      body := jsonb_build_object('alert_type', 'vehicle_pending', 'user_name', COALESCE(_user_name, ''),
        'user_email', COALESCE(_user_email, ''), 'vehicle_title', NEW.title)
    );
  END IF;
  RETURN NEW;
END;
$$;


-- Enable pg_net extension for HTTP calls from database
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Update handle_new_user to also handle OAuth metadata and call the welcome email edge function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _full_name TEXT;
  _email TEXT;
  _avatar_url TEXT;
BEGIN
  -- Extract name: OAuth providers may use 'full_name', 'name', or others
  _full_name := COALESCE(
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'name',
    ''
  );

  _email := COALESCE(NEW.email, '');

  _avatar_url := COALESCE(
    NEW.raw_user_meta_data ->> 'avatar_url',
    NEW.raw_user_meta_data ->> 'picture',
    NULL
  );

  -- Insert profile (handles both email/password and OAuth)
  INSERT INTO public.profiles (id, full_name, phone, cpf, state, avatar_url)
  VALUES (
    NEW.id,
    _full_name,
    NEW.raw_user_meta_data ->> 'phone',
    NEW.raw_user_meta_data ->> 'cpf',
    NEW.raw_user_meta_data ->> 'state',
    _avatar_url
  );

  -- Insert default user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');

  -- Call send-welcome-email edge function via pg_net
  IF _email <> '' THEN
    PERFORM net.http_post(
      url := 'https://muvornzsnhncihxawntz.supabase.co/functions/v1/send-welcome-email',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11dm9ybnpzbmhuY2loeGF3bnR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyMzY5ODQsImV4cCI6MjA4MTgxMjk4NH0.ZRdSA52XyWOPvw7cS6xnkeUyfqsCFq-mUu_PYaymTyA'
      ),
      body := jsonb_build_object(
        'email', _email,
        'name', _full_name
      )
    );
  END IF;

  RETURN NEW;
END;
$$;

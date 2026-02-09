
-- ===========================================
-- TRIGGER 1: Anúncio criado com status pending
-- ===========================================
CREATE OR REPLACE FUNCTION public.handle_vehicle_pending()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _email TEXT;
  _name TEXT;
BEGIN
  -- Only fire when a new vehicle is inserted with moderation_status = 'pending'
  IF NEW.moderation_status = 'pending' THEN
    -- Get user email from auth.users
    SELECT email INTO _email FROM auth.users WHERE id = NEW.user_id;
    
    -- Get user name from profiles
    SELECT full_name INTO _name FROM public.profiles WHERE id = NEW.user_id;

    IF _email IS NOT NULL AND _email <> '' THEN
      PERFORM net.http_post(
        url := 'https://muvornzsnhncihxawntz.supabase.co/functions/v1/send-ad-pending-email',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11dm9ybnpzbmhuY2loeGF3bnR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyMzY5ODQsImV4cCI6MjA4MTgxMjk4NH0.ZRdSA52XyWOPvw7cS6xnkeUyfqsCFq-mUu_PYaymTyA'
        ),
        body := jsonb_build_object(
          'email', _email,
          'name', COALESCE(_name, ''),
          'vehicle_title', NEW.title
        )
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_vehicle_created_pending
  AFTER INSERT ON public.vehicles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_vehicle_pending();

-- ===========================================
-- TRIGGER 2: Nova proposta criada
-- ===========================================
CREATE OR REPLACE FUNCTION public.handle_new_proposal()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _seller_email TEXT;
  _seller_name TEXT;
  _proposer_name TEXT;
  _vehicle_title TEXT;
BEGIN
  -- Get seller email from auth.users
  SELECT email INTO _seller_email FROM auth.users WHERE id = NEW.seller_id;
  
  -- Get seller name from profiles
  SELECT full_name INTO _seller_name FROM public.profiles WHERE id = NEW.seller_id;
  
  -- Get proposer name from profiles
  SELECT full_name INTO _proposer_name FROM public.profiles WHERE id = NEW.proposer_id;
  
  -- Get vehicle title
  SELECT title INTO _vehicle_title FROM public.vehicles WHERE id = NEW.vehicle_id;

  IF _seller_email IS NOT NULL AND _seller_email <> '' THEN
    PERFORM net.http_post(
      url := 'https://muvornzsnhncihxawntz.supabase.co/functions/v1/send-new-proposal-email',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11dm9ybnpzbmhuY2loeGF3bnR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyMzY5ODQsImV4cCI6MjA4MTgxMjk4NH0.ZRdSA52XyWOPvw7cS6xnkeUyfqsCFq-mUu_PYaymTyA'
      ),
      body := jsonb_build_object(
        'email', _seller_email,
        'seller_name', COALESCE(_seller_name, ''),
        'proposer_name', COALESCE(_proposer_name, ''),
        'vehicle_title', COALESCE(_vehicle_title, ''),
        'offer_amount', NEW.offer_amount
      )
    );
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_new_proposal_created
  AFTER INSERT ON public.proposals
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_proposal();

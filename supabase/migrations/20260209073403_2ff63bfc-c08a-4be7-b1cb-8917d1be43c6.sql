
-- Trigger function: alert admin when KYC status changes to 'under_review'
CREATE OR REPLACE FUNCTION public.handle_kyc_admin_alert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  _user_email TEXT;
  _user_name TEXT;
BEGIN
  -- Fire when a new KYC is inserted with 'under_review' or when status changes to 'under_review'
  IF NEW.status = 'under_review' THEN
    -- Get user email from auth.users
    SELECT email INTO _user_email FROM auth.users WHERE id = NEW.user_id;
    
    -- Get user name from profiles
    SELECT full_name INTO _user_name FROM public.profiles WHERE id = NEW.user_id;

    PERFORM net.http_post(
      url := 'https://muvornzsnhncihxawntz.supabase.co/functions/v1/send-admin-alert-email',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11dm9ybnpzbmhuY2loeGF3bnR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyMzY5ODQsImV4cCI6MjA4MTgxMjk4NH0.ZRdSA52XyWOPvw7cS6xnkeUyfqsCFq-mUu_PYaymTyA'
      ),
      body := jsonb_build_object(
        'alert_type', 'kyc_pending',
        'user_name', COALESCE(_user_name, ''),
        'user_email', COALESCE(_user_email, '')
      )
    );
  END IF;

  RETURN NEW;
END;
$function$;

-- Trigger for KYC admin alert on INSERT (new KYC submission)
CREATE TRIGGER on_kyc_admin_alert_insert
  AFTER INSERT ON public.kyc_verifications
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_kyc_admin_alert();

-- Trigger for KYC admin alert on UPDATE (status change to under_review)
CREATE TRIGGER on_kyc_admin_alert_update
  AFTER UPDATE OF status ON public.kyc_verifications
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_kyc_admin_alert();

-- Trigger function: alert admin when a new vehicle is created with 'pending' status
CREATE OR REPLACE FUNCTION public.handle_vehicle_admin_alert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  _user_email TEXT;
  _user_name TEXT;
BEGIN
  -- Only fire when a new vehicle is inserted with moderation_status = 'pending'
  IF NEW.moderation_status = 'pending' THEN
    -- Get user email from auth.users
    SELECT email INTO _user_email FROM auth.users WHERE id = NEW.user_id;
    
    -- Get user name from profiles
    SELECT full_name INTO _user_name FROM public.profiles WHERE id = NEW.user_id;

    PERFORM net.http_post(
      url := 'https://muvornzsnhncihxawntz.supabase.co/functions/v1/send-admin-alert-email',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11dm9ybnpzbmhuY2loeGF3bnR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyMzY5ODQsImV4cCI6MjA4MTgxMjk4NH0.ZRdSA52XyWOPvw7cS6xnkeUyfqsCFq-mUu_PYaymTyA'
      ),
      body := jsonb_build_object(
        'alert_type', 'vehicle_pending',
        'user_name', COALESCE(_user_name, ''),
        'user_email', COALESCE(_user_email, ''),
        'vehicle_title', NEW.title
      )
    );
  END IF;

  RETURN NEW;
END;
$function$;

-- Trigger for vehicle admin alert on INSERT only
CREATE TRIGGER on_vehicle_admin_alert
  AFTER INSERT ON public.vehicles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_vehicle_admin_alert();

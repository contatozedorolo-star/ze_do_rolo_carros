
-- Function to handle KYC status change to under_review
CREATE OR REPLACE FUNCTION public.handle_kyc_under_review()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  _email TEXT;
  _name TEXT;
BEGIN
  -- Only fire when status changes to 'under_review'
  IF NEW.status = 'under_review' AND (OLD.status IS NULL OR OLD.status <> 'under_review') THEN
    -- Get user email from auth.users
    SELECT email INTO _email FROM auth.users WHERE id = NEW.user_id;
    
    -- Get user name from profiles
    SELECT full_name INTO _name FROM public.profiles WHERE id = NEW.user_id;

    IF _email IS NOT NULL AND _email <> '' THEN
      PERFORM net.http_post(
        url := 'https://muvornzsnhncihxawntz.supabase.co/functions/v1/send-document-status-email',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11dm9ybnpzbmhuY2loeGF3bnR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyMzY5ODQsImV4cCI6MjA4MTgxMjk4NH0.ZRdSA52XyWOPvw7cS6xnkeUyfqsCFq-mUu_PYaymTyA'
        ),
        body := jsonb_build_object(
          'email', _email,
          'name', COALESCE(_name, '')
        )
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$function$;

-- Create trigger on kyc_verifications table
CREATE TRIGGER on_kyc_status_under_review
  AFTER UPDATE OF status ON public.kyc_verifications
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_kyc_under_review();

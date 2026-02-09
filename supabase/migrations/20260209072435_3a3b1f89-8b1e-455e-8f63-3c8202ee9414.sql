
-- Function to handle vehicle approval and send email
CREATE OR REPLACE FUNCTION public.handle_vehicle_approved()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  _email TEXT;
  _name TEXT;
BEGIN
  -- Only fire when moderation_status changes to 'approved'
  IF NEW.moderation_status = 'approved' AND (OLD.moderation_status IS NULL OR OLD.moderation_status <> 'approved') THEN
    -- Get user email from auth.users
    SELECT email INTO _email FROM auth.users WHERE id = NEW.user_id;
    
    -- Get user name from profiles
    SELECT full_name INTO _name FROM public.profiles WHERE id = NEW.user_id;

    IF _email IS NOT NULL AND _email <> '' THEN
      PERFORM net.http_post(
        url := 'https://muvornzsnhncihxawntz.supabase.co/functions/v1/send-ad-approved-email',
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
$function$;

-- Create trigger on vehicles table for approval
CREATE TRIGGER on_vehicle_approved
  AFTER UPDATE OF moderation_status ON public.vehicles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_vehicle_approved();

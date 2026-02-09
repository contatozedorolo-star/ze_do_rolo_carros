
-- Trigger function: when vehicle moderation_status changes to 'rejected', send email
CREATE OR REPLACE FUNCTION public.handle_vehicle_rejected()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  _email TEXT;
  _name TEXT;
BEGIN
  -- Only fire when moderation_status changes to 'rejected'
  IF NEW.moderation_status = 'rejected' AND (OLD.moderation_status IS NULL OR OLD.moderation_status <> 'rejected') THEN
    SELECT email INTO _email FROM auth.users WHERE id = NEW.user_id;
    SELECT full_name INTO _name FROM public.profiles WHERE id = NEW.user_id;

    IF _email IS NOT NULL AND _email <> '' THEN
      PERFORM net.http_post(
        url := 'https://muvornzsnhncihxawntz.supabase.co/functions/v1/send-ad-rejected-email',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11dm9ybnpzbmhuY2loeGF3bnR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyMzY5ODQsImV4cCI6MjA4MTgxMjk4NH0.ZRdSA52XyWOPvw7cS6xnkeUyfqsCFq-mUu_PYaymTyA'
        ),
        body := jsonb_build_object(
          'email', _email,
          'name', COALESCE(_name, ''),
          'vehicle_title', NEW.title,
          'rejection_reason', COALESCE(NEW.diagnostic_notes, 'O anúncio não atendeu aos critérios da plataforma.')
        )
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$function$;

-- Create trigger
CREATE TRIGGER on_vehicle_rejected_send_email
AFTER UPDATE OF moderation_status ON public.vehicles
FOR EACH ROW
EXECUTE FUNCTION public.handle_vehicle_rejected();

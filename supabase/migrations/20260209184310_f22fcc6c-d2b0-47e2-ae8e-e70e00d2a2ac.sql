
-- Trigger function to send document-status email when KYC status changes to under_review
CREATE OR REPLACE FUNCTION public.notify_document_under_review()
RETURNS TRIGGER AS $$
DECLARE
  user_email TEXT;
  user_name TEXT;
  supabase_url TEXT := current_setting('app.settings.supabase_url', true);
  service_role_key TEXT := current_setting('app.settings.service_role_key', true);
BEGIN
  -- Only fire when status is set to 'under_review'
  IF NEW.status = 'under_review' AND (OLD IS NULL OR OLD.status IS DISTINCT FROM 'under_review') THEN
    -- Get user email from auth.users
    SELECT email INTO user_email FROM auth.users WHERE id = NEW.user_id;
    
    -- Get user name from profiles
    SELECT full_name INTO user_name FROM public.profiles WHERE id = NEW.user_id;

    IF user_email IS NOT NULL THEN
      -- Call the edge function via pg_net
      PERFORM net.http_post(
        url := supabase_url || '/functions/v1/send-document-status-email',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || service_role_key
        ),
        body := jsonb_build_object(
          'email', user_email,
          'name', COALESCE(user_name, 'Usuário')
        )
      );
      
      RAISE LOG 'Document status email triggered for user % (%)', user_email, NEW.user_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger on kyc_verifications
DROP TRIGGER IF EXISTS on_kyc_under_review_send_email ON public.kyc_verifications;
CREATE TRIGGER on_kyc_under_review_send_email
  AFTER INSERT OR UPDATE OF status ON public.kyc_verifications
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_document_under_review();

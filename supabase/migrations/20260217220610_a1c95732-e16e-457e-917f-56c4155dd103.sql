-- Remover o trigger duplicado que causa o erro de URL nula
DROP TRIGGER IF EXISTS on_kyc_under_review_send_email ON public.kyc_verifications;

-- Remover a funcao orfã também
DROP FUNCTION IF EXISTS public.notify_document_under_review();
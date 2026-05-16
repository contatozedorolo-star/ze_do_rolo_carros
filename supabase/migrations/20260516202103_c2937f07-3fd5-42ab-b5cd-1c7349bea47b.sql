-- Quando o vendedor aceita, preenche flags com o KYC atual dos dois lados
CREATE OR REPLACE FUNCTION public.handle_proposal_match()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'accepted' AND (OLD.status IS NULL OR OLD.status <> 'accepted') THEN
    NEW.matched_at := now();
    NEW.buyer_kyc_completed := public.has_approved_kyc(NEW.proposer_id);
    NEW.seller_kyc_completed := public.has_approved_kyc(NEW.seller_id);
  END IF;
  RETURN NEW;
END;
$$;

-- Quando um KYC é aprovado, propaga para todas as propostas aceitas do usuário
CREATE OR REPLACE FUNCTION public.handle_kyc_propagate_to_proposals()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status <> 'approved') THEN
    UPDATE public.proposals SET buyer_kyc_completed = true
      WHERE proposer_id = NEW.user_id AND status = 'accepted';
    UPDATE public.proposals SET seller_kyc_completed = true
      WHERE seller_id = NEW.user_id AND status = 'accepted';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_kyc_propagate ON public.kyc_verifications;
CREATE TRIGGER trg_kyc_propagate
  AFTER INSERT OR UPDATE ON public.kyc_verifications
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_kyc_propagate_to_proposals();
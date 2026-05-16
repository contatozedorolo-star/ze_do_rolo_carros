CREATE OR REPLACE FUNCTION public.get_proposal_contact(_proposal_id uuid)
RETURNS TABLE(other_user_id uuid, other_name text, other_phone text)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  p RECORD;
  _other uuid;
BEGIN
  SELECT * INTO p FROM public.proposals WHERE id = _proposal_id;
  IF p IS NULL THEN RETURN; END IF;
  IF auth.uid() <> p.proposer_id AND auth.uid() <> p.seller_id THEN RETURN; END IF;
  IF p.status <> 'accepted' THEN RETURN; END IF;
  IF NOT p.buyer_kyc_completed OR NOT p.seller_kyc_completed THEN RETURN; END IF;

  _other := CASE WHEN auth.uid() = p.proposer_id THEN p.seller_id ELSE p.proposer_id END;

  RETURN QUERY
  SELECT pr.id, pr.full_name, pr.phone
  FROM public.profiles pr
  WHERE pr.id = _other;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.get_proposal_contact(uuid) FROM anon;
GRANT EXECUTE ON FUNCTION public.get_proposal_contact(uuid) TO authenticated;
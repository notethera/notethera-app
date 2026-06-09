-- Table to track affiliate commissions (30% per paid invoice)
CREATE TABLE public.affiliate_commissions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  referred_user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  stripe_invoice_id text UNIQUE NOT NULL,
  amount_cents int NOT NULL,
  commission_cents int NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'paid')),
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.affiliate_commissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "affiliates can view their own commissions"
  ON public.affiliate_commissions FOR SELECT
  USING (affiliate_id = auth.uid());

-- Returns financial stats for the current affiliate
CREATE OR REPLACE FUNCTION public.get_affiliate_stats()
RETURNS json AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    'total_cents',   COALESCE(SUM(commission_cents), 0)::int,
    'pending_cents', COALESCE(SUM(commission_cents) FILTER (WHERE status = 'pending'), 0)::int,
    'paid_cents',    COALESCE(SUM(commission_cents) FILTER (WHERE status = 'paid'),    0)::int
  )
  INTO result
  FROM public.affiliate_commissions
  WHERE affiliate_id = auth.uid();

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Add referral columns to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS referral_code text UNIQUE,
  ADD COLUMN IF NOT EXISTS referred_by text;

-- Backfill referral codes for existing users
UPDATE public.profiles
SET referral_code = upper(substring(md5(id::text), 1, 8))
WHERE referral_code IS NULL;

-- Update handle_new_user to generate referral code and capture referred_by
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, referral_code, referred_by)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    upper(substring(md5(new.id::text || now()::text), 1, 8)),
    new.raw_user_meta_data->>'referred_by'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC: count how many users signed up with the current user's referral code
CREATE OR REPLACE FUNCTION public.get_referral_count()
RETURNS integer AS $$
  SELECT COUNT(*)::integer
  FROM public.profiles
  WHERE referred_by = (
    SELECT referral_code FROM public.profiles WHERE id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

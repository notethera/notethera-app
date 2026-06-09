ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS registration_ip    text,
  ADD COLUMN IF NOT EXISTS fingerprint_hash   text,
  ADD COLUMN IF NOT EXISTS trial_used_at      timestamptz,
  ADD COLUMN IF NOT EXISTS normalized_email   text;

-- Backfill normalized emails:
--   - lowercase everything
--   - strip +alias (all providers)
--   - strip dots in local part for Gmail only
UPDATE public.profiles
SET normalized_email =
  CASE
    WHEN split_part(lower(email), '@', 2) IN ('gmail.com', 'googlemail.com') THEN
      replace(split_part(split_part(lower(email), '@', 1), '+', 1), '.', '')
      || '@' || split_part(lower(email), '@', 2)
    ELSE
      split_part(split_part(lower(email), '@', 1), '+', 1)
      || '@' || split_part(lower(email), '@', 2)
  END
WHERE normalized_email IS NULL;

CREATE INDEX IF NOT EXISTS idx_profiles_registration_ip
  ON public.profiles(registration_ip) WHERE registration_ip IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_profiles_fingerprint_hash
  ON public.profiles(fingerprint_hash) WHERE fingerprint_hash IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_profiles_normalized_email
  ON public.profiles(normalized_email) WHERE normalized_email IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_profiles_trial_used_at
  ON public.profiles(trial_used_at) WHERE trial_used_at IS NOT NULL;

-- Update trigger: normalized_email + fingerprint_hash + PRENOM30 referral code
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  v_normalized text;
  v_first_name text;
  v_code       text;
  v_counter    int := 0;
BEGIN
  -- Normalize email
  v_normalized := split_part(split_part(lower(new.email), '@', 1), '+', 1);
  IF split_part(lower(new.email), '@', 2) IN ('gmail.com', 'googlemail.com') THEN
    v_normalized := replace(v_normalized, '.', '');
  END IF;
  v_normalized := v_normalized || '@' || split_part(lower(new.email), '@', 2);

  -- Extract first name: strip titles, keep first word, uppercase
  v_first_name := trim(regexp_replace(
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    '^(Dr|Pr|M|Mme|Prof)\.?\s+', '', 'i'
  ));
  v_first_name := upper(regexp_replace(v_first_name, '\s.*$', ''));
  IF v_first_name = '' THEN
    v_first_name := upper(substring(md5(new.id::text), 1, 4));
  END IF;

  -- Generate unique PRENOM30 code
  v_code := v_first_name || '30';
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE referral_code = v_code) LOOP
    v_counter := v_counter + 1;
    v_code := v_first_name || '30' || v_counter::text;
  END LOOP;

  INSERT INTO public.profiles (
    id, email, normalized_email, full_name,
    referral_code, referred_by, fingerprint_hash
  )
  VALUES (
    new.id,
    new.email,
    v_normalized,
    new.raw_user_meta_data->>'full_name',
    v_code,
    new.raw_user_meta_data->>'referred_by',
    new.raw_user_meta_data->>'fingerprint_hash'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

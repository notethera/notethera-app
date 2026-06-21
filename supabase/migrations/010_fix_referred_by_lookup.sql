-- referred_by is uuid (FK to profiles.id), but raw_user_meta_data->>'referred_by'
-- carries the human-readable referral CODE (e.g. "RYAN30"), not a uuid.
-- Inserting that text directly raised "invalid input syntax for type uuid" on
-- every signup that went through handle_new_user(), surfaced by Supabase Auth
-- as the generic "Database error saving new user".
-- Fix: resolve the code to the referring profile's id, falling back to NULL
-- when it's missing, blank, or doesn't match any existing referral_code.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  v_normalized   text;
  v_first_name   text;
  v_code         text;
  v_counter      int := 0;
  v_referred_by  uuid;
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

  -- Resolve the referring profile's id from its referral code (case/whitespace
  -- insensitive). Stays NULL if blank or unmatched — no error either way.
  SELECT id INTO v_referred_by
  FROM public.profiles
  WHERE referral_code = upper(trim(new.raw_user_meta_data->>'referred_by'))
  LIMIT 1;

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
    v_referred_by,
    new.raw_user_meta_data->>'fingerprint_hash'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

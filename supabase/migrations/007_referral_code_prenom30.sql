CREATE OR REPLACE FUNCTION pg_temp.backfill_referral_codes()
RETURNS void LANGUAGE plpgsql AS $$
DECLARE
  rec          RECORD;
  v_first_name text;
  v_new_code   text;
  v_counter    int;
BEGIN
  FOR rec IN
    SELECT id, full_name, referral_code
    FROM public.profiles
    ORDER BY created_at
  LOOP
    v_first_name := trim(regexp_replace(
      coalesce(rec.full_name, ''),
      '^(Dr|Pr|M|Mme|Prof)\.?\s+', '', 'i'
    ));
    v_first_name := upper(regexp_replace(v_first_name, '\s.*$', ''));
    IF v_first_name = '' THEN
      v_first_name := upper(substring(md5(rec.id::text), 1, 4));
    END IF;

    v_counter  := 0;
    v_new_code := v_first_name || '30';

    WHILE EXISTS (
      SELECT 1 FROM public.profiles
      WHERE referral_code = v_new_code AND id != rec.id
    ) LOOP
      v_counter  := v_counter + 1;
      v_new_code := v_first_name || '30' || v_counter::text;
    END LOOP;

    IF rec.referral_code IS DISTINCT FROM v_new_code THEN
      UPDATE public.profiles SET referral_code = v_new_code WHERE id = rec.id;
    END IF;
  END LOOP;
END;
$$;

SELECT pg_temp.backfill_referral_codes();

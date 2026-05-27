ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS reminder_email_enabled boolean NOT NULL DEFAULT false;

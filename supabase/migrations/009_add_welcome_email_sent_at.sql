-- Track whether the welcome email has been sent, to avoid duplicate sends
alter table public.profiles
  add column if not exists welcome_email_sent_at timestamptz;

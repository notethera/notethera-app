-- Add subscription_plan to profiles
alter table public.profiles
  add column if not exists subscription_plan text
  check (subscription_plan in ('solo', 'pro', 'pro_annual'));

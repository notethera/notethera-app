-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Profiles table (extends auth.users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text,
  avatar_url text,
  stripe_customer_id text unique,
  subscription_status text check (subscription_status in ('active', 'trialing', 'past_due', 'canceled', 'incomplete')),
  subscription_id text,
  trial_ends_at timestamptz,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Patients table
create table public.patients (
  id uuid default uuid_generate_v4() primary key,
  therapist_id uuid references public.profiles(id) on delete cascade not null,
  alias text not null,
  session_count integer not null default 0,
  created_at timestamptz default now() not null
);

-- Session notes table
create table public.session_notes (
  id uuid default uuid_generate_v4() primary key,
  therapist_id uuid references public.profiles(id) on delete cascade not null,
  patient_id uuid references public.patients(id) on delete cascade not null,
  session_date date not null default current_date,
  transcript text,
  note_content text,
  created_at timestamptz default now() not null
);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.patients enable row level security;
alter table public.session_notes enable row level security;

-- Profiles policies
create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Patients policies
create policy "patients_select"
  on public.patients for select using (auth.uid() = therapist_id);

create policy "patients_insert"
  on public.patients for insert with check (auth.uid() = therapist_id);

create policy "patients_update"
  on public.patients for update
  using (auth.uid() = therapist_id)
  with check (auth.uid() = therapist_id);

create policy "patients_delete"
  on public.patients for delete using (auth.uid() = therapist_id);

-- Session notes policies
create policy "notes_select"
  on public.session_notes for select using (auth.uid() = therapist_id);

create policy "notes_insert"
  on public.session_notes for insert with check (auth.uid() = therapist_id);

create policy "notes_update"
  on public.session_notes for update
  using (auth.uid() = therapist_id)
  with check (auth.uid() = therapist_id);

create policy "notes_delete"
  on public.session_notes for delete using (auth.uid() = therapist_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name'
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Updated_at trigger
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_profiles_updated_at before update on public.profiles
  for each row execute procedure public.set_updated_at();

create trigger set_patients_updated_at before update on public.patients
  for each row execute procedure public.set_updated_at();

create trigger set_notes_updated_at before update on public.session_notes
  for each row execute procedure public.set_updated_at();

-- Storage bucket for audio files
insert into storage.buckets (id, name, public) values ('audio', 'audio', false);

create policy "Therapists can upload audio"
  on storage.objects for insert
  with check (bucket_id = 'audio' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Therapists can read own audio"
  on storage.objects for select
  using (bucket_id = 'audio' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Therapists can delete own audio"
  on storage.objects for delete
  using (bucket_id = 'audio' and auth.uid()::text = (storage.foldername(name))[1]);

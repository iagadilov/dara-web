-- Enable anonymous auth in Supabase Dashboard:
-- Authentication → Settings → Enable "Allow anonymous sign-ins"

-- Profiles table
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  goal text not null default '',
  problem_sounds text[] not null default '{}',
  start_date date not null default current_date,
  streak int not null default 0,
  last_session_date date,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Completed exercises table
create table public.completed_exercises (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  exercise_id text not null,
  completed_at timestamptz not null default now(),
  unique(user_id, exercise_id)
);

alter table public.completed_exercises enable row level security;

create policy "Users read own exercises"
  on public.completed_exercises for select
  using (auth.uid() = user_id);

create policy "Users insert own exercises"
  on public.completed_exercises for insert
  with check (auth.uid() = user_id);

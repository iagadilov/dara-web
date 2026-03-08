-- Reminders table (no RLS — accessed by server only via service role or anon with open policy)
create table public.reminders (
  id uuid primary key default gen_random_uuid(),
  telegram_id bigint not null unique,
  remind_hour smallint not null default 9,
  timezone text not null default 'Asia/Almaty',
  enabled boolean not null default true,
  created_at timestamptz not null default now()
);

-- Allow anon key to read/write (server-side only, protected by API secret)
alter table public.reminders enable row level security;

create policy "Service full access"
  on public.reminders for all
  using (true)
  with check (true);

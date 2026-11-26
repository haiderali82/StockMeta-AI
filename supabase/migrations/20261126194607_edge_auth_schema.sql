-- Backs the server-side login/verify-otp/resend-otp flow implemented as
-- Edge Functions under supabase/functions/. Only the service-role key
-- (used by the Edge Functions) touches these tables, so RLS stays
-- default-deny for the anon/authenticated roles.

create table if not exists public.login_otps (
  id uuid primary key default gen_random_uuid(),
  ticket uuid not null unique default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  email text not null,
  otp_hash text not null,
  expires_at timestamptz not null,
  attempts int not null default 0,
  resend_count int not null default 0,
  last_resent_at timestamptz,
  used boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists login_otps_ticket_idx on public.login_otps (ticket);
create index if not exists login_otps_user_id_idx on public.login_otps (user_id);

alter table public.login_otps enable row level security;
-- No policies: only the service-role key (used by Edge Functions) can
-- read/write this table. Anon/authenticated clients are denied by default.

create table if not exists public.auth_rate_limits (
  id uuid primary key default gen_random_uuid(),
  scope text not null,
  identifier text not null,
  window_start timestamptz not null default now(),
  count int not null default 1,
  unique (scope, identifier)
);

alter table public.auth_rate_limits enable row level security;
-- No policies here either — service-role only.

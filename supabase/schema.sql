-- Masterclass — Supabase schema
-- Run this in the Supabase SQL editor (Dashboard -> SQL -> New query).

-- Enrollments: one row per student per purchased course.
create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  course_slug text not null,
  payment_id text not null,
  order_id text not null,
  created_at timestamptz not null default now(),
  unique (user_id, course_slug)
);

alter table public.enrollments enable row level security;

-- A student can read only their own enrollments.
create policy "read own enrollments"
  on public.enrollments for select
  using (auth.uid() = user_id);

-- A student can insert only their own enrollment rows.
-- (Payment signature is verified server-side before this insert.)
create policy "insert own enrollments"
  on public.enrollments for insert
  with check (auth.uid() = user_id);

create index if not exists enrollments_user_idx
  on public.enrollments (user_id, created_at desc);

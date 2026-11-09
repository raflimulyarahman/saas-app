-- ==========================================
-- Schema Database untuk SaaS AI Companion
-- Jalankan query ini di SQL Editor Supabase
-- ==========================================

-- 1. Tabel companions (Menyimpan AI tutor/companion yang dibuat)
create table if not exists public.companions (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  subject text not null,
  topic text not null,
  voice text not null,
  style text not null,
  duration integer not null,
  author text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Tabel session_history (Menyimpan riwayat sesi belajar user)
create table if not exists public.session_history (
  id uuid default gen_random_uuid() primary key,
  companion_id uuid references public.companions(id) on delete cascade not null,
  user_id text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Tabel bookmarks (Menyimpan companion yang di-bookmark user)
create table if not exists public.bookmarks (
  id uuid default gen_random_uuid() primary key,
  companion_id uuid references public.companions(id) on delete cascade not null,
  user_id text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_user_companion unique (user_id, companion_id)
);

-- Indexing untuk mempercepat query pencarian dan sorting
create index if not exists idx_companions_subject on public.companions(subject);
create index if not exists idx_companions_author on public.companions(author);
create index if not exists idx_session_history_user on public.session_history(user_id);
create index if not exists idx_session_history_companion on public.session_history(companion_id);
create index if not exists idx_session_history_created_at on public.session_history(created_at desc);
create index if not exists idx_bookmarks_user on public.bookmarks(user_id);
create index if not exists idx_bookmarks_companion on public.bookmarks(companion_id);


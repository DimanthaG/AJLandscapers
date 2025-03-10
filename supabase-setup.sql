-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create tables for content management
create table if not exists public.content (
  id uuid default uuid_generate_v4() primary key,
  key text unique not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Drop existing gallery table if it exists
drop table if exists public.gallery;

-- Create gallery table with updated schema
create table public.gallery (
  id uuid default uuid_generate_v4() primary key,
  src text not null,
  alt varchar(255) not null,
  width smallint not null,
  height smallint not null,
  type varchar(10) not null default 'image',
  size numeric(5,2) null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.content enable row level security;
alter table public.gallery enable row level security;

-- Drop existing policies
drop policy if exists "Enable read access for all users" on public.content;
drop policy if exists "Enable insert for authenticated users only" on public.content;
drop policy if exists "Enable update for authenticated users only" on public.content;
drop policy if exists "Enable delete for authenticated users only" on public.content;
drop policy if exists "Enable read access for all users" on public.gallery;
drop policy if exists "Enable insert for authenticated users only" on public.gallery;
drop policy if exists "Enable update for authenticated users only" on public.gallery;
drop policy if exists "Enable delete for authenticated users only" on public.gallery;

-- Create policies for content table
create policy "Enable read access for all users"
  on public.content for select
  using (true);

create policy "Enable write access for service role"
  on public.content for all
  using (current_user = 'postgres.qthneglmxqtsabqmylza')
  with check (current_user = 'postgres.qthneglmxqtsabqmylza');

-- Create policies for gallery table
create policy "Enable read access for all users"
  on public.gallery for select
  using (true);

create policy "Enable write access for service role"
  on public.gallery for all
  using (current_user = 'postgres.qthneglmxqtsabqmylza')
  with check (current_user = 'postgres.qthneglmxqtsabqmylza');
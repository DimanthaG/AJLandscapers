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

-- Create quote requests table
create table if not exists public.quote_requests (
  id uuid default uuid_generate_v4() primary key,
  name varchar(255) not null,
  email varchar(255) not null,
  phone varchar(20),
  service varchar(100),
  message text not null,
  status varchar(20) default 'active' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create contact submissions table
create table if not exists public.contact_submissions (
  id uuid default uuid_generate_v4() primary key,
  name varchar(255) not null,
  email varchar(255) not null,
  message text not null,
  status varchar(20) default 'active' not null,
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
alter table public.quote_requests enable row level security;
alter table public.contact_submissions enable row level security;

-- Drop existing policies
drop policy if exists "Enable read access for all users" on public.content;
drop policy if exists "Enable write access for service role" on public.content;
drop policy if exists "Enable read access for all users" on public.gallery;
drop policy if exists "Enable write access for service role" on public.gallery;
drop policy if exists "Enable read access for service role" on public.quote_requests;
drop policy if exists "Enable write access for all users" on public.quote_requests;
drop policy if exists "Enable read access for service role" on public.contact_submissions;
drop policy if exists "Enable write access for all users" on public.contact_submissions;

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

-- Create policies for quote_requests table
create policy "Enable read access for service role"
  on public.quote_requests for select
  using (current_user = 'postgres.qthneglmxqtsabqmylza');

create policy "Enable write access for all users"
  on public.quote_requests for insert
  with check (true);

create policy "Enable update for service role"
  on public.quote_requests for update
  using (current_user = 'postgres.qthneglmxqtsabqmylza')
  with check (current_user = 'postgres.qthneglmxqtsabqmylza');

-- Create policies for contact_submissions table
create policy "Enable read access for service role"
  on public.contact_submissions for select
  using (current_user = 'postgres.qthneglmxqtsabqmylza');

create policy "Enable write access for all users"
  on public.contact_submissions for insert
  with check (true);

create policy "Enable update for service role"
  on public.contact_submissions for update
  using (current_user = 'postgres.qthneglmxqtsabqmylza')
  with check (current_user = 'postgres.qthneglmxqtsabqmylza');

-- Insert default content if it doesn't exist
insert into public.content (key, content)
values 
  ('hero-title', 'Transform Your Outdoor Space'),
  ('hero-subtitle', 'Professional Landscaping Services in Western Mass'),
  ('hero-cta', 'Get Started Today')
on conflict (key) do nothing;
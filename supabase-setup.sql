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

-- Create or update gallery table with Cloudinary support
create table if not exists public.gallery (
  id uuid default uuid_generate_v4() primary key,
  src text not null,
  alt varchar(255) not null, -- More efficient than text for short strings
  width smallint not null, -- smallint instead of integer for smaller storage
  height smallint not null,
  type varchar(10) not null default 'image',
  size numeric(5,2) null, -- Store file size in MB with 2 decimal places
  cloudinary_id text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add index for faster querying
create index if not exists idx_gallery_type on gallery(type);

-- Add index for Cloudinary ID lookups
create index if not exists idx_gallery_cloudinary_id on gallery(cloudinary_id);

-- Enable compression for the gallery table
alter table gallery set (autovacuum_vacuum_scale_factor = 0.1);
alter table gallery set (fillfactor = 90);

-- Set storage parameters for TOAST tables (for large content)
alter table gallery alter column src set storage external;

-- Enable Row Level Security
alter table public.content enable row level security;
alter table public.gallery enable row level security;

-- Create policies for content table
create policy "Enable read access for all users"
  on public.content for select
  using (true);

create policy "Enable insert for authenticated users only"
  on public.content for insert
  with check (auth.role() in ('authenticated', 'service_role'));

create policy "Enable update for authenticated users only"
  on public.content for update
  using (auth.role() in ('authenticated', 'service_role'))
  with check (auth.role() in ('authenticated', 'service_role'));

create policy "Enable delete for authenticated users only"
  on public.content for delete
  using (auth.role() in ('authenticated', 'service_role'));

-- Update or create RLS policies for gallery table
create policy "Enable read access for all users"
  on public.gallery for select
  using (true);

create policy "Enable insert for authenticated users only"
  on public.gallery for insert
  with check (auth.role() in ('authenticated', 'service_role'));

create policy "Enable update for authenticated users only"
  on public.gallery for update
  using (auth.role() in ('authenticated', 'service_role'))
  with check (auth.role() in ('authenticated', 'service_role'));

create policy "Enable delete for authenticated users only"
  on public.gallery for delete
  using (auth.role() in ('authenticated', 'service_role'));

-- Create storage bucket for gallery images
-- Note: This needs to be done through the Supabase dashboard or API
-- OrbWeb Studio - Supabase schema setup (Idempotent & Free plan friendly)
-- Jalankan di Supabase SQL Editor

-- 1) Extensions
create extension if not exists pgcrypto;

-- 2) Enum Types
-- Portfolio categories
do $$ begin
  if not exists (select 1 from pg_type where typname = 'portfolio_category') then
    create type public.portfolio_category as enum ('landing', 'profile', 'portfolio');
  end if;
end $$;

-- Showcase categories
do $$ begin
  if not exists (select 1 from pg_type where typname = 'showcase_category') then
    create type public.showcase_category as enum ('basic', 'premium', 'enterprise');
  end if;
end $$;

-- Order status
do $$ begin
  if not exists (select 1 from pg_type where typname = 'order_status') then
    create type public.order_status as enum ('pending', 'in-progress', 'completed', 'cancelled');
  end if;
end $$;

-- 3) Tables
-- portfolios
create table if not exists public.portfolios (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  image_url text not null check (image_url ~* '^https?://'),
  demo_url text null,
  category public.portfolio_category not null,
  created_at timestamptz not null default now()
);

-- showcases
create table if not exists public.showcases (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  image_url text not null check (image_url ~* '^https?://'),
  demo_url text null,
  price text not null,
  features text[] not null default '{}'::text[],
  category public.showcase_category not null,
  is_featured boolean not null default false,
  created_at timestamptz not null default now()
);

-- services
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  price text not null,
  features text[] not null default '{}'::text[],
  icon text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- orders
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  email text not null,
  phone text not null,
  service_type text not null check (service_type in ('showcase','custom')),
  showcase_id uuid null references public.showcases(id) on delete set null,
  message text not null,
  status public.order_status not null default 'pending',
  created_at timestamptz not null default now()
);

-- 4) Trigger untuk updated_at (services)
create or replace function public.trigger_set_timestamp()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_timestamp on public.services;
create trigger set_timestamp
before update on public.services
for each row execute function public.trigger_set_timestamp();

-- 5) Indexes
create index if not exists idx_portfolios_created_at on public.portfolios (created_at);
create index if not exists idx_showcases_created_at on public.showcases (created_at);
create index if not exists idx_services_created_at on public.services (created_at);
create index if not exists idx_orders_created_at on public.orders (created_at);
create index if not exists idx_orders_showcase_id on public.orders (showcase_id);

-- 6) RLS (Row Level Security) + Policies
-- Enable RLS
alter table public.portfolios enable row level security;
alter table public.showcases enable row level security;
alter table public.services enable row level security;
alter table public.orders enable row level security;

-- portfolios policies
do $$ begin
  if not exists (
    select 1 from pg_policies 
    where schemaname='public' and tablename='portfolios' and policyname='portfolios_select_public'
  ) then
    create policy portfolios_select_public on public.portfolios
      for select to anon, authenticated
      using (true);
  end if;

  if not exists (
    select 1 from pg_policies 
    where schemaname='public' and tablename='portfolios' and policyname='portfolios_modify_authenticated'
  ) then
    create policy portfolios_modify_authenticated on public.portfolios
      for all to authenticated
      using (true)
      with check (true);
  end if;
end $$;

-- showcases policies
do $$ begin
  if not exists (
    select 1 from pg_policies 
    where schemaname='public' and tablename='showcases' and policyname='showcases_select_public'
  ) then
    create policy showcases_select_public on public.showcases
      for select to anon, authenticated
      using (true);
  end if;

  if not exists (
    select 1 from pg_policies 
    where schemaname='public' and tablename='showcases' and policyname='showcases_modify_authenticated'
  ) then
    create policy showcases_modify_authenticated on public.showcases
      for all to authenticated
      using (true)
      with check (true);
  end if;
end $$;

-- services policies
do $$ begin
  if not exists (
    select 1 from pg_policies 
    where schemaname='public' and tablename='services' and policyname='services_select_public'
  ) then
    create policy services_select_public on public.services
      for select to anon, authenticated
      using (true);
  end if;

  if not exists (
    select 1 from pg_policies 
    where schemaname='public' and tablename='services' and policyname='services_modify_authenticated'
  ) then
    create policy services_modify_authenticated on public.services
      for all to authenticated
      using (true)
      with check (true);
  end if;
end $$;

-- orders policies
do $$ begin
  -- Public (anon + authenticated) boleh INSERT (Contact form)
  if not exists (
    select 1 from pg_policies 
    where schemaname='public' and tablename='orders' and policyname='orders_insert_public'
  ) then
    create policy orders_insert_public on public.orders
      for insert to anon, authenticated
      with check (true);
  end if;

  -- Hanya authenticated yang boleh SELECT/UPDATE/DELETE (Admin)
  if not exists (
    select 1 from pg_policies 
    where schemaname='public' and tablename='orders' and policyname='orders_read_authenticated'
  ) then
    create policy orders_read_authenticated on public.orders
      for select to authenticated
      using (true);
  end if;

  if not exists (
    select 1 from pg_policies 
    where schemaname='public' and tablename='orders' and policyname='orders_update_authenticated'
  ) then
    create policy orders_update_authenticated on public.orders
      for update to authenticated
      using (true)
      with check (true);
  end if;

  if not exists (
    select 1 from pg_policies 
    where schemaname='public' and tablename='orders' and policyname='orders_delete_authenticated'
  ) then
    create policy orders_delete_authenticated on public.orders
      for delete to authenticated
      using (true);
  end if;
end $$;

-- 7) Grant permissions untuk semua operasi CRUD
-- Grant table permissions
grant all on public.portfolios to anon, authenticated;
grant all on public.showcases to anon, authenticated;
grant all on public.services to anon, authenticated;
grant all on public.orders to anon, authenticated;

-- Grant sequence permissions (untuk auto-increment/ID generation)
grant usage, select on all sequences in schema public to anon, authenticated;

-- Grant schema permissions
grant usage on schema public to anon, authenticated;

-- 8) Contact Information Table
-- Enum Types untuk tipe kontak
do $$ begin
  if not exists (select 1 from pg_type where typname = 'contact_type') then
    create type public.contact_type as enum (
      'email', 
      'phone', 
      'whatsapp', 
      'instagram', 
      'facebook', 
      'twitter', 
      'linkedin', 
      'youtube', 
      'website', 
      'address', 
      'other'
    );
  end if;
end $$;

-- Table contact_information
create table if not exists public.contact_information (
  id uuid primary key default gen_random_uuid(),
  type public.contact_type not null,
  label text not null,
  value text not null,
  icon text null,
  is_primary boolean not null default false,
  is_active boolean not null default true,
  order_index integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Trigger untuk updated_at
drop trigger if exists set_timestamp_contact on public.contact_information;
create trigger set_timestamp_contact
before update on public.contact_information
for each row execute function public.trigger_set_timestamp();

-- Indexes
create index if not exists idx_contact_info_type on public.contact_information (type);
create index if not exists idx_contact_info_active on public.contact_information (is_active);
create index if not exists idx_contact_info_order on public.contact_information (order_index);
create index if not exists idx_contact_info_created_at on public.contact_information (created_at);

-- RLS + Policies
alter table public.contact_information enable row level security;

-- Public read access
do $$ begin
  if not exists (
    select 1 from pg_policies 
    where schemaname='public' and tablename='contact_information' and policyname='contact_info_select_public'
  ) then
    create policy contact_info_select_public on public.contact_information
      for select to anon, authenticated
      using (is_active = true);
  end if;
end $$;

-- Authenticated CRUD access
do $$ begin
  if not exists (
    select 1 from pg_policies 
    where schemaname='public' and tablename='contact_information' and policyname='contact_info_modify_authenticated'
  ) then
    create policy contact_info_modify_authenticated on public.contact_information
      for all to authenticated
      using (true)
      with check (true);
  end if;
end $$;

-- Grant permissions
grant all on public.contact_information to anon, authenticated;

-- Constraint untuk memastikan hanya satu primary per type
create unique index if not exists idx_contact_info_primary_type 
on public.contact_information (type) 
where is_primary = true and is_active = true;

-- 9) Seed data contoh untuk services
-- Insert default services jika belum ada
insert into public.services (name, description, price, features, icon) 
select * from (values
  ('Landing Page', 'Website satu halaman untuk fokus konversi dan call-to-action untuk meningkatkan leads', 'Rp 2.500.000', ARRAY['Desain modern & responsif','Form kontak terintegrasi','SEO basic optimization','Google Analytics setup','Social media integration','1x revisi design','Domain & hosting 1 tahun','SSL Certificate'], '🚀'),
  ('Profil Usaha', 'Website lengkap multi-halaman untuk profil perusahaan dengan fitur comprehensive', 'Rp 4.500.000', ARRAY['5-7 halaman lengkap (Home, About, Services, Gallery, Contact)','Admin panel untuk update konten','Blog/artikel section','Galeri produk/layanan','Advanced SEO optimization','Contact forms multiple','2x revisi design','Domain & hosting 1 tahun','SSL Certificate','Google My Business setup'], '🏢'),
  ('Website Portofolio', 'Showcase karya dan layanan dengan tampilan visual yang elegan dan professional', 'Rp 3.500.000', ARRAY['Gallery interaktif dengan lightbox','Project showcase pages','Testimonial section','About & contact pages','Mobile-optimized gallery','Social media integration','1x revisi design','Domain & hosting 1 tahun','SSL Certificate'], '🎨')
) as v(name, description, price, features, icon)
where not exists (select 1 from public.services limit 1);

-- 10) Seed data contoh untuk contact information
insert into public.contact_information (type, label, value, icon, is_primary, order_index) 
select * from (values
  ('email', 'Email Utama', 'info@orbwebstudio.com', '📧', true, 1),
  ('phone', 'WhatsApp', '+62 812-3456-7890', '📱', true, 2),
  ('instagram', 'Instagram', 'https://instagram.com/orbwebstudio', '📷', false, 3),
  ('facebook', 'Facebook', 'https://facebook.com/orbwebstudio', '👥', false, 4),
  ('website', 'Website', 'https://orbwebstudio.com', '🌐', false, 5),
  ('address', 'Alamat', 'Jl. Contoh No. 123, Jakarta Selatan', '📍', false, 6)
) as v(type, label, value, icon, is_primary, order_index)
where not exists (select 1 from public.contact_information limit 1);

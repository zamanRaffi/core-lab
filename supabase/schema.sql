-- =============================================
-- রাজকীয় পাঞ্জাবি — Supabase Database Schema
-- Supabase Dashboard > SQL Editor-এ এটা রান করুন
-- =============================================

-- Tables
create table if not exists categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  icon text default '👘',
  sort_order integer default 0,
  created_at timestamp with time zone default now()
);

create table if not exists products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  price integer not null,
  old_price integer,
  category_id uuid references categories(id) on delete set null,
  sizes text[] default '{"S","M","L","XL","XXL"}',
  badge text check (badge in ('হট', 'নতুন', 'সেল', null)),
  image_url text,
  whatsapp_message text,
  details text,
  materials text,
  care text,
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Extra columns for existing projects
alter table products add column if not exists details text;
alter table products add column if not exists materials text;
alter table products add column if not exists care text;

-- Storage bucket
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict do nothing;

-- Storage policies
drop policy if exists "Public product images are viewable" on storage.objects;
drop policy if exists "Anyone can upload product images" on storage.objects;
drop policy if exists "Anyone can update product images" on storage.objects;
drop policy if exists "Anyone can delete product images" on storage.objects;

create policy "Public product images are viewable"
  on storage.objects for select
  using (bucket_id = 'product-images');

-- Admin dashboard currently uploads with the browser anon key.
create policy "Anyone can upload product images"
  on storage.objects for insert
  with check (bucket_id = 'product-images');

create policy "Anyone can update product images"
  on storage.objects for update
  using (bucket_id = 'product-images')
  with check (bucket_id = 'product-images');

create policy "Anyone can delete product images"
  on storage.objects for delete
  using (bucket_id = 'product-images');

-- RLS
alter table products enable row level security;
alter table categories enable row level security;

-- Product policies
drop policy if exists "Active products viewable by everyone" on products;
drop policy if exists "Service role can do everything on products" on products;

create policy "Active products viewable by everyone"
  on products for select
  using (is_active = true);

create policy "Service role can do everything on products"
  on products for all
  to service_role
  using (true)
  with check (true);

-- Category policies
drop policy if exists "Categories viewable by everyone" on categories;
drop policy if exists "Service role can do everything on categories" on categories;

create policy "Categories viewable by everyone"
  on categories for select
  using (true);

create policy "Service role can do everything on categories"
  on categories for all
  to service_role
  using (true)
  with check (true);

-- Trigger
create or replace function handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists on_products_updated on products;

create trigger on_products_updated
  before update on products
  for each row execute procedure handle_updated_at();

-- Sample data
insert into categories (name, icon, sort_order)
select v.name, v.icon, v.sort_order
from (
  values
    ('ঈদ কালেকশন', '🕌', 1),
    ('কটন পাঞ্জাবি', '🌿', 2),
    ('ফতুয়া স্টাইল', '✨', 3),
    ('প্রিমিয়াম সিরিজ', '👑', 4)
) as v(name, icon, sort_order)
where not exists (
  select 1 from categories c where c.name = v.name
);

insert into products (
  name,
  description,
  price,
  old_price,
  sizes,
  badge,
  is_active,
  whatsapp_message,
  details,
  materials,
  care
)
select
  'সাদা কটন পাঞ্জাবি',
  'হালকা ওজনের, আরামদায়ক কটন কাপড়',
  750,
  1000,
  '{"S","M","L","XL","XXL"}',
  'হট',
  true,
  'আমি সাদা কটন পাঞ্জাবি অর্ডার করতে চাই',
  'স্মার্ট কলার, আরামদায়ক ফিট এবং দৈনন্দিন ব্যবহারের জন্য সহজ ডিজাইন।',
  '১০০% কটন',
  'ঠান্ডা পানিতে ধুতে হবে। সরাসরি রোদে দীর্ঘ সময় শুকাবেন না।'
where not exists (select 1 from products limit 1);

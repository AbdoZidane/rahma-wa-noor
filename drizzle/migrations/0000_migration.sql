-- Roles
create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "Users can read their own roles" on public.user_roles
  for select to authenticated using (auth.uid() = user_id);

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

-- The very first account created becomes the site administrator
create or replace function public.assign_first_admin()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.user_roles where role = 'admin') then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  end if;
  return new;
end;
$$;
create trigger on_auth_user_created_first_admin
  after insert on auth.users for each row execute function public.assign_first_admin();

-- Visitor prayers (moderated)
create type public.prayer_status as enum ('pending', 'approved', 'rejected');

create table public.prayers (
  id uuid primary key default gen_random_uuid(),
  author_name text check (author_name is null or char_length(author_name) <= 60),
  message text not null check (char_length(message) between 5 and 1000),
  status public.prayer_status not null default 'pending',
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);
grant select on public.prayers to anon, authenticated;
grant update, delete on public.prayers to authenticated;
grant all on public.prayers to service_role;
alter table public.prayers enable row level security;
create policy "Anyone can read approved prayers" on public.prayers
  for select to anon, authenticated using (status = 'approved');
create policy "Admins can read all prayers" on public.prayers
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins can update prayers" on public.prayers
  for update to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create policy "Admins can delete prayers" on public.prayers
  for delete to authenticated using (public.has_role(auth.uid(), 'admin'));
create index prayers_status_created_idx on public.prayers (status, created_at desc);

-- Anti-spam submission log (hashed, server-only)
create table public.submission_log (
  id bigserial primary key,
  ip_hash text not null,
  created_at timestamptz not null default now()
);
grant all on public.submission_log to service_role;
grant usage, select on sequence public.submission_log_id_seq to service_role;
alter table public.submission_log enable row level security;
create index submission_log_ip_created_idx on public.submission_log (ip_hash, created_at desc);

-- Site settings (single row)
create table public.site_settings (
  id int primary key default 1 check (id = 1),
  biography text not null default '' check (char_length(biography) <= 10000),
  portrait_url text,
  updated_at timestamptz not null default now()
);
grant select on public.site_settings to anon, authenticated;
grant update on public.site_settings to authenticated;
grant all on public.site_settings to service_role;
alter table public.site_settings enable row level security;
create policy "Anyone can read site settings" on public.site_settings
  for select to anon, authenticated using (true);
create policy "Admins can update site settings" on public.site_settings
  for update to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
insert into public.site_settings (id) values (1);

-- Family-approved memories
create table public.memories (
  id uuid primary key default gen_random_uuid(),
  title text check (title is null or char_length(title) <= 120),
  body text not null check (char_length(body) between 1 and 5000),
  author text check (author is null or char_length(author) <= 80),
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);
grant select on public.memories to anon, authenticated;
grant insert, update, delete on public.memories to authenticated;
grant all on public.memories to service_role;
alter table public.memories enable row level security;
create policy "Anyone can read published memories" on public.memories
  for select to anon, authenticated using (is_published = true);
create policy "Admins can read all memories" on public.memories
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins can insert memories" on public.memories
  for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));
create policy "Admins can update memories" on public.memories
  for update to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create policy "Admins can delete memories" on public.memories
  for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

-- Portrait storage: public read, admin write
create policy "Public can view portraits" on storage.objects
  for select to anon, authenticated using (bucket_id = 'portraits');
create policy "Admins can upload portraits" on storage.objects
  for insert to authenticated with check (bucket_id = 'portraits' and public.has_role(auth.uid(), 'admin'));
create policy "Admins can update portraits" on storage.objects
  for update to authenticated using (bucket_id = 'portraits' and public.has_role(auth.uid(), 'admin'));
create policy "Admins can delete portraits" on storage.objects
  for delete to authenticated using (bucket_id = 'portraits' and public.has_role(auth.uid(), 'admin'));
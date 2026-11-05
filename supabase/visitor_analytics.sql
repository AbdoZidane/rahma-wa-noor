-- رحمة ونور: إحصائيات الزيارات
-- شغّل هذا الملف مرة واحدة في Supabase SQL Editor.

create table if not exists public.site_visits (
  id bigserial primary key,
  visitor_id uuid not null,
  page_path text not null default '/',
  visited_at timestamptz not null default now(),
  constraint site_visits_page_path_length check (char_length(page_path) <= 300)
);

create index if not exists site_visits_visited_at_idx
  on public.site_visits (visited_at desc);
create index if not exists site_visits_visitor_id_idx
  on public.site_visits (visitor_id);

alter table public.site_visits enable row level security;
revoke all on public.site_visits from anon, authenticated;
grant all on public.site_visits to service_role;

create or replace function public.record_site_visit(p_visitor_id uuid, p_page_path text default '/')
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_visitor_id is null then
    return;
  end if;

  insert into public.site_visits (visitor_id, page_path)
  values (p_visitor_id, left(coalesce(nullif(p_page_path, ''), '/'), 300));
end;
$$;

revoke all on function public.record_site_visit(uuid, text) from public;
grant execute on function public.record_site_visit(uuid, text) to anon, authenticated;

create or replace function public.get_admin_visitor_stats()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  result jsonb;
begin
  if auth.uid() is null or not public.has_role(auth.uid(), 'admin') then
    raise exception 'Unauthorized';
  end if;

  select jsonb_build_object(
    'total_page_views', (select count(*) from public.site_visits),
    'total_visitors', (select count(distinct visitor_id) from public.site_visits),
    'today_visitors', (
      select count(distinct visitor_id)
      from public.site_visits
      where visited_at >= date_trunc('day', now())
    ),
    'daily', coalesce((
      select jsonb_agg(day_row order by day_row->>'date')
      from (
        select jsonb_build_object(
          'date', to_char(day::date, 'YYYY-MM-DD'),
          'visitors', count(distinct v.visitor_id),
          'page_views', count(v.id)
        ) as day_row
        from generate_series(
          date_trunc('day', now()) - interval '6 days',
          date_trunc('day', now()),
          interval '1 day'
        ) as day
        left join public.site_visits v
          on v.visited_at >= day
         and v.visited_at < day + interval '1 day'
        group by day
      ) daily_rows
    ), '[]'::jsonb)
  ) into result;

  return result;
end;
$$;

revoke all on function public.get_admin_visitor_stats() from public, anon;
grant execute on function public.get_admin_visitor_stats() to authenticated;

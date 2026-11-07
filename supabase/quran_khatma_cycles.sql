create table if not exists public.quran_khatma_cycles (
  id bigint generated always as identity primary key,
  cycle_number integer not null unique,
  completed_parts integer not null default 0,
  reserved_parts integer not null default 0,
  reset_by uuid references auth.users(id) on delete set null,
  reset_at timestamptz not null default now()
);

create index if not exists quran_khatma_cycles_reset_by_idx on public.quran_khatma_cycles(reset_by);

alter table public.quran_khatma_cycles enable row level security;
revoke all on table public.quran_khatma_cycles from anon, authenticated, public;
grant select, insert, update, delete on table public.quran_khatma_cycles to service_role;

create or replace function public.admin_reset_quran_khatma(p_admin_user_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_cycle_number integer;
  v_completed integer;
  v_reserved integer;
begin
  if p_admin_user_id is null
     or not public.has_role(p_admin_user_id, 'admin'::public.app_role) then
    raise exception 'Not authorized to reset the Quran khatma';
  end if;

  select
    count(*) filter (where status = 'completed'),
    count(*) filter (where status = 'reserved')
  into v_completed, v_reserved
  from public.quran_khatma_parts;

  select coalesce(max(cycle_number), 0) + 1
  into v_cycle_number
  from public.quran_khatma_cycles;

  insert into public.quran_khatma_cycles (
    cycle_number, completed_parts, reserved_parts, reset_by
  ) values (
    v_cycle_number, coalesce(v_completed, 0), coalesce(v_reserved, 0), p_admin_user_id
  );

  update public.quran_khatma_parts
  set status = 'available',
      participant_name = null,
      claim_token = null,
      updated_at = now();

  return jsonb_build_object(
    'cycle_number', v_cycle_number,
    'completed_parts', coalesce(v_completed, 0),
    'reserved_parts', coalesce(v_reserved, 0)
  );
end;
$$;

revoke all on function public.admin_reset_quran_khatma(uuid) from public, anon, authenticated;
grant execute on function public.admin_reset_quran_khatma(uuid) to service_role;

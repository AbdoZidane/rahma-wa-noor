-- Ensure the public khatma reset UPDATE always has a restrictive WHERE clause.
create or replace function public.public_reset_quran_khatma()
returns jsonb
language plpgsql
security definer
set search_path to ''
as $function$
declare
  v_cycle_number integer;
  v_total integer;
  v_completed integer;
  v_reserved integer;
begin
  perform pg_advisory_xact_lock(hashtext('quran_khatma_public_reset'));

  select
    count(*),
    count(*) filter (where status = 'completed'),
    count(*) filter (where status = 'reserved')
  into v_total, v_completed, v_reserved
  from public.quran_khatma_parts;

  if v_total <> 30 or v_completed <> 30 or v_reserved <> 0 then
    raise exception 'A new Quran khatma can only start after all 30 parts are completed.';
  end if;

  if exists (
    select 1 from public.quran_khatma_cycles
    where reset_at > now() - interval '60 seconds'
  ) then
    raise exception 'A new Quran khatma was started recently. Please wait before resetting again.';
  end if;

  select coalesce(max(cycle_number), 0) + 1
  into v_cycle_number
  from public.quran_khatma_cycles;

  insert into public.quran_khatma_cycles (
    cycle_number, completed_parts, reserved_parts, reset_by
  ) values (
    v_cycle_number, v_completed, v_reserved, null
  );

  update public.quran_khatma_parts
  set status = 'available',
      participant_name = null,
      claim_token = null,
      updated_at = now()
  where status = 'completed'
    and part_number between 1 and 30;

  return jsonb_build_object(
    'cycle_number', v_cycle_number,
    'completed_parts', v_completed,
    'reserved_parts', v_reserved
  );
end;
$function$;

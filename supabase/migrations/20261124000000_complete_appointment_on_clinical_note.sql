create or replace function public.complete_appointment_after_clinical_note()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.appointments
  set status = 'COMPLETED'
  where id = new.appointment_id
    and status <> 'COMPLETED';

  return new;
end;
$$;

drop trigger if exists clinical_notes_complete_appointment on public.clinical_notes;
create trigger clinical_notes_complete_appointment
after insert on public.clinical_notes
for each row
execute function public.complete_appointment_after_clinical_note();

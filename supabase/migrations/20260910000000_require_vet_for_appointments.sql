-- Las citas deben quedar siempre asignadas a un veterinario.
do $$
declare
  default_vet uuid;
begin
  select id into default_vet
  from public.profiles
  where role = 'VET'
  order by created_at
  limit 1;

  if exists (select 1 from public.appointments where vet_id is null) then
    if default_vet is null then
      raise exception 'No existe un perfil VET para asignar las citas sin veterinario.';
    end if;

    update public.appointments
    set vet_id = default_vet
    where vet_id is null;
  end if;
end $$;

alter table public.appointments
  alter column vet_id set not null;

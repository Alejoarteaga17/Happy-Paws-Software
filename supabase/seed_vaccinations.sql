-- Ejecutar en Supabase SQL Editor despues de crear la tabla vaccinations
-- y despues de tener al menos cuatro filas en public.pets.
-- Esta carga es idempotente: no duplica la misma vacuna para la misma mascota.

with selected_pets as (
  select id, row_number() over (order by id) as position
  from public.pets
  order by id
  limit 4
), seed_rows (pet_id, vaccine_name, administered_at, next_due_date, status) as (
  values
    ((select id from selected_pets where position = 1), 'Rabia', '2025-09-05'::date, '2026-09-12'::date, 'PENDING'::public.vaccination_status),
    ((select id from selected_pets where position = 2), 'Sextuple', '2025-03-11'::date, '2026-08-29'::date, 'OVERDUE'::public.vaccination_status),
    ((select id from selected_pets where position = 3), 'Triple felina', '2025-10-02'::date, '2026-09-18'::date, 'PENDING'::public.vaccination_status),
    ((select id from selected_pets where position = 4), 'Leucemia felina', '2025-02-17'::date, '2026-08-19'::date, 'OVERDUE'::public.vaccination_status)
)
insert into public.vaccinations (pet_id, vaccine_name, administered_at, next_due_date, status)
select pet_id, vaccine_name, administered_at, next_due_date, status
from seed_rows
where pet_id is not null
  and not exists (
    select 1
    from public.vaccinations existing
    where existing.pet_id = seed_rows.pet_id
      and existing.vaccine_name = seed_rows.vaccine_name
      and existing.next_due_date = seed_rows.next_due_date
  );

select v.id, p.name as pet_name, v.vaccine_name, v.next_due_date, v.status
from public.vaccinations v
join public.pets p on p.id = v.pet_id
order by v.next_due_date;
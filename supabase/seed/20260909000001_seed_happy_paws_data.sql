-- Datos base de desarrollo para Happy Paws Care Central.
-- Ejecutar despues de 20260909000000_create_happy_paws_schema.sql.
-- Este script es idempotente: repetirlo no duplica registros.

-- profiles se crean automaticamente desde auth.users mediante el trigger de la migracion.
-- No se insertan usuarios aqui porque sus credenciales deben gestionarse con Supabase Auth.

do $$
begin
  if not exists (select 1 from public.profiles where role = 'VET') then
    raise exception 'No existe un perfil VET. Crea un usuario en Supabase Auth y ejecuta: update public.profiles set role = ''VET'' where email = ''correo-del-veterinario@ejemplo.com'';';
  end if;
end $$;

insert into public.owners (full_name, phone, email, address)
select seed.full_name, seed.phone, seed.email, seed.address
from (
  values
    ('Ana Martinez', '+57 300 111 2201', 'ana.martinez@example.com', 'Calle 10 #12-30'),
    ('Carlos Rodriguez', '+57 301 222 3302', 'carlos.rodriguez@example.com', 'Carrera 25 #45-18'),
    ('Laura Gomez', '+57 302 333 4403', 'laura.gomez@example.com', 'Calle 80 #20-14'),
    ('Diego Torres', '+57 303 444 5504', 'diego.torres@example.com', 'Carrera 7 #90-22')
) as seed(full_name, phone, email, address)
where not exists (
  select 1 from public.owners existing where existing.email = seed.email
);

insert into public.pets (owner_id, pet_tag, name, species, breed, birth_date, weight)
select owners.id, seed.pet_tag, seed.name, seed.species, seed.breed, seed.birth_date, seed.weight
from (
  values
    ('ana.martinez@example.com', 'HP-0001', 'Luna', 'Perro', 'Labrador', date '2021-05-14', 24.50),
    ('carlos.rodriguez@example.com', 'HP-0002', 'Bruno', 'Perro', 'Bulldog frances', date '2020-03-08', 12.80),
    ('laura.gomez@example.com', 'HP-0003', 'Milo', 'Gato', 'Criollo', date '2022-09-21', 4.70),
    ('diego.torres@example.com', 'HP-0004', 'Nala', 'Gato', 'Siamés', date '2019-11-02', 5.10)
) as seed(owner_email, pet_tag, name, species, breed, birth_date, weight)
join public.owners on owners.email = seed.owner_email
where not exists (
  select 1 from public.pets existing where existing.pet_tag = seed.pet_tag
);

insert into public.appointments (pet_id, vet_id, scheduled_at, reason, notes, status)
select pets.id, staff.id, seed.scheduled_at::timestamptz, seed.reason, seed.notes, seed.status::public.appointment_status
from (
  values
    ('HP-0001', '2026-09-12 09:00:00-05', 'Control anual', 'Paciente activo y sin novedades.', 'COMPLETED'),
    ('HP-0002', '2026-09-13 10:30:00-05', 'Refuerzo de vacunacion', null, 'SCHEDULED'),
    ('HP-0003', '2026-09-14 14:00:00-05', 'Revision preventiva', null, 'SCHEDULED'),
    ('HP-0004', '2026-09-15 16:00:00-05', 'Control dermatologico', 'Revisar sensibilidad de piel.', 'COMPLETED')
) as seed(pet_tag, scheduled_at, reason, notes, status)
join public.pets on pets.pet_tag = seed.pet_tag
join lateral (
  select profiles.id
  from public.profiles
  where profiles.role = 'VET'
  order by profiles.created_at
  limit 1
) as staff on true
where not exists (
  select 1
  from public.appointments existing
  where existing.pet_id = pets.id
    and existing.scheduled_at = seed.scheduled_at::timestamptz
    and existing.reason = seed.reason
);

insert into public.appointment_services (appointment_id, service_id)
select appointments.id, services.id
from public.appointments
join public.pets on pets.id = appointments.pet_id
join public.services on services.name = case pets.pet_tag
  when 'HP-0001' then 'Consulta general'
  when 'HP-0002' then 'Vacunacion'
  when 'HP-0003' then 'Control preventivo'
  when 'HP-0004' then 'Consulta general'
end
where pets.pet_tag in ('HP-0001', 'HP-0002', 'HP-0003', 'HP-0004')
  and not exists (
    select 1
    from public.appointment_services existing
    where existing.appointment_id = appointments.id
      and existing.service_id = services.id
  );

insert into public.vaccinations (pet_id, appointment_id, vaccine_name, administered_at, next_due_date, status)
select pets.id, appointments.id, seed.vaccine_name, seed.administered_at, seed.next_due_date, seed.status::public.vaccination_status
from (
  values
    ('HP-0001', 'Rabia', date '2025-09-05', date '2026-09-12', 'PENDING'),
    ('HP-0002', 'Séxtuple', date '2025-03-11', date '2026-08-29', 'OVERDUE'),
    ('HP-0003', 'Triple felina', date '2025-10-02', date '2026-09-18', 'PENDING'),
    ('HP-0004', 'Leucemia felina', date '2025-02-17', date '2026-08-19', 'OVERDUE')
) as seed(pet_tag, vaccine_name, administered_at, next_due_date, status)
join public.pets on pets.pet_tag = seed.pet_tag
left join lateral (
  select appointments.id
  from public.appointments
  where appointments.pet_id = pets.id
  order by appointments.scheduled_at
  limit 1
) as appointments on true
where not exists (
  select 1
  from public.vaccinations existing
  where existing.pet_id = pets.id
    and existing.vaccine_name = seed.vaccine_name
    and existing.next_due_date = seed.next_due_date
);

-- Compatibilidad con una tabla audit_logs creada por una version anterior.
-- La migracion inicial no modifica tablas existentes por usar create table if not exists.
alter table public.audit_logs add column if not exists actor_user_id uuid references auth.users(id) on delete set null;
alter table public.audit_logs add column if not exists action text;
alter table public.audit_logs add column if not exists table_name text;
alter table public.audit_logs add column if not exists entity_name text;
alter table public.audit_logs add column if not exists entity_id text;
alter table public.audit_logs add column if not exists metadata jsonb default '{}'::jsonb;
alter table public.audit_logs add column if not exists created_at timestamptz default now();

insert into public.audit_logs (actor_user_id, action, table_name, entity_name, entity_id, metadata)
select staff.id, seed.action, seed.entity_name, seed.entity_name, seed.entity_id, seed.metadata::jsonb
from (
  values
    ('SEED_CREATED', 'owners', 'HP-OWNER-1', '{"source":"development-seed"}'),
    ('SEED_CREATED', 'pets', 'HP-0001', '{"source":"development-seed"}'),
    ('SEED_CREATED', 'appointments', 'HP-APPOINTMENT-1', '{"source":"development-seed"}'),
    ('SEED_CREATED', 'vaccinations', 'HP-VACCINATION-1', '{"source":"development-seed"}')
) as seed(action, entity_name, entity_id, metadata)
left join lateral (
  select profiles.id
  from public.profiles
  where profiles.role in ('ADMIN', 'VET', 'RECEPTIONIST')
  order by profiles.created_at
  limit 1
) as staff on true
where not exists (
  select 1
  from public.audit_logs existing
  where existing.action = seed.action
    and existing.entity_name = seed.entity_name
    and existing.entity_id = seed.entity_id
);

-- Verificacion rapida: debe mostrar 4 owners, 4 pets, al menos 3 services,
-- 4 appointments, 4 vaccinations y 4 audit_logs despues de ejecutar el seed.
select 'owners' as table_name, count(*) as total from public.owners
union all select 'pets', count(*) from public.pets
union all select 'services', count(*) from public.services
union all select 'appointments', count(*) from public.appointments
union all select 'appointment_services', count(*) from public.appointment_services
union all select 'vaccinations', count(*) from public.vaccinations
union all select 'audit_logs', count(*) from public.audit_logs
order by table_name;
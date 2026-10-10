-- Completa el CRUD operativo sin eliminar el historial clínico.

alter type public.appointment_status add value if not exists 'MISSED';

alter table public.owners add column if not exists deleted_at timestamptz;
alter table public.pets add column if not exists deleted_at timestamptz;

create index if not exists owners_deleted_at_idx on public.owners(deleted_at);
create index if not exists pets_deleted_at_idx on public.pets(deleted_at);

drop policy if exists pets_staff_write on public.pets;
create policy pets_staff_write on public.pets
  for all to authenticated
  using (public.current_app_role() in ('ADMIN', 'RECEPTIONIST', 'VET'))
  with check (public.current_app_role() in ('ADMIN', 'RECEPTIONIST', 'VET'));

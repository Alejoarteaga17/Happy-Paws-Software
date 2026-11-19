-- Hide soft-deleted owners and pets from owner and staff reads.
drop policy if exists owners_read on public.owners;
create policy owners_read on public.owners
  for select to authenticated
  using (
    deleted_at is null
    and (
      auth_user_id = auth.uid()
      or public.current_app_role() in ('ADMIN', 'VET', 'RECEPTIONIST')
    )
  );

drop policy if exists pets_read on public.pets;
create policy pets_read on public.pets
  for select to authenticated
  using (
    deleted_at is null
    and (
      exists (
        select 1
        from public.owners o
        where o.id = owner_id
          and o.auth_user_id = auth.uid()
          and o.deleted_at is null
      )
      or public.current_app_role() in ('ADMIN', 'VET', 'RECEPTIONIST')
    )
  );

drop policy if exists appointments_read on public.appointments;
create policy appointments_read on public.appointments
  for select to authenticated
  using (
    exists (
      select 1
      from public.pets p
      join public.owners o on o.id = p.owner_id
      where p.id = pet_id
        and p.deleted_at is null
        and o.deleted_at is null
        and o.auth_user_id = auth.uid()
    )
    or public.current_app_role() in ('ADMIN', 'VET', 'RECEPTIONIST')
  );

-- Clinical notes support explicit updates and deletes only for authorized staff.
drop policy if exists clinical_notes_staff_insert on public.clinical_notes;
create policy clinical_notes_staff_insert on public.clinical_notes
  for insert to authenticated
  with check (
    public.current_app_role() = 'ADMIN'
    or (
      public.current_app_role() = 'VET'
      and exists (
        select 1
        from public.appointments a
        where a.id = appointment_id
          and (a.vet_id is null or a.vet_id = auth.uid())
      )
      and veterinarian_id = auth.uid()
    )
  );

drop policy if exists clinical_notes_staff_update on public.clinical_notes;
create policy clinical_notes_staff_update on public.clinical_notes
  for update to authenticated
  using (
    public.current_app_role() = 'ADMIN'
    or (
      public.current_app_role() = 'VET'
      and veterinarian_id = auth.uid()
    )
  )
  with check (
    public.current_app_role() = 'ADMIN'
    or (
      public.current_app_role() = 'VET'
      and veterinarian_id = auth.uid()
    )
  );

drop policy if exists clinical_notes_staff_delete on public.clinical_notes;
create policy clinical_notes_staff_delete on public.clinical_notes
  for delete to authenticated
  using (
    public.current_app_role() = 'ADMIN'
    or (
      public.current_app_role() = 'VET'
      and veterinarian_id = auth.uid()
    )
  );

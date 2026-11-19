create or replace function public.prevent_vet_pet_identity_changes()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  if public.current_app_role() = 'VET'
    and (new.owner_id is distinct from old.owner_id or new.pet_tag is distinct from old.pet_tag)
  then
    raise exception 'VET cannot change pet owner or pet_tag'
      using errcode = '42501';
  end if;
  return new;
end;
$$;

drop trigger if exists prevent_vet_pet_identity_changes on public.pets;

create trigger prevent_vet_pet_identity_changes
  before update on public.pets
  for each row
  execute function public.prevent_vet_pet_identity_changes();

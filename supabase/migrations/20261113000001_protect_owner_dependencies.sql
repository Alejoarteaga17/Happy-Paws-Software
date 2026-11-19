alter table public.pets
  drop constraint if exists pets_owner_id_fkey;

alter table public.pets
  add constraint pets_owner_id_fkey
  foreign key (owner_id) references public.owners(id) on delete restrict;

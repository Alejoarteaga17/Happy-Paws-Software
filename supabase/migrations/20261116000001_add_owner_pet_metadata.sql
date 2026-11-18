do $$
begin
  create type public.pet_sex as enum ('MALE', 'FEMALE', 'UNKNOWN');
exception
  when duplicate_object then null;
end $$;

alter table public.owners
  add column if not exists updated_at timestamptz not null default now();

alter table public.pets
  add column if not exists sex public.pet_sex,
  add column if not exists updated_at timestamptz not null default now();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists owners_set_updated_at on public.owners;
create trigger owners_set_updated_at
before update on public.owners
for each row execute function public.set_updated_at();

drop trigger if exists pets_set_updated_at on public.pets;
create trigger pets_set_updated_at
before update on public.pets
for each row execute function public.set_updated_at();

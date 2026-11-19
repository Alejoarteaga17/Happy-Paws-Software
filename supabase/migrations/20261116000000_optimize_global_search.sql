create extension if not exists pg_trgm;

create index if not exists owners_full_name_trgm_idx
  on public.owners using gin (full_name gin_trgm_ops)
  where deleted_at is null;

create index if not exists owners_phone_trgm_idx
  on public.owners using gin (phone gin_trgm_ops)
  where deleted_at is null;

create index if not exists owners_email_trgm_idx
  on public.owners using gin (email gin_trgm_ops)
  where deleted_at is null;

create index if not exists pets_name_trgm_idx
  on public.pets using gin (name gin_trgm_ops)
  where deleted_at is null;

create index if not exists pets_pet_tag_trgm_idx
  on public.pets using gin (pet_tag gin_trgm_ops)
  where deleted_at is null;

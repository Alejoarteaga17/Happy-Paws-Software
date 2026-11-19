alter table public.pets
  add column if not exists photo_url text;

insert into storage.buckets (id, name, public)
values ('pet-images', 'pet-images', true)
on conflict (id) do update set public = true;

drop policy if exists pet_images_public_read on storage.objects;
create policy pet_images_public_read
  on storage.objects
  for select
  to public
  using (bucket_id = 'pet-images');

drop policy if exists pet_images_authenticated_insert on storage.objects;
create policy pet_images_authenticated_insert
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'pet-images');

drop policy if exists pet_images_authenticated_update on storage.objects;
create policy pet_images_authenticated_update
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'pet-images')
  with check (bucket_id = 'pet-images');

drop policy if exists pet_images_authenticated_delete on storage.objects;
create policy pet_images_authenticated_delete
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'pet-images');

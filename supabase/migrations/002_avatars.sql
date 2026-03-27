-- Add avatar_url to profiles
alter table profiles add column if not exists avatar_url text;

-- Create avatars bucket (public)
insert into storage.buckets (id, name, public)
  values ('avatars', 'avatars', true)
  on conflict (id) do nothing;

-- Anyone can read avatars (public bucket)
create policy "avatars_public_read" on storage.objects for select
  using (bucket_id = 'avatars');

-- Users can upload their own avatar
create policy "avatars_insert_own" on storage.objects for insert
  with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

-- Users can update/replace their own avatar
create policy "avatars_update_own" on storage.objects for update
  using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

-- Users can delete their own avatar
create policy "avatars_delete_own" on storage.objects for delete
  using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

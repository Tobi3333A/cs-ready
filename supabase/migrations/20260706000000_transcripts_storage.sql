-- Transcript metadata column (resume jsonb already exists)
alter table public.integrations
  add column if not exists transcript jsonb;

-- Private bucket for transcript files (resumes bucket already exists)
insert into storage.buckets (id, name, public)
values ('transcripts', 'transcripts', false)
on conflict (id) do nothing;

drop policy if exists "Users can upload own transcript files" on storage.objects;
drop policy if exists "Users can read own transcript files" on storage.objects;
drop policy if exists "Users can update own transcript files" on storage.objects;
drop policy if exists "Users can delete own transcript files" on storage.objects;

create policy "Users can upload own transcript files"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'transcripts'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users can read own transcript files"
on storage.objects for select
to authenticated
using (
  bucket_id = 'transcripts'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users can update own transcript files"
on storage.objects for update
to authenticated
using (
  bucket_id = 'transcripts'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users can delete own transcript files"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'transcripts'
  and (storage.foldername(name))[1] = auth.uid()::text
);

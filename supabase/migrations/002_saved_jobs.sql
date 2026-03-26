create table if not exists saved_jobs (
  id         uuid primary key default gen_random_uuid(),
  seeker_id  uuid not null references profiles(id) on delete cascade,
  job_id     text not null references jobs(id) on delete cascade,
  saved_at   timestamptz not null default now(),
  unique(seeker_id, job_id)
);

alter table saved_jobs enable row level security;

create policy "saved_jobs_seeker_all"
  on saved_jobs for all
  using (auth.uid() = seeker_id)
  with check (auth.uid() = seeker_id);

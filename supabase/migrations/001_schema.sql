-- ── Profiles (extends auth.users) ────────────────────────────────────────
create table if not exists profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  name       text not null,
  role       text not null check (role in ('seeker','employer')),
  company    text,
  created_at timestamptz default now()
);

-- ── Jobs ──────────────────────────────────────────────────────────────────
create table if not exists jobs (
  id              text primary key,
  employer_id     uuid references profiles(id) on delete set null,
  title           text not null,
  company         text not null,
  location        text not null,
  type            text not null,
  salary          text,
  description     text,
  requirements    text,
  required_skills text[],
  posted_at       timestamptz default now()
);

-- ── Applications ──────────────────────────────────────────────────────────
create table if not exists applications (
  id           text primary key,
  job_id       text references jobs(id) on delete cascade,
  employer_id  uuid references profiles(id) on delete set null,
  seeker_id    uuid references profiles(id) on delete cascade,
  seeker_name  text,
  seeker_email text,
  phone        text,
  location     text,
  summary      text,
  experience   jsonb,
  education    jsonb,
  skills       text[],
  cover_letter text,
  resume_name  text,
  resume_url   text,
  applied_at   timestamptz default now(),
  status       text default 'pending' check (status in ('pending','interview','rejected'))
);

-- ── Seeker Profiles ───────────────────────────────────────────────────────
create table if not exists seeker_profiles (
  user_id     uuid primary key references profiles(id) on delete cascade,
  phone       text,
  location    text,
  summary     text,
  skills      text[],
  experience  jsonb,
  resume_name text,
  resume_url  text,
  updated_at  timestamptz default now()
);

-- ── Enable RLS ────────────────────────────────────────────────────────────
alter table profiles enable row level security;
alter table jobs enable row level security;
alter table applications enable row level security;
alter table seeker_profiles enable row level security;

-- ── Profiles policies ─────────────────────────────────────────────────────
create policy "profiles_select_all" on profiles for select using (true);
create policy "profiles_update_own" on profiles for update using (auth.uid() = id);
create policy "profiles_insert_own" on profiles for insert with check (auth.uid() = id);

-- ── Jobs policies ─────────────────────────────────────────────────────────
create policy "jobs_select_all" on jobs for select using (true);
create policy "jobs_insert_employer" on jobs for insert with check (auth.uid() = employer_id);
create policy "jobs_update_employer" on jobs for update using (auth.uid() = employer_id);
create policy "jobs_delete_employer" on jobs for delete using (auth.uid() = employer_id);

-- ── Applications policies ─────────────────────────────────────────────────
-- Seeker: read/insert own
create policy "applications_seeker_select" on applications for select
  using (auth.uid() = seeker_id);
create policy "applications_seeker_insert" on applications for insert
  with check (auth.uid() = seeker_id);
-- Employer: read applications for their jobs
create policy "applications_employer_select" on applications for select
  using (
    exists (
      select 1 from jobs j where j.id = job_id and j.employer_id = auth.uid()
    )
  );
-- Employer: update status
create policy "applications_employer_update" on applications for update
  using (
    exists (
      select 1 from jobs j where j.id = job_id and j.employer_id = auth.uid()
    )
  );

-- ── Seeker profiles policies ──────────────────────────────────────────────
create policy "seeker_profiles_own_rw" on seeker_profiles for all using (auth.uid() = user_id);
-- Employers can read seeker profiles (for reviewing applications)
create policy "seeker_profiles_employer_read" on seeker_profiles for select
  using (
    exists (
      select 1 from profiles p where p.id = auth.uid() and p.role = 'employer'
    )
  );

-- ── Storage: resumes bucket ───────────────────────────────────────────────
insert into storage.buckets (id, name, public)
  values ('resumes', 'resumes', false)
  on conflict (id) do nothing;

-- Seeker can upload their own resumes
create policy "resumes_seeker_insert" on storage.objects for insert
  with check (bucket_id = 'resumes' and auth.uid()::text = (storage.foldername(name))[1]);

-- Seeker can read own resumes; employers can read for review
create policy "resumes_read" on storage.objects for select
  using (bucket_id = 'resumes');

-- Seeker can delete own resumes
create policy "resumes_seeker_delete" on storage.objects for delete
  using (bucket_id = 'resumes' and auth.uid()::text = (storage.foldername(name))[1]);

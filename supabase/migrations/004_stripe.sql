-- Add Stripe customer ID to profiles
alter table profiles add column if not exists stripe_customer_id text;

-- Pro subscription per employer (one row per employer)
create table if not exists employer_subscriptions (
  employer_id            uuid primary key references profiles(id) on delete cascade,
  stripe_customer_id     text,
  stripe_subscription_id text unique,
  status                 text not null default 'inactive',
  current_period_end     timestamptz,
  created_at             timestamptz default now(),
  updated_at             timestamptz default now()
);
alter table employer_subscriptions enable row level security;
create policy "employer_subscriptions_own" on employer_subscriptions
  for select using (auth.uid() = employer_id);

-- Per-listing unlocks (one row per employer+job pair)
create table if not exists job_unlocks (
  employer_id              uuid not null references profiles(id) on delete cascade,
  job_id                   text not null references jobs(id) on delete cascade,
  stripe_payment_intent_id text,
  unlocked_at              timestamptz default now(),
  primary key (employer_id, job_id)
);
alter table job_unlocks enable row level security;
create policy "job_unlocks_own" on job_unlocks
  for select using (auth.uid() = employer_id);

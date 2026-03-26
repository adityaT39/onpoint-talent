-- Add education column to seeker_profiles
alter table seeker_profiles add column if not exists education jsonb default '[]'::jsonb;

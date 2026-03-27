-- Add optional external apply URL to job listings
alter table jobs add column if not exists apply_url text;

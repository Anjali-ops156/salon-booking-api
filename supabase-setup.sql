-- Supabase -> SQL Editor -> New query -> ye paste karke "Run" dabao

create table appointments (
  id bigint generated always as identity primary key,
  customer_name    text not null,
  phone            text not null,
  service          text not null,
  stylist          text not null default 'Any',
  appointment_time timestamptz not null,
  status           text not null default 'confirmed',
  created_at       timestamptz not null default now(),

  -- ek stylist ka ek time pe sirf ek hi booking (double booking rokta hai)
  unique (stylist, appointment_time)
);

-- Row Level Security on karo, phir anon key ko padhne/likhne do.
-- Ye zaroori hai warna API ko "permission denied" milega.
alter table appointments enable row level security;

create policy "anyone can read bookings"
  on appointments for select to anon using (true);

create policy "anyone can create a booking"
  on appointments for insert to anon with check (true);

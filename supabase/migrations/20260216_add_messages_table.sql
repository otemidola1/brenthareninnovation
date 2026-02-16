-- Create messages table for contact form
create table if not exists public.messages (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  status text default 'new' check (status in ('new', 'read', 'replied'))
);

-- Enable RLS
alter table public.messages enable row level security;

-- Allow anyone (anon and authenticated) to insert messages
create policy "Anyone can insert messages"
  on public.messages for insert
  with check (true);

-- Allow admins to view all messages
create policy "Admins can view all messages"
  on public.messages for select
  using (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Allow admins to update messages (e.g. mark as read)
create policy "Admins can update messages"
  on public.messages for update
  using (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

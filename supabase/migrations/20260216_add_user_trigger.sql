-- Trigger to automatically create a user entry when a new user signs up via Supabase Auth

-- 1. Ensure the phone column exists in public.users
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND table_schema = 'public' AND column_name = 'phone') THEN
        ALTER TABLE public.users ADD COLUMN phone TEXT;
    END IF;
END $$;

-- 2. Create the function that will be called by the trigger
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, name, role, phone)
  values (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'name', 
    coalesce(new.raw_user_meta_data->>'role', 'guest'),
    new.raw_user_meta_data->>'phone'
  )
  on conflict (id) do update
  set 
    email = excluded.email,
    name = excluded.name,
    role = excluded.role,
    phone = excluded.phone;
  return new;
end;
$$ language plpgsql security definer;

-- 3. Create the trigger
-- Drop it first if it exists to allow re-running this migration safely
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 4. Backfill existing users
insert into public.users (id, email, name, role, phone)
select 
  id, 
  email, 
  raw_user_meta_data->>'name', 
  coalesce(raw_user_meta_data->>'role', 'guest'),
  raw_user_meta_data->>'phone'
from auth.users
on conflict (id) do nothing;

NOTIFY pgrst;

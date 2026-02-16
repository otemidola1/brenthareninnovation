-- Fix Bookings RLS to allow users to cancel (update) their own bookings

-- Check if policy exists and drop it to be safe (or just create if not exists, but distinct names help)
drop policy if exists "Users can update own bookings" on public.bookings;

create policy "Users can update own bookings"
  on public.bookings for update
  to authenticated
  using (
    auth.uid() = user_id
  )
  with check (
    auth.uid() = user_id
  );

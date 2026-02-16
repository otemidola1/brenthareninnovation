-- Fix RLS Infinite Recursion on public.users table

-- 1. Drop the problematic policy that causes recursion
-- (Admins can view all data -> checks users table -> triggers policy -> loop)
DROP POLICY IF EXISTS "Admins can view all data" ON public.users;

-- 2. Create a new policy that checks role from JWT metadata instead
-- This avoids querying the table itself
CREATE POLICY "Admins can view all data" ON public.users
FOR SELECT
TO public
USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);

-- 3. Ensure authenticated users can view the basic info of other users (needed for FK checks/display)
-- Use a separate policy for this.
-- Note: 'Users can view own data' already exists. We need a general read policy if users need to see each other (e.g. reviews).
-- For now, let's strictly allow reading user data if it's their own OR if they are an admin (covered above).
-- However, for the foreign key validation (bookings.user_id -> users.id), the system needs to see the user exists.
-- RLS applies to the user performing the query.
-- When a user inserts a booking with their OWN user_id, they need to be able to "see" their own user record in public.users.
-- The existing "Users can view own data" (auth.uid() = id) should suffice for this.

-- Let's double check if there are any other blocking policies.
-- "Allow All" was seen in the policy list earlier (qual: true). If that exists and is PERMISSIVE, it should have allowed everything.
-- Wait, if "Allow All" exists, why did it fail?
-- Maybe "Allow All" was created by me in a previous turn or was a hallucination/misinterpretation?
-- Let's check the policies again in verification if this doesn't work.

-- For now, let's explicitly fix the admin one.

-- Refine "Users can view own data" to be sure
DROP POLICY IF EXISTS "Users can view own data" ON public.users;
CREATE POLICY "Users can view own data" ON public.users
FOR SELECT
TO public
USING (
  auth.uid() = id
);

-- Ensure users can update their own data (e.g. profile)
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" ON public.users
FOR UPDATE
TO authenticated
USING (
  auth.uid() = id
)
WITH CHECK (
  auth.uid() = id
);

NOTIFY pgrst;

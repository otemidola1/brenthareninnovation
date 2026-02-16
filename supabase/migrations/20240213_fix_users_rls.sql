-- Enable RLS on users table if not already enabled
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own profile
CREATE POLICY "Users can view own profile" 
ON users FOR SELECT 
TO authenticated 
USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" 
ON users FOR UPDATE 
TO authenticated 
USING (auth.uid() = id);

-- Allow service role full access (optional but good practice)
-- Note: Service role bypasses RLS by default, but explicit policies can be helpful for clarity
-- CREATE POLICY "Service role full access" ON users TO service_role USING (true) WITH CHECK (true);

-- Run this to reload the schema cache
NOTIFY pgrst;

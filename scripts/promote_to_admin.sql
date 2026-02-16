-- Replace 'YOUR_EMAIL' with the email you registered with
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(raw_user_meta_data, '{role}', '"admin"')
WHERE email = 'YOUR_EMAIL';

-- Verify the update
SELECT email, raw_user_meta_data->>'role' as role FROM auth.users WHERE email = 'YOUR_EMAIL';

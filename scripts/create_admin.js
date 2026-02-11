
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase URL or Service Role Key in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAdmin() {
    const email = 'admin@brentharen.com';
    const password = 'admin123';

    console.log(`Creating/Updating admin user: ${email}`);

    // Check if user exists (by email) - Admin API listUsers is expensive/filtered, 
    // better to just try create and catch or invite.
    // createUser auto-confirms email if email_confirm is false (default for admin create).

    // First try to sign in to see if exists (simple check)
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email, password
    });

    if (signInData.user) {
        console.log('Admin user already exists.');
        console.log('Updating metadata to ensure role is admin...');
        const { error: updateError } = await supabase.auth.admin.updateUserById(
            signInData.user.id,
            { user_metadata: { role: 'admin', name: 'Admin User' } }
        );
        if (updateError) console.error('Error updating admin:', updateError);
        else console.log('Admin metadata updated.');
        return;
    }

    // Create new user
    const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { role: 'admin', name: 'Admin User' }
    });

    if (error) {
        console.error('Error creating admin user:', error.message);
    } else {
        console.log('Admin user created successfully!');
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        console.log('ID:', data.user.id);
    }
}

createAdmin();

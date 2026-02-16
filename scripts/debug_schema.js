
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function debug() {
    console.log('1. Testing public table query (PostgREST)...');
    const { data, error } = await supabase.from('users').select('*').limit(1);
    if (error) {
        console.error('❌ Query failed:', error.message);
    } else {
        console.log('✅ Query success');
    }

    console.log('\n2. Attempting to reload schema cache...');
    try {
        const { error: rpcError } = await supabase.rpc('reload_schema'); // Common name, or just check if it fails
        if (rpcError) {
            // Try fetching from a built-in view or just notify user
            console.log('⚠️  RPC reload_schema failed or not exists:', rpcError.message);
            // Verify if we can call NOTIFY pgrst
            // But valid way depends on setup.
        } else {
            console.log('✅ Schema reload RPC called');
        }
    } catch (e) {
        console.log('⚠️  RPC failed');
    }

    console.log('\n3. Testing Auth Login...');
    const email = 'admin@brentharen.com';
    const password = 'admin123';
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
        console.error('❌ Login failed:', authError.message);
    } else {
        console.log('✅ Login success');

        // Also check if admin user has metadata
        if (authData.user) {
            console.log('User Role:', authData.user.user_metadata?.role);
        }
    }
}

debug();

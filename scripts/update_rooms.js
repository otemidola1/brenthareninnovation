
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

const newRooms = [
    {
        name: 'Platinum',
        type: 'Suite',
        price: 45000,
        guests: 2,
        description: 'Our premium Platinum suite offering top-tier luxury and spacious comfort.',
        image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'
    },
    {
        name: 'Diamond',
        type: 'Suite',
        price: 38000,
        guests: 2,
        description: 'Experience elegance in our Diamond room, perfect for a relaxing stay.',
        image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80'
    },
    {
        name: 'Emerald',
        type: 'Deluxe',
        price: 38000,
        guests: 2,
        description: 'The Emerald room features vibrant decor and modern amenities.',
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'
    },
    {
        name: 'Crystal',
        type: 'Deluxe',
        price: 38000,
        guests: 2,
        description: 'Crystal clear comfort with excellent views and cozy atmosphere.',
        image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80'
    },
    {
        name: 'Gold',
        type: 'Deluxe',
        price: 38000,
        guests: 2,
        description: 'Stay golden in this beautifully appointed room with all essentials.',
        image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'
    },
    {
        name: 'Emirate (Small Room)',
        type: 'Standard',
        price: 25000,
        guests: 1,
        description: 'A Compact and efficient room for the solo traveler.',
        image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80'
    }
];

async function updateRooms() {
    console.log('Starting room update...');

    // Fetch existing room IDs
    const { data: existingRooms, error: fetchError } = await supabase.from('rooms').select('id');

    if (fetchError) {
        console.error('Error fetching existing rooms:', fetchError.message);
        return;
    }

    if (existingRooms && existingRooms.length > 0) {
        const ids = existingRooms.map(r => r.id);
        const { error: deleteError } = await supabase.from('rooms').delete().in('id', ids);

        if (deleteError) {
            console.error('Error deleting existing rooms:', deleteError.message);
            return;
        }
        console.log(`Deleted ${ids.length} existing rooms.`);
    } else {
        console.log('No existing rooms to delete.');
    }

    // Insert new rooms
    const { data, error: insertError } = await supabase.from('rooms').insert(newRooms).select();

    if (insertError) {
        console.error('Error inserting new rooms:', insertError.message);
    } else {
        console.log('Successfully added new rooms:');
        data.forEach(room => {
            console.log(`- ${room.name}: ₦${room.price.toLocaleString()}`);
        });
    }
}

updateRooms();

-- Add room_id, total_price, and room_type columns to bookings table
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS room_id UUID REFERENCES rooms(id),
ADD COLUMN IF NOT EXISTS total_price NUMERIC,
ADD COLUMN IF NOT EXISTS room_type TEXT;

-- Optional: Create an index on room_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_bookings_room_id ON bookings(room_id);

-- Run this to reload the schema cache
NOTIFY pgrst;

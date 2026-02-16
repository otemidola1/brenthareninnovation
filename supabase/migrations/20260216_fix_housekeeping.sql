-- Migration to add housekeeping columns to the rooms table

-- Add 'last_cleaned' if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'rooms' AND column_name = 'last_cleaned') THEN
        ALTER TABLE rooms ADD COLUMN last_cleaned TIMESTAMPTZ;
    END IF;
END $$;

-- Add 'assigned_to' if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'rooms' AND column_name = 'assigned_to') THEN
        ALTER TABLE rooms ADD COLUMN assigned_to TEXT;
    END IF;
END $$;

-- Add 'priority' if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'rooms' AND column_name = 'priority') THEN
        ALTER TABLE rooms ADD COLUMN priority TEXT DEFAULT 'normal';
    END IF;
END $$;

-- Ensure 'housekeepingStatus' exists (it likely does based on previous errors, but good to be safe)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'rooms' AND column_name = 'housekeepingStatus') THEN
        ALTER TABLE rooms ADD COLUMN "housekeepingStatus" TEXT DEFAULT 'clean';
    END IF;
END $$;

-- Reload schema cache
NOTIFY pgrst;

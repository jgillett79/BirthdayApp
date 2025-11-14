-- Add birth_year column to events table for age calculation
ALTER TABLE events ADD COLUMN IF NOT EXISTS birth_year INTEGER;

-- Add comment
COMMENT ON COLUMN events.birth_year IS 'Year of birth for age calculation (birthdays only)';

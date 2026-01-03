/*
  # Update Waitlist Table Structure
  
  1. Changes
    - Add `name` column to store user's name
    - Add `channels` column to store YouTube channels as JSON array
    - Keep existing `platform` column for compatibility
  
  2. Notes
    - Existing `platform` field is kept for backward compatibility
    - New records will use `channels` array instead
*/

-- Add name column
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS name text;

-- Add channels column (JSON array of channel URLs)
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS channels jsonb;

-- Update the constraint to make email unique
-- (it should already be unique, but ensuring it)
ALTER TABLE waitlist DROP CONSTRAINT IF EXISTS waitlist_email_key;
ALTER TABLE waitlist ADD CONSTRAINT waitlist_email_key UNIQUE (email);





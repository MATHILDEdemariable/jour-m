
-- Step 1: Add magic_word to events
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS magic_word TEXT;

-- Optionally, ensure it's unique per event (eventually, if needed):
-- CREATE UNIQUE INDEX IF NOT EXISTS events_magic_word_idx ON events(magic_word) WHERE magic_word IS NOT NULL;

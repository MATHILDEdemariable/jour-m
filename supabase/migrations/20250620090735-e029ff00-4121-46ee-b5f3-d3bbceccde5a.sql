
-- Add missing columns to events table
ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS event_type TEXT DEFAULT 'wedding',
ADD COLUMN IF NOT EXISTS slug TEXT,
ADD COLUMN IF NOT EXISTS google_drive_url TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft',
ADD COLUMN IF NOT EXISTS magic_word TEXT,
ADD COLUMN IF NOT EXISTS share_token TEXT;

-- Create unique index for slug if it doesn't exist
CREATE UNIQUE INDEX IF NOT EXISTS events_slug_key ON public.events(slug) WHERE slug IS NOT NULL;

-- Create unique index for share_token if it doesn't exist  
CREATE UNIQUE INDEX IF NOT EXISTS events_share_token_key ON public.events(share_token) WHERE share_token IS NOT NULL;

-- Generate slugs for existing events without one
UPDATE public.events 
SET slug = LOWER(REPLACE(name, ' ', '-')) || '-' || EXTRACT(EPOCH FROM created_at)::TEXT
WHERE slug IS NULL;

-- Generate share tokens for existing events without one
UPDATE public.events 
SET share_token = gen_random_uuid()::TEXT
WHERE share_token IS NULL;

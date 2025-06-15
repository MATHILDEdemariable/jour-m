
-- 1. Ajouter une colonne slug à la table events (unique, non nullable après migration)
ALTER TABLE events ADD COLUMN slug TEXT;

-- Remplir les slugs existants pour ne pas violer la contrainte
UPDATE events
SET slug = lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g'))
WHERE slug IS NULL;

-- Rendez le champ unique pour éviter les collisions d'URL
ALTER TABLE events
  ALTER COLUMN slug SET NOT NULL,
  ADD CONSTRAINT events_slug_unique UNIQUE (slug);

-- 2. (Optionnel : index pour gain de perfs sur la recherche par slug)
CREATE INDEX idx_events_slug ON events(slug);


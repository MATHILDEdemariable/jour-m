
-- Corriger les données existantes : assigner l'event_id manquant
-- Nous supposons qu'il n'y a qu'un seul événement actif pour le moment
-- Si vous avez plusieurs événements, vous devrez adapter cette requête

-- Mettre à jour les personnes sans event_id vers le premier événement disponible
UPDATE people 
SET event_id = (SELECT id FROM events ORDER BY created_at DESC LIMIT 1)
WHERE event_id IS NULL;

-- Mettre à jour les prestataires sans event_id vers le premier événement disponible  
UPDATE vendors 
SET event_id = (SELECT id FROM events ORDER BY created_at DESC LIMIT 1)
WHERE event_id IS NULL;

-- Mettre à jour les tâches sans event_id vers le premier événement disponible
UPDATE tasks 
SET event_id = (SELECT id FROM events ORDER BY created_at DESC LIMIT 1)
WHERE event_id IS NULL;

-- Mettre à jour les timeline_items sans event_id vers le premier événement disponible
UPDATE timeline_items 
SET event_id = (SELECT id FROM events ORDER BY created_at DESC LIMIT 1)
WHERE event_id IS NULL;

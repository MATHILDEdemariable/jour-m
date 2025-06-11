
-- Ajouter la nouvelle colonne pour les assignations multiples
ALTER TABLE timeline_items 
ADD COLUMN assigned_person_ids uuid[] DEFAULT '{}';

-- Migrer les données existantes vers le nouveau format
UPDATE timeline_items 
SET assigned_person_ids = ARRAY[assigned_person_id]
WHERE assigned_person_id IS NOT NULL;

-- Pour les tâches aussi si elles utilisent le même système
ALTER TABLE tasks 
ADD COLUMN assigned_person_ids uuid[] DEFAULT '{}';

UPDATE tasks 
SET assigned_person_ids = ARRAY[assigned_person_id]
WHERE assigned_person_id IS NOT NULL;

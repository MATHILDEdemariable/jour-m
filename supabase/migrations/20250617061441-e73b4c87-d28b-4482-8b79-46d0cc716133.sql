
-- Première étape : Identifier l'événement avec le magic_word pour s'assurer qu'on travaille avec le bon
-- (Remplacez 'VOTRE_MAGIC_WORD' par le vrai mot magique utilisé)

-- Mettre à jour les personnes pour qu'elles soient associées à l'événement magic access
UPDATE public.people 
SET event_id = '39e43f13-e62f-40c6-8edd-43cdb5dd8a55'
WHERE event_id IS NULL OR event_id != '39e43f13-e62f-40c6-8edd-43cdb5dd8a55';

-- Mettre à jour les prestataires pour qu'ils soient associés à l'événement magic access  
UPDATE public.vendors 
SET event_id = '39e43f13-e62f-40c6-8edd-43cdb5dd8a55'
WHERE event_id IS NULL OR event_id != '39e43f13-e62f-40c6-8edd-43cdb5dd8a55';

-- Mettre à jour les tâches pour qu'elles soient associées à l'événement magic access
UPDATE public.tasks 
SET event_id = '39e43f13-e62f-40c6-8edd-43cdb5dd8a55'
WHERE event_id IS NULL OR event_id != '39e43f13-e62f-40c6-8edd-43cdb5dd8a55';

-- Mettre à jour les éléments de timeline pour qu'ils soient associés à l'événement magic access
UPDATE public.timeline_items 
SET event_id = '39e43f13-e62f-40c6-8edd-43cdb5dd8a55'
WHERE event_id IS NULL OR event_id != '39e43f13-e62f-40c6-8edd-43cdb5dd8a55';

-- Vérifier les associations après mise à jour
SELECT 'people' as table_name, count(*) as count FROM public.people WHERE event_id = '39e43f13-e62f-40c6-8edd-43cdb5dd8a55'
UNION ALL
SELECT 'vendors' as table_name, count(*) as count FROM public.vendors WHERE event_id = '39e43f13-e62f-40c6-8edd-43cdb5dd8a55'  
UNION ALL
SELECT 'tasks' as table_name, count(*) as count FROM public.tasks WHERE event_id = '39e43f13-e62f-40c6-8edd-43cdb5dd8a55'
UNION ALL
SELECT 'timeline_items' as table_name, count(*) as count FROM public.timeline_items WHERE event_id = '39e43f13-e62f-40c6-8edd-43cdb5dd8a55';

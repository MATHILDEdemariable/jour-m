
-- Ajouter le champ share_token à la table events
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS share_token UUID DEFAULT gen_random_uuid();

-- Créer un index unique sur le share_token pour optimiser les recherches
CREATE UNIQUE INDEX IF NOT EXISTS events_share_token_idx ON public.events(share_token) WHERE share_token IS NOT NULL;

-- Mettre à jour les événements existants qui n'ont pas encore de token
UPDATE public.events SET share_token = gen_random_uuid() WHERE share_token IS NULL;

-- Créer une fonction pour régénérer le token d'un événement
CREATE OR REPLACE FUNCTION public.regenerate_event_share_token(event_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_token UUID;
BEGIN
  -- Générer un nouveau token
  new_token := gen_random_uuid();
  
  -- Mettre à jour l'événement
  UPDATE public.events 
  SET share_token = new_token, updated_at = now()
  WHERE id = event_id;
  
  RETURN new_token;
END;
$$;

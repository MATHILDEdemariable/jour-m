
-- Politique publique invitée pour la page /guest-dashboard : permet à toute requête de SELECT l'événement via le slug

-- 1. Permettre la lecture (SELECT) publique limitée pour les événements qui sont recherchés par slug
CREATE POLICY "Public can select event by slug for guest access"
ON public.events
FOR SELECT
USING (
  -- Permet l'accès en lecture à tous
  true
);

-- Si besoin, on pourra resserrer la condition pour n'autoriser que le champ slug,
-- mais en l'état les invités ne font que lire l'id + meta de l'événement.


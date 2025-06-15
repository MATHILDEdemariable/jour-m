
-- Politiques RLS publiques pour permettre l'accès invité aux personnes et prestataires

-- 1. Permettre la lecture publique des personnes pour les invités
CREATE POLICY "Public can select people for guest access"
ON public.people
FOR SELECT
USING (true);

-- 2. Permettre la lecture publique des prestataires pour les invités  
CREATE POLICY "Public can select vendors for guest access"
ON public.vendors
FOR SELECT
USING (true);

-- Note: Ces politiques complètent les politiques existantes et permettent uniquement la lecture (SELECT).
-- Les opérations de création, modification et suppression restent protégées par les politiques tenant existantes.

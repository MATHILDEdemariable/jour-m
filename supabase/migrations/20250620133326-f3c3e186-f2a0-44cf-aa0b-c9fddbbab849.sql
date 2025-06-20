
-- Supprimer complètement toutes les politiques existantes sur tenant_users pour éviter la récursion
DROP POLICY IF EXISTS "Users can access their tenant users" ON public.tenant_users;
DROP POLICY IF EXISTS "Users can view their own tenant associations" ON public.tenant_users;
DROP POLICY IF EXISTS "Users can create their own tenant associations" ON public.tenant_users;
DROP POLICY IF EXISTS "Admins can manage tenant users" ON public.tenant_users;

-- Recréer des politiques RLS ultra-simples sans aucune récursion
-- Politique 1: Les utilisateurs peuvent voir leurs propres associations
CREATE POLICY "Simple user view own associations"
  ON public.tenant_users
  FOR SELECT
  USING (user_id = auth.uid());

-- Politique 2: Les utilisateurs peuvent créer leurs propres associations (pour l'inscription)
CREATE POLICY "Simple user create own associations"
  ON public.tenant_users
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Politique 3: Les utilisateurs peuvent mettre à jour leurs propres associations
CREATE POLICY "Simple user update own associations"
  ON public.tenant_users
  FOR UPDATE
  USING (user_id = auth.uid());

-- Vérifier que RLS est bien activé sur tenant_users
ALTER TABLE public.tenant_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_users FORCE ROW LEVEL SECURITY;

-- Nettoyer aussi les politiques des autres tables qui pourraient référencer tenant_users de manière récursive
DROP POLICY IF EXISTS "Users can view their tenants" ON public.tenants;

-- Recréer une politique simple pour les tenants
CREATE POLICY "Users can view their own tenants"
  ON public.tenants
  FOR SELECT
  USING (
    id IN (
      SELECT tenant_id FROM public.tenant_users WHERE user_id = auth.uid()
    )
  );

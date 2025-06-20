
-- Phase 1: Correction urgente des politiques RLS pour tenant_users

-- Supprimer toutes les politiques existantes qui causent la récursion infinie
DROP POLICY IF EXISTS "Users can see their own tenant memberships" ON public.tenant_users;
DROP POLICY IF EXISTS "Tenant owners can manage their tenant users" ON public.tenant_users;
DROP POLICY IF EXISTS "Allow full access for tenant members" ON public.tenant_users;

-- Supprimer aussi les fonctions qui causent la récursion
DROP FUNCTION IF EXISTS public.get_current_tenant_id();
DROP FUNCTION IF EXISTS public.is_member_of_tenant(UUID);

-- Recréer des politiques RLS simples et sécurisées sans récursion
-- Les utilisateurs peuvent voir leurs propres associations tenant_users
CREATE POLICY "Users can view their own tenant associations"
  ON public.tenant_users
  FOR SELECT
  USING (user_id = auth.uid());

-- Les utilisateurs peuvent créer des associations pour eux-mêmes (pour le processus d'inscription)
CREATE POLICY "Users can create their own tenant associations"
  ON public.tenant_users
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Les administrateurs peuvent gérer les utilisateurs de leur tenant
CREATE POLICY "Admins can manage tenant users"
  ON public.tenant_users
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.tenant_users admin_check
      WHERE admin_check.user_id = auth.uid()
      AND admin_check.tenant_id = tenant_users.tenant_id
      AND admin_check.role = 'admin'
    )
  );

-- Recréer des politiques simplifiées pour les autres tables sans fonctions récursives
-- Pour la table tenants
DROP POLICY IF EXISTS "Tenant members can see their own tenant" ON public.tenants;
CREATE POLICY "Users can view their tenants"
  ON public.tenants
  FOR SELECT
  USING (
    id IN (
      SELECT tenant_id FROM public.tenant_users WHERE user_id = auth.uid()
    )
  );

-- Vérifier que RLS est bien activé sur tenant_users
ALTER TABLE public.tenant_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_users FORCE ROW LEVEL SECURITY;

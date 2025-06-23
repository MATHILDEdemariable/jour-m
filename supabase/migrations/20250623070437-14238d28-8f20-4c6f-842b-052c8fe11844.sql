
-- Corriger les politiques RLS pour éviter la récursion infinie

-- 1. Supprimer les politiques problématiques existantes
DROP POLICY IF EXISTS "Users can view vendors from their tenant" ON public.vendors;
DROP POLICY IF EXISTS "Users can insert vendors for their tenant" ON public.vendors;
DROP POLICY IF EXISTS "Users can update vendors from their tenant" ON public.vendors;
DROP POLICY IF EXISTS "Users can delete vendors from their tenant" ON public.vendors;

DROP POLICY IF EXISTS "Users can view events from their tenant" ON public.events;
DROP POLICY IF EXISTS "Users can insert events for their tenant" ON public.events;
DROP POLICY IF EXISTS "Users can update events from their tenant" ON public.events;
DROP POLICY IF EXISTS "Users can delete events from their tenant" ON public.events;

DROP POLICY IF EXISTS "Users can view people from their tenant" ON public.people;
DROP POLICY IF EXISTS "Users can insert people for their tenant" ON public.people;
DROP POLICY IF EXISTS "Users can update people from their tenant" ON public.people;
DROP POLICY IF EXISTS "Users can delete people from their tenant" ON public.people;

DROP POLICY IF EXISTS "Users can view documents from their tenant" ON public.documents;
DROP POLICY IF EXISTS "Users can insert documents for their tenant" ON public.documents;
DROP POLICY IF EXISTS "Users can update documents from their tenant" ON public.documents;
DROP POLICY IF EXISTS "Users can delete documents from their tenant" ON public.documents;

-- 2. Créer une fonction security definer pour éviter la récursion
CREATE OR REPLACE FUNCTION public.get_user_tenant_ids()
RETURNS UUID[] AS $$
  SELECT ARRAY_AGG(tenant_id) FROM public.tenant_users WHERE user_id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- 3. Recréer des politiques RLS simples et efficaces pour vendors
CREATE POLICY "Vendors tenant access" ON public.vendors
  FOR ALL USING (tenant_id = ANY(public.get_user_tenant_ids()));

-- 4. Recréer des politiques RLS simples et efficaces pour events
CREATE POLICY "Events tenant access" ON public.events
  FOR ALL USING (tenant_id = ANY(public.get_user_tenant_ids()));

-- 5. Recréer des politiques RLS simples et efficaces pour people
CREATE POLICY "People tenant access" ON public.people
  FOR ALL USING (tenant_id = ANY(public.get_user_tenant_ids()));

-- 6. Recréer des politiques RLS simples et efficaces pour documents
CREATE POLICY "Documents tenant access" ON public.documents
  FOR ALL USING (tenant_id = ANY(public.get_user_tenant_ids()));

-- 7. Recréer des politiques RLS simples pour tasks
DROP POLICY IF EXISTS "Users can view tasks from their tenant" ON public.tasks;
DROP POLICY IF EXISTS "Users can insert tasks for their tenant" ON public.tasks;
DROP POLICY IF EXISTS "Users can update tasks from their tenant" ON public.tasks;
DROP POLICY IF EXISTS "Users can delete tasks from their tenant" ON public.tasks;

CREATE POLICY "Tasks tenant access" ON public.tasks
  FOR ALL USING (tenant_id = ANY(public.get_user_tenant_ids()));

-- 8. Recréer des politiques RLS simples pour timeline_items
DROP POLICY IF EXISTS "Users can view timeline items from their tenant" ON public.timeline_items;
DROP POLICY IF EXISTS "Users can insert timeline items for their tenant" ON public.timeline_items;
DROP POLICY IF EXISTS "Users can update timeline items from their tenant" ON public.timeline_items;
DROP POLICY IF EXISTS "Users can delete timeline items from their tenant" ON public.timeline_items;

CREATE POLICY "Timeline items tenant access" ON public.timeline_items
  FOR ALL USING (tenant_id = ANY(public.get_user_tenant_ids()));

-- 9. Vérifier que toutes les tables ont RLS activé
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.people ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_items ENABLE ROW LEVEL SECURITY;

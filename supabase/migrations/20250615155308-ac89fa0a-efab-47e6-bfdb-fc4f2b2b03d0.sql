
-- Phase 1: Multi-tenant Architecture - Data Migration and RLS (Corrected)

-- Step 1: Create a default tenant and migrate all existing data to it.
DO $$
DECLARE
  default_tenant_id UUID;
  tables_to_migrate TEXT[] := ARRAY[
    'events', 'tasks', 'people', 'vendors', 'event_documents',
    'event_configurations', 'event_roles', 'timeline_items',
    'task_categories', 'google_drive_configs', 'subscriptions'
  ];
  t_name TEXT;
BEGIN
  -- Check if a default tenant already exists to make this script rerunnable
  SELECT id INTO default_tenant_id FROM public.tenants WHERE name = 'Default Tenant' LIMIT 1;
  IF default_tenant_id IS NULL THEN
    -- Insert the default tenant and capture its ID.
    INSERT INTO public.tenants (name) VALUES ('Default Tenant') RETURNING id INTO default_tenant_id;
  END IF;

  -- Loop through tables and update records to belong to the new default tenant.
  FOREACH t_name IN ARRAY tables_to_migrate
  LOOP
    EXECUTE format('UPDATE public.%I SET tenant_id = %L WHERE tenant_id IS NULL;', t_name, default_tenant_id);
  END LOOP;
END $$;

-- Step 2: Now that data is migrated, make tenant_id columns non-nullable.
ALTER TABLE public.events ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE public.tasks ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE public.people ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE public.vendors ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE public.event_documents ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE public.event_configurations ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE public.event_roles ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE public.timeline_items ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE public.task_categories ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE public.google_drive_configs ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE public.subscriptions ALTER COLUMN tenant_id SET NOT NULL;

-- Step 3: Create helper functions for Row Level Security (RLS) in the PUBLIC schema.
-- This function gets the active tenant_id for the currently logged-in user.
CREATE OR REPLACE FUNCTION public.get_current_tenant_id()
RETURNS UUID AS $$
DECLARE
  tenant_id UUID;
BEGIN
  SELECT tu.tenant_id INTO tenant_id
  FROM public.tenant_users tu
  WHERE tu.user_id = auth.uid()
  LIMIT 1; -- Assumes a user belongs to one tenant for now.
  RETURN tenant_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- This function checks if a given row belongs to the user's tenant.
CREATE OR REPLACE FUNCTION public.is_member_of_tenant(p_tenant_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- Use the corrected function from the public schema
  RETURN p_tenant_id = public.get_current_tenant_id();
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Step 4: Enable and apply RLS policies to all tenant-specific tables.
-- First, drop existing policies if they exist, to make the script rerunnable.
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public') LOOP
    EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.' || quote_ident(r.tablename) || ';';
  END LOOP;
END $$;

DO $$
DECLARE
  tables_to_secure TEXT[] := ARRAY[
    'tenants', 'tenant_users', 'events', 'tasks', 'people', 'vendors', 'event_documents',
    'event_configurations', 'event_roles', 'timeline_items',
    'task_categories', 'google_drive_configs', 'subscriptions'
  ];
  t_name TEXT;
BEGIN
  FOREACH t_name IN ARRAY tables_to_secure
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', t_name);
    EXECUTE format('ALTER TABLE public.%I FORCE ROW LEVEL SECURITY;', t_name);
  END LOOP;
END $$;

-- Policies for 'tenants' table
CREATE POLICY "Tenant members can see their own tenant" ON public.tenants
  FOR SELECT USING (id = public.get_current_tenant_id());

-- Policies for 'tenant_users' table
CREATE POLICY "Users can see their own tenant memberships" ON public.tenant_users
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Tenant owners can manage their tenant users" ON public.tenant_users
  FOR ALL USING (public.is_member_of_tenant(tenant_id));

-- Generic policies for all other data tables
DO $$
DECLARE
  data_tables TEXT[] := ARRAY[
    'events', 'tasks', 'people', 'vendors', 'event_documents',
    'event_configurations', 'event_roles', 'timeline_items',
    'task_categories', 'google_drive_configs', 'subscriptions'
  ];
  t_name TEXT;
BEGIN
  FOREACH t_name IN ARRAY data_tables
  LOOP
    EXECUTE format('
      CREATE POLICY "Allow full access for tenant members"
      ON public.%I
      FOR ALL
      USING (public.is_member_of_tenant(tenant_id))
      WITH CHECK (public.is_member_of_tenant(tenant_id));
    ', t_name);
  END LOOP;
END $$;

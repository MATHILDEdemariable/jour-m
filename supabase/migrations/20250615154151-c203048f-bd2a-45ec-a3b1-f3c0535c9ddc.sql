
-- Phase 1: Multi-tenant Architecture - Schema Setup

-- Step 1: Create the tenants table to represent each client/organization.
CREATE TABLE public.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to automatically update the 'updated_at' timestamp on tenants table.
-- This reuses an existing function in your database.
CREATE TRIGGER on_tenants_update
  BEFORE UPDATE ON public.tenants
  FOR EACH ROW
  EXECUTE PROCEDURE public.update_updated_at_column();

-- Step 2: Define user roles within a tenant and create a table to link users to tenants.
CREATE TYPE public.tenant_role AS ENUM ('owner', 'admin', 'member');

CREATE TABLE public.tenant_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.tenant_role NOT NULL DEFAULT 'member',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, user_id)
);

-- Step 3: Add a 'tenant_id' column to all relevant data tables to associate records with a tenant.
-- We make it NULLABLE for now to avoid breaking existing data. We will populate it in a later step.
ALTER TABLE public.events ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
ALTER TABLE public.tasks ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
ALTER TABLE public.people ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
ALTER TABLE public.vendors ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
ALTER TABLE public.event_documents ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
ALTER TABLE public.event_configurations ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
ALTER TABLE public.event_roles ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
ALTER TABLE public.timeline_items ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
ALTER TABLE public.task_categories ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
ALTER TABLE public.google_drive_configs ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;

-- Step 4: Update the subscriptions table to be tenant-based instead of user-based.
ALTER TABLE public.subscriptions ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;



-- Phase 1: Multi-tenant Architecture - User & Tenant Linking

-- Step 1: Link all existing users to the 'Default Tenant' to restore access.
-- This makes the script safely rerunnable.
DO $$
DECLARE
  default_tenant_id UUID;
BEGIN
  -- Get the ID of the Default Tenant
  SELECT id INTO default_tenant_id FROM public.tenants WHERE name = 'Default Tenant' LIMIT 1;

  -- If the tenant exists, link all existing users to it as 'owner'
  -- if they are not already linked to any tenant.
  IF default_tenant_id IS NOT NULL THEN
    INSERT INTO public.tenant_users (tenant_id, user_id, role)
    SELECT default_tenant_id, u.id, 'owner'
    FROM auth.users u
    WHERE NOT EXISTS (
      SELECT 1 FROM public.tenant_users tu WHERE tu.user_id = u.id
    );
  END IF;
END $$;

-- Step 2: Update the new user creation process to be fully tenant-aware.
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  new_tenant_id UUID;
  user_full_name TEXT;
  tenant_name TEXT;
BEGIN
  -- Get user's full name, fallback to email part if not present
  user_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1));
  tenant_name := user_full_name || '''s Organization';

  -- Create a new profile for the user
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, user_full_name);

  -- Create a new tenant for the user
  INSERT INTO public.tenants (name)
  VALUES (tenant_name)
  RETURNING id INTO new_tenant_id;

  -- Link the new user to the new tenant as an owner
  INSERT INTO public.tenant_users (tenant_id, user_id, role)
  VALUES (new_tenant_id, NEW.id, 'owner');
  
  -- Create a free subscription for the new tenant
  -- This replaces the old subscription creation logic
  INSERT INTO public.subscriptions (user_id, tenant_id, plan_type, status)
  VALUES (NEW.id, new_tenant_id, 'free', 'active');
  
  RETURN NEW;
END;
$function$


import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AdminAuthContext';

const fetchCurrentTenant = async (userId: string | undefined) => {
  if (!userId) {
    return null;
  }

  const { data: tenantUser, error: tenantUserError } = await supabase
    .from('tenant_users')
    .select('tenant_id')
    .eq('user_id', userId)
    .single();

  if (tenantUserError) {
    console.error('Error fetching tenant user link:', tenantUserError.message);
    if (tenantUserError.code === 'PGRST116') {
      console.warn(`No tenant found for user ${userId}, or multiple tenants found. This can happen during initial sign-up.`);
    }
    return null;
  }

  if (!tenantUser) {
    return null;
  }

  const { data: tenant, error: tenantError } = await supabase
    .from('tenants')
    .select('*')
    .eq('id', tenantUser.tenant_id)
    .single();
  
  if (tenantError) {
    console.error('Error fetching tenant details:', tenantError.message);
    return null;
  }

  return tenant;
};

export const useCurrentTenant = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['currentTenant', user?.id],
    queryFn: () => fetchCurrentTenant(user?.id),
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};


import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const fetchCurrentTenant = async (tenantId: string | null) => {
  if (!tenantId) return null;

  const { data: tenant, error } = await supabase
    .from('tenants')
    .select('*')
    .eq('id', tenantId)
    .single();
  
  if (error) {
    console.error('Error fetching tenant details:', error);
    return null;
  }

  return tenant;
};

export const useCurrentTenant = () => {
  const { currentTenantId } = useAuth();
  
  return useQuery({
    queryKey: ['currentTenant', currentTenantId],
    queryFn: () => fetchCurrentTenant(currentTenantId),
    enabled: !!currentTenantId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

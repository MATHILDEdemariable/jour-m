
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useShareToken = () => {
  const { toast } = useToast();
  const [regenerating, setRegenerating] = useState(false);

  const regenerateShareToken = async (eventId: string) => {
    setRegenerating(true);
    try {
      // Generate a new UUID for the share token
      const newToken = crypto.randomUUID();
      
      const { data, error } = await supabase
        .from('events')
        .update({ share_token: newToken })
        .eq('id', eventId)
        .select('share_token')
        .single();

      if (error) throw error;

      toast({
        title: 'Token régénéré',
        description: 'Un nouveau lien de partage a été généré. L\'ancien lien ne fonctionne plus.',
      });

      return data.share_token;
    } catch (error) {
      console.error('Error regenerating share token:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de régénérer le token de partage',
        variant: 'destructive',
      });
      return null;
    } finally {
      setRegenerating(false);
    }
  };

  return {
    regenerateShareToken,
    regenerating
  };
};

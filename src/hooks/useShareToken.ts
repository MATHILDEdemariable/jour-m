
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface ShareToken {
  id: string;
  event_id: string;
  token: string;
  expires_at: string;
  created_at: string;
}

export const useShareToken = () => {
  const { toast } = useToast();
  const [generating, setGenerating] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  const generateShareToken = async (eventId: string): Promise<string | null> => {
    setGenerating(true);
    try {
      // Generate a new UUID for the share token
      const token = crypto.randomUUID();
      
      // Set expiration to 30 days from now
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      console.log('Generating share token for event:', eventId);

      const { data, error } = await supabase
        .from('event_share_tokens')
        .insert({
          event_id: eventId,
          token,
          expires_at: expiresAt.toISOString()
        })
        .select('token')
        .single();

      if (error) {
        console.error('Error inserting token:', error);
        throw error;
      }

      console.log('Token generated successfully:', data.token);

      toast({
        title: 'Lien créé',
        description: 'Nouveau lien de partage généré avec succès. Valide pendant 30 jours.',
      });

      return data.token;
    } catch (error) {
      console.error('Error generating share token:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de générer le token de partage',
        variant: 'destructive',
      });
      return null;
    } finally {
      setGenerating(false);
    }
  };

  const regenerateShareToken = async (eventId: string): Promise<string | null> => {
    setRegenerating(true);
    try {
      // First, delete existing tokens for this event
      await supabase
        .from('event_share_tokens')
        .delete()
        .eq('event_id', eventId);

      // Then generate a new token
      const newToken = await generateShareToken(eventId);
      
      if (newToken) {
        toast({
          title: 'Token régénéré',
          description: 'Un nouveau lien de partage a été généré. L\'ancien lien ne fonctionne plus.',
        });
      }

      return newToken;
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

  const validateShareToken = async (token: string): Promise<{ isValid: boolean; eventId?: string; error?: string }> => {
    try {
      const { data, error } = await supabase
        .from('event_share_tokens')
        .select('event_id, expires_at')
        .eq('token', token)
        .single();

      if (error || !data) {
        return { isValid: false, error: 'Token invalide' };
      }

      // Check if token has expired
      const now = new Date();
      const expiresAt = new Date(data.expires_at);
      
      if (now > expiresAt) {
        return { isValid: false, error: 'Token expiré' };
      }

      return { isValid: true, eventId: data.event_id };
    } catch (error) {
      console.error('Error validating share token:', error);
      return { isValid: false, error: 'Erreur lors de la validation' };
    }
  };

  const getActiveTokens = async (eventId: string): Promise<ShareToken[]> => {
    try {
      const { data, error } = await supabase
        .from('event_share_tokens')
        .select('*')
        .eq('event_id', eventId)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching active tokens:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching active tokens:', error);
      return [];
    }
  };

  const revokeToken = async (tokenId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('event_share_tokens')
        .delete()
        .eq('id', tokenId);

      if (error) throw error;

      toast({
        title: 'Token révoqué',
        description: 'Le lien de partage a été désactivé avec succès.',
      });

      return true;
    } catch (error) {
      console.error('Error revoking token:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de révoquer le token',
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
    generateShareToken,
    regenerateShareToken,
    validateShareToken,
    getActiveTokens,
    revokeToken,
    generating,
    regenerating
  };
};

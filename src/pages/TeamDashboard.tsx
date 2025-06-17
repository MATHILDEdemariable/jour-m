
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Users, Calendar, MapPin, ArrowRight, ArrowLeft } from 'lucide-react';

interface EventInfo {
  id: string;
  name: string;
  event_date: string;
  event_type: string;
  location?: string;
}

const TeamDashboard = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [eventInfo, setEventInfo] = useState<EventInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const magicAccess = searchParams.get('magic_access') === 'true';
    const eventId = searchParams.get('event_id');

    if (!magicAccess || !eventId) {
      navigate('/magic-access', { replace: true });
      return;
    }

    // Vérifier les données du localStorage
    const magicLoginData = localStorage.getItem('eventPortalMagicLogin');
    if (!magicLoginData) {
      navigate('/magic-access', { replace: true });
      return;
    }

    // Charger les informations de l'événement
    const fetchEventInfo = async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('id, name, event_date, event_type, location')
          .eq('id', eventId)
          .single();

        if (error || !data) {
          throw error;
        }

        setEventInfo(data);
      } catch (error) {
        console.error('Error fetching event info:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de charger les informations de l\'événement',
          variant: 'destructive',
        });
        navigate('/magic-access', { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchEventInfo();
  }, [searchParams, navigate, toast]);

  const handleAccessTeam = () => {
    if (!eventInfo) return;
    
    // Rediriger vers l'EventPortal avec les paramètres magic access corrects
    console.log('TeamDashboard - Redirecting to EventPortal with magic access for event:', eventInfo.id);
    navigate(`/event-portal?magic_access=true&event_id=${eventInfo.id}`, { replace: true });
  };

  const handleBack = () => {
    // Nettoyer le localStorage et retourner à l'accueil
    localStorage.removeItem('eventPortalMagicLogin');
    navigate('/', { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des informations...</p>
        </div>
      </div>
    );
  }

  if (!eventInfo) {
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b">
        <div className="container mx-auto flex justify-between items-center p-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            JOURM
          </h1>
          <Button 
            variant="ghost"
            onClick={handleBack}
            className="text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* En-tête de bienvenue */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-full">
                <Users className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Accès Équipe Autorisé
            </h1>
            <p className="text-gray-600">
              Vous avez maintenant accès au planning de l'équipe
            </p>
          </div>

          {/* Informations de l'événement */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl mb-6">
            <CardHeader>
              <CardTitle className="text-xl text-center">Informations de l'événement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-purple-600 mb-4">{eventInfo.name}</h2>
                
                <div className="grid gap-3">
                  <div className="flex items-center justify-center gap-2 text-gray-700">
                    <Calendar className="w-5 h-5 text-purple-500" />
                    <span className="font-medium">{formatDate(eventInfo.event_date)}</span>
                  </div>
                  
                  <div className="flex items-center justify-center gap-2 text-gray-600">
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                      {eventInfo.event_type}
                    </span>
                  </div>
                  
                  {eventInfo.location && (
                    <div className="flex items-center justify-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4 text-purple-500" />
                      <span>{eventInfo.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bouton d'accès à l'équipe */}
          <div className="text-center">
            <Button
              onClick={handleAccessTeam}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 text-lg"
            >
              <Users className="w-5 h-5 mr-2" />
              Accéder à l'Équipe
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <p className="text-sm text-gray-500 mt-4">
              Vous pourrez sélectionner votre profil et accéder à votre planning personnalisé
            </p>
          </div>
        </div>
      </div>

      <footer className="bg-stone-100 border-t mt-12">
        <div className="container mx-auto p-8 text-center text-stone-500">
          <p>© 2025 JOURM par Mariable. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default TeamDashboard;

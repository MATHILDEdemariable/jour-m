
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Calendar, Settings, Building2, FileText, Loader2, AlertCircle, Eye, Share } from 'lucide-react';
import { useShareToken } from '@/hooks/useShareToken';
import { supabase } from '@/integrations/supabase/client';

// Composants read-only réutilisés
import { ReadOnlyEventConfig } from '@/components/equipe/ReadOnlyEventConfig';
import { ReadOnlyPeopleList } from '@/components/equipe/ReadOnlyPeopleList';
import { ReadOnlyVendorList } from '@/components/equipe/ReadOnlyVendorList';
import { ReadOnlyDocumentsList } from '@/components/equipe/ReadOnlyDocumentsList';
import { PlanningView } from '@/components/equipe/PlanningView';

const PublicEventPage = () => {
  const { token } = useParams<{ token: string }>();
  const { validateShareToken } = useShareToken();
  const [activeTab, setActiveTab] = useState('config');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [eventData, setEventData] = useState<any>(null);
  const [eventStats, setEventStats] = useState({
    peopleCount: 0,
    vendorsCount: 0,
    planningCount: 0,
    documentsCount: 0
  });

  useEffect(() => {
    const validateAndLoadEvent = async () => {
      if (!token) {
        setError('Token de partage manquant');
        setLoading(false);
        return;
      }

      try {
        // Valider le token
        const validation = await validateShareToken(token);
        
        if (!validation.isValid) {
          setError(validation.error || 'Token invalide');
          setLoading(false);
          return;
        }

        // Charger les données de l'événement
        const { data: event, error: eventError } = await supabase
          .from('events')
          .select('*')
          .eq('id', validation.eventId!)
          .single();

        if (eventError) {
          setError('Événement introuvable');
          setLoading(false);
          return;
        }

        setEventData(event);

        // Charger les statistiques
        const [peopleData, vendorsData, timelineData, documentsData] = await Promise.all([
          supabase.from('people').select('*').eq('event_id', validation.eventId!),
          supabase.from('vendors').select('*').eq('event_id', validation.eventId!),
          supabase.from('timeline_items').select('*').eq('event_id', validation.eventId!),
          supabase.from('documents').select('*').eq('event_id', validation.eventId!)
        ]);

        setEventStats({
          peopleCount: peopleData.data?.length || 0,
          vendorsCount: vendorsData.data?.length || 0,
          planningCount: timelineData.data?.length || 0,
          documentsCount: documentsData.data?.length || 0
        });

        // Stocker l'ID de l'événement pour les composants enfants
        localStorage.setItem('publicEventId', validation.eventId!);
        localStorage.setItem('currentEventId', validation.eventId!);

      } catch (error) {
        console.error('Error validating token:', error);
        setError('Erreur lors de la validation du lien');
      } finally {
        setLoading(false);
      }
    };

    validateAndLoadEvent();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Chargement...</h2>
            <p className="text-gray-600">Validation du lien de partage</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !eventData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-500" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Accès non autorisé</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="text-sm text-gray-500">
              Veuillez demander un nouveau lien à l'organisateur de l'événement.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getTabCount = (tab: string) => {
    switch (tab) {
      case 'people':
        return eventStats.peopleCount;
      case 'vendors':
        return eventStats.vendorsCount;
      case 'planning':
        return eventStats.planningCount;
      case 'documents':
        return eventStats.documentsCount;
      default:
        return 0;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header public */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4 overflow-hidden">
              <div className="overflow-hidden">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Eye className="w-4 h-4 text-white" />
                  </div>
                  <div className="overflow-hidden">
                    <h1 className="text-xl lg:text-2xl font-bold text-gray-900 truncate">
                      {eventData.name}
                    </h1>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{eventData.event_type}</span>
                      <span>•</span>
                      <span>{new Date(eventData.event_date).toLocaleDateString('fr-FR')}</span>
                      {eventData.location && (
                        <>
                          <span>•</span>
                          <span className="truncate">{eventData.location}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1">
                <Share className="w-3 h-3" />
                Vue Publique
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Navigation par onglets */}
          <div className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
            <TabsList className="grid w-full grid-cols-5 h-auto p-1 bg-gray-50">
              <TabsTrigger 
                value="config" 
                className="flex flex-col items-center gap-1 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <Settings className="w-4 h-4" />
                <span className="text-xs hidden sm:inline">Configuration</span>
              </TabsTrigger>
              <TabsTrigger 
                value="people" 
                className="flex flex-col items-center gap-1 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {getTabCount('people') > 0 && (
                    <Badge variant="secondary" className="h-4 text-xs">
                      {getTabCount('people')}
                    </Badge>
                  )}
                </div>
                <span className="text-xs hidden sm:inline">Équipe</span>
              </TabsTrigger>
              <TabsTrigger 
                value="vendors" 
                className="flex flex-col items-center gap-1 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <div className="flex items-center gap-1">
                  <Building2 className="w-4 h-4" />
                  {getTabCount('vendors') > 0 && (
                    <Badge variant="secondary" className="h-4 text-xs">
                      {getTabCount('vendors')}
                    </Badge>
                  )}
                </div>
                <span className="text-xs hidden sm:inline">Prestataires</span>
              </TabsTrigger>
              <TabsTrigger 
                value="planning" 
                className="flex flex-col items-center gap-1 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {getTabCount('planning') > 0 && (
                    <Badge variant="secondary" className="h-4 text-xs">
                      {getTabCount('planning')}
                    </Badge>
                  )}
                </div>
                <span className="text-xs hidden sm:inline">Planning</span>
              </TabsTrigger>
              <TabsTrigger 
                value="documents" 
                className="flex flex-col items-center gap-1 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <div className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  {getTabCount('documents') > 0 && (
                    <Badge variant="secondary" className="h-4 text-xs">
                      {getTabCount('documents')}
                    </Badge>
                  )}
                </div>
                <span className="text-xs hidden sm:inline">Documents</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Contenu des onglets */}
          <TabsContent value="config" className="space-y-6">
            <ReadOnlyEventConfig />
          </TabsContent>

          <TabsContent value="people" className="space-y-6">
            <ReadOnlyPeopleList />
          </TabsContent>

          <TabsContent value="vendors" className="space-y-6">
            <ReadOnlyVendorList />
          </TabsContent>

          <TabsContent value="planning" className="space-y-6">
            <PlanningView />
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <ReadOnlyDocumentsList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PublicEventPage;

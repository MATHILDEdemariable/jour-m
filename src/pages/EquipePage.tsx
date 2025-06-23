
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, Settings, Building2, FileText, Loader2, AlertCircle } from 'lucide-react';
import { useLocalEventData } from '@/contexts/LocalEventDataContext';
import { useShareToken } from '@/hooks/useShareToken';
import { Card, CardContent } from '@/components/ui/card';

// Composants améliorés
import { EnhancedTeamHeader } from '@/components/equipe/EnhancedTeamHeader';
import { QuickStatsCard } from '@/components/admin/QuickStatsCard';

// Composants existants
import { PlanningView } from '@/components/equipe/PlanningView';
import { ContactsList } from '@/components/equipe/ContactsList';
import { ReadOnlyEventConfig } from '@/components/equipe/ReadOnlyEventConfig';
import { ReadOnlyPeopleList } from '@/components/equipe/ReadOnlyPeopleList';
import { ReadOnlyVendorList } from '@/components/equipe/ReadOnlyVendorList';
import { ReadOnlyDocumentsList } from '@/components/equipe/ReadOnlyDocumentsList';

const EquipePage = () => {
  const [activeTab, setActiveTab] = useState('config');
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState<string>('');
  const [isTokenAccess, setIsTokenAccess] = useState(false);
  
  const token = searchParams.get('token');
  const { validateShareToken } = useShareToken();
  
  const { 
    currentEvent, 
    people, 
    vendors, 
    timelineItems, 
    planningItems, 
    documents,
    getDaysUntilEvent,
    getProgressStats,
    setCurrentEventId
  } = useLocalEventData();

  // Validation du token au chargement
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setIsTokenAccess(false);
        return;
      }

      setLoading(true);
      try {
        console.log('Validating token:', token);
        const validation = await validateShareToken(token);
        
        if (!validation.isValid) {
          console.error('Token validation failed:', validation.error);
          setValidationError(validation.error || 'Token invalide');
          setLoading(false);
          return;
        }

        console.log('Token validated, event ID:', validation.eventId);
        setIsTokenAccess(true);
        
        // Définir l'événement actuel basé sur le token
        if (validation.eventId) {
          setCurrentEventId(validation.eventId);
        }
        
      } catch (error) {
        console.error('Error validating token:', error);
        setValidationError('Erreur lors de la validation du token');
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, [token, validateShareToken]);

  const progressStats = getProgressStats();

  const getTabCount = (tab: string) => {
    switch (tab) {
      case 'people':
        return people.length;
      case 'vendors':
        return vendors.length;
      case 'planning':
        return timelineItems.length + planningItems.length;
      case 'documents':
        return documents.length;
      default:
        return 0;
    }
  };

  // Affichage du chargement
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Chargement...</h2>
            <p className="text-gray-600">Validation de l'accès</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Affichage de l'erreur si le token est invalide
  if (token && validationError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-500" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Accès non autorisé</h2>
            <p className="text-gray-600 mb-4">{validationError}</p>
            <div className="text-sm text-gray-500">
              Veuillez demander un nouveau lien à l'organisateur de l'événement.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Header amélioré */}
      <EnhancedTeamHeader />

      {/* Indicateur d'accès partagé */}
      {isTokenAccess && (
        <div className="bg-blue-50 border-b border-blue-200">
          <div className="max-w-7xl mx-auto p-2 text-center">
            <Badge className="bg-blue-100 text-blue-800">
              👁️ Vue partagée - Accès en lecture seule
            </Badge>
          </div>
        </div>
      )}

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
                <span className="text-xs hidden sm:inline">Paramètres</span>
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
                <span className="text-xs hidden sm:inline">Professionnels</span>
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
            {/* Stats rapides */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <QuickStatsCard
                title="Jours restants"
                value={getDaysUntilEvent()}
                icon={<Calendar className="w-4 h-4 text-purple-600" />}
                subtitle="jusqu'au jour-J"
              />
              <QuickStatsCard
                title="Progression"
                value={`${progressStats.progressPercentage}%`}
                icon={<Settings className="w-4 h-4 text-blue-600" />}
                subtitle={`${progressStats.completedTasks}/${progressStats.totalTasks} tâches`}
              />
              <QuickStatsCard
                title="Équipe"
                value={people.length}
                icon={<Users className="w-4 h-4 text-green-600" />}
                subtitle="personnes"
              />
              <QuickStatsCard
                title="Planning"
                value={timelineItems.length + planningItems.length}
                icon={<Calendar className="w-4 h-4 text-orange-600" />}
                subtitle="activités"
              />
            </div>
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

export default EquipePage;

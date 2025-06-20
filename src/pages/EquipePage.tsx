
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, Settings, Building2, FileText } from 'lucide-react';
import { useLocalEventData } from '@/contexts/LocalEventDataContext';

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
  const { 
    currentEvent, 
    people, 
    vendors, 
    timelineItems, 
    planningItems, 
    documents,
    getDaysUntilEvent,
    getProgressStats 
  } = useLocalEventData();

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Header amélioré */}
      <EnhancedTeamHeader />

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

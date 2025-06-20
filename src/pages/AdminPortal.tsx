
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLocalEventData } from '@/contexts/LocalEventDataContext';

// Import des nouveaux composants améliorés
import { ImprovedAdminHeader } from '@/components/admin/ImprovedAdminHeader';
import { ImprovedTabNavigation } from '@/components/admin/ImprovedTabNavigation';
import { QuickStatsCard } from '@/components/admin/QuickStatsCard';

// Import des composants existants
import { CompactRecapDashboard } from '@/components/admin/CompactRecapDashboard';
import { UnifiedPlanningManagement } from '@/components/admin/UnifiedPlanningManagement';
import { PeopleManagement } from '@/components/admin/PeopleManagement';
import { VendorManagement } from '@/components/admin/VendorManagement';
import { DocumentManagement } from '@/components/admin/DocumentManagement';
import { EventConfiguration } from '@/components/admin/EventConfiguration';
import { AdminBottomNavigation } from '@/components/admin/AdminBottomNavigation';
import { TutorialModal } from '@/components/admin/TutorialModal';
import { TUTORIAL_CONTENT } from '@/components/admin/TutorialContent';

// Icons
import { Users, Building2, Calendar, FileText, Clock } from 'lucide-react';

export const AdminPortal = () => {
  const [activeTab, setActiveTab] = useState('config');
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const isMobile = useIsMobile();
  const { t } = useTranslation();
  const { 
    currentEvent, 
    people, 
    vendors, 
    timelineItems, 
    planningItems, 
    documents,
    getDaysUntilEvent 
  } = useLocalEventData();

  const getCurrentTutorial = () => {
    return TUTORIAL_CONTENT[activeTab as keyof typeof TUTORIAL_CONTENT] || TUTORIAL_CONTENT.planning;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'config':
        return (
          <div className="space-y-6">
            {/* Quick Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <QuickStatsCard
                title="Jours restants"
                value={getDaysUntilEvent()}
                icon={<Clock className="w-4 h-4 text-purple-600" />}
                subtitle="jusqu'au jour-J"
              />
              <QuickStatsCard
                title="Équipe"
                value={people.length}
                icon={<Users className="w-4 h-4 text-blue-600" />}
                subtitle="personnes"
              />
              <QuickStatsCard
                title="Prestataires"
                value={vendors.length}
                icon={<Building2 className="w-4 h-4 text-green-600" />}
                subtitle="services"
              />
              <QuickStatsCard
                title="Planning"
                value={timelineItems.length + planningItems.length}
                icon={<Calendar className="w-4 h-4 text-orange-600" />}
                subtitle="activités"
              />
              <QuickStatsCard
                title="Documents"
                value={documents.length}
                icon={<FileText className="w-4 h-4 text-pink-600" />}
                subtitle="fichiers"
              />
            </div>
            
            {/* Configuration principale */}
            <EventConfiguration />
          </div>
        );
      case 'people':
        return <PeopleManagement />;
      case 'vendors':
        return <VendorManagement />;
      case 'planning':
        return <UnifiedPlanningManagement />;
      case 'documents':
        return <DocumentManagement />;
      default:
        return <EventConfiguration />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header amélioré */}
      <ImprovedAdminHeader 
        onTutorialOpen={() => setTutorialOpen(true)}
        isMobile={isMobile}
      />

      {/* Navigation par onglets améliorée - Desktop uniquement */}
      {!isMobile && (
        <ImprovedTabNavigation 
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      )}

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto p-4 lg:p-6 pb-20 lg:pb-6">
        {renderTabContent()}
      </div>

      {/* Navigation mobile */}
      {isMobile && (
        <AdminBottomNavigation 
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      )}

      {/* Modal de tutoriel */}
      <TutorialModal
        isOpen={tutorialOpen}
        onClose={() => setTutorialOpen(false)}
        title={getCurrentTutorial().title}
        description={getCurrentTutorial().description}
        steps={getCurrentTutorial().steps}
      />
    </div>
  );
};

export default AdminPortal;

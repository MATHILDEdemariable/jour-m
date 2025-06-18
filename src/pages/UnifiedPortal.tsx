
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, LogOut, HelpCircle, Users, Building2, Shield, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { LanguageToggle } from '@/components/LanguageToggle';
import { useLocalEventData } from '@/contexts/LocalEventDataContext';
import { useIsMobile } from '@/hooks/use-mobile';

// Import existing components
import { EventConfiguration } from '@/components/admin/EventConfiguration';
import { PeopleManagement } from '@/components/admin/PeopleManagement';
import { VendorManagement } from '@/components/admin/VendorManagement';
import { UnifiedPlanningManagement } from '@/components/admin/UnifiedPlanningManagement';
import { DocumentManagement } from '@/components/admin/DocumentManagement';
import { UnifiedPersonalPlanning } from '@/components/event/UnifiedPersonalPlanning';
import { ContactsTab } from '@/components/event/ContactsTab';
import { PersonalDocuments } from '@/components/event/PersonalDocuments';
import { AdminBottomNavigation } from '@/components/admin/AdminBottomNavigation';

type UserRole = 'admin' | 'person' | 'vendor' | 'guest';

interface UserInfo {
  id: string;
  name: string;
  role: UserRole;
  type: 'person' | 'vendor';
}

export const UnifiedPortal = () => {
  const [activeTab, setActiveTab] = useState('planning');
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { t } = useTranslation();
  const { signOut, user } = useAuth();
  const { currentEvent, people, vendors } = useLocalEventData();

  // Auto-detect user role and info from URL parameters
  useEffect(() => {
    const userId = searchParams.get('user_id');
    const userType = searchParams.get('user_type') as 'person' | 'vendor';
    const autoLogin = searchParams.get('auto_login');

    if (user && !userId) {
      // Admin user logged in
      setUserInfo({
        id: user.id,
        name: user.email || 'Admin',
        role: 'admin',
        type: 'person'
      });
      setActiveTab('config');
    } else if (userId && userType && autoLogin) {
      // Auto-login from URL
      const userData = userType === 'person' 
        ? people.find(p => p.id === userId)
        : vendors.find(v => v.id === userId);

      if (userData) {
        setUserInfo({
          id: userId,
          name: userData.name,
          role: userType as UserRole,
          type: userType
        });
        setActiveTab('planning');
      }
    }
  }, [searchParams, user, people, vendors]);

  const getRoleConfig = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return {
          label: 'Administrateur',
          icon: Shield,
          color: 'bg-red-100 text-red-800',
          canEdit: true,
          availableTabs: ['config', 'people', 'vendors', 'planning', 'documents']
        };
      case 'person':
        return {
          label: 'Équipe',
          icon: Users,
          color: 'bg-purple-100 text-purple-800',
          canEdit: false,
          availableTabs: ['planning', 'contacts', 'documents']
        };
      case 'vendor':
        return {
          label: 'Prestataire',
          icon: Building2,
          color: 'bg-blue-100 text-blue-800',
          canEdit: false,
          availableTabs: ['planning', 'contacts', 'documents']
        };
      default:
        return {
          label: 'Invité',
          icon: Eye,
          color: 'bg-gray-100 text-gray-800',
          canEdit: false,
          availableTabs: ['planning']
        };
    }
  };

  const renderTabContent = () => {
    if (!userInfo) return null;

    const roleConfig = getRoleConfig(userInfo.role);

    switch (activeTab) {
      case 'config':
        return roleConfig.canEdit ? <EventConfiguration /> : null;
      case 'people':
        return roleConfig.canEdit ? <PeopleManagement /> : null;
      case 'vendors':
        return roleConfig.canEdit ? <VendorManagement /> : null;
      case 'planning':
        return userInfo.role === 'admin' ? (
          <UnifiedPlanningManagement />
        ) : (
          <UnifiedPersonalPlanning 
            userId={userInfo.id}
            userName={userInfo.name}
            userType={userInfo.type}
            viewMode="personal"
            onViewModeChange={() => {}}
          />
        );
      case 'contacts':
        return userInfo.role !== 'admin' ? (
          <ContactsTab 
            userId={userInfo.id}
            userType={userInfo.type}
          />
        ) : null;
      case 'documents':
        return userInfo.role === 'admin' ? (
          <DocumentManagement />
        ) : (
          <PersonalDocuments 
            personId={userInfo.id}
            personName={userInfo.name}
          />
        );
      default:
        return null;
    }
  };

  if (!userInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de votre profil...</p>
        </div>
      </div>
    );
  }

  const roleConfig = getRoleConfig(userInfo.role);
  const IconComponent = roleConfig.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Responsive */}
      <div className="bg-white border-b shadow-sm">
        <div className="flex items-center justify-between p-3 lg:p-4">
          <div className="flex items-center gap-2 lg:gap-4 overflow-hidden">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/')}
              className="text-gray-600 px-2 lg:px-3"
            >
              <ArrowLeft className="w-4 h-4 mr-1 lg:mr-2" />
              <span className="hidden sm:inline">{t('back')}</span>
            </Button>
            <div className="overflow-hidden">
              <h1 className="text-lg lg:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent truncate">
                {currentEvent ? currentEvent.name : 'Jour J'}
              </h1>
              {currentEvent && (
                <p className="text-xs lg:text-sm text-gray-600 truncate">
                  {currentEvent.event_type} • {new Date(currentEvent.event_date).toLocaleDateString('fr-FR')}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 lg:gap-2">
            <Badge className={`${roleConfig.color} text-xs flex items-center gap-1`}>
              <IconComponent className="w-3 h-3" />
              {roleConfig.label}
            </Badge>
            {userInfo.role === 'admin' && (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1 text-purple-600 border-purple-200 hover:bg-purple-50"
              >
                <HelpCircle className="w-3 h-3" />
                {!isMobile && 'Aide'}
              </Button>
            )}
            {!isMobile && <LanguageToggle />}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => userInfo.role === 'admin' ? signOut() : navigate('/')}
              className="flex items-center gap-1 px-2 lg:px-3"
            >
              <LogOut className="w-3 h-3" />
              {!isMobile && (userInfo.role === 'admin' ? t('logout') : 'Retour')}
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop Navigation Tabs */}
      {!isMobile && (
        <div className="bg-white border-b">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full h-auto p-1" style={{ gridTemplateColumns: `repeat(${roleConfig.availableTabs.length}, 1fr)` }}>
              {roleConfig.availableTabs.includes('config') && (
                <TabsTrigger value="config" className="flex flex-col py-3">
                  <span className="text-xs">⚙️</span>
                  <span className="text-xs">{t('config')}</span>
                </TabsTrigger>
              )}
              {roleConfig.availableTabs.includes('people') && (
                <TabsTrigger value="people" className="flex flex-col py-3">
                  <span className="text-xs">👥</span>
                  <span className="text-xs">{t('people')}</span>
                </TabsTrigger>
              )}
              {roleConfig.availableTabs.includes('vendors') && (
                <TabsTrigger value="vendors" className="flex flex-col py-3">
                  <span className="text-xs">🏢</span>
                  <span className="text-xs">{t('vendors')}</span>
                </TabsTrigger>
              )}
              {roleConfig.availableTabs.includes('planning') && (
                <TabsTrigger value="planning" className="flex flex-col py-3">
                  <span className="text-xs">⏰</span>
                  <span className="text-xs">Planning</span>
                </TabsTrigger>
              )}
              {roleConfig.availableTabs.includes('contacts') && (
                <TabsTrigger value="contacts" className="flex flex-col py-3">
                  <span className="text-xs">👥</span>
                  <span className="text-xs">Contacts</span>
                </TabsTrigger>
              )}
              {roleConfig.availableTabs.includes('documents') && (
                <TabsTrigger value="documents" className="flex flex-col py-3">
                  <span className="text-xs">📁</span>
                  <span className="text-xs">{t('documents')}</span>
                </TabsTrigger>
              )}
            </TabsList>
          </Tabs>
        </div>
      )}

      {/* Content - Responsive */}
      <div className="p-3 lg:p-6 pb-20 lg:pb-6">
        {renderTabContent()}
      </div>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <AdminBottomNavigation 
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      )}
    </div>
  );
};

export default UnifiedPortal;

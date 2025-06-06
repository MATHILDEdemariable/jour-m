
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { TaskManagement } from '@/components/admin/TaskManagement';
import { PlanningManagement } from '@/components/admin/PlanningManagement';
import { PeopleManagement } from '@/components/admin/PeopleManagement';
import { VendorManagement } from '@/components/admin/VendorManagement';
import { DocumentManagement } from '@/components/admin/DocumentManagement';
import { EventConfiguration } from '@/components/admin/EventConfiguration';
import { Button } from '@/components/ui/button';
import { ArrowLeft, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { AdminLoginModal } from '@/components/AdminLoginModal';
import { useAdminProtectedRoute } from '@/hooks/useAdminProtectedRoute';
import { LanguageToggle } from '@/components/LanguageToggle';

export const AdminPortal = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isAuthenticated, logout } = useAdminAuth();
  const { showLoginModal, handleCloseLoginModal } = useAdminProtectedRoute();

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminLoginModal isOpen={showLoginModal} onClose={handleCloseLoginModal} />

      {isAuthenticated && (
        <>
          {/* Header */}
          <div className="bg-white border-b shadow-sm">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate('/')}
                  className="text-gray-600"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t('back')}
                </Button>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Jour J - {t('admin_portal')}
                  </h1>
                  <p className="text-sm text-gray-600">
                    {t === undefined ? 'Portail de gestion événementielle' : ''}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <LanguageToggle />
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={logout}
                  className="flex items-center gap-1"
                >
                  <LogOut className="w-3 h-3" />
                  {t('logout')}
                </Button>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white border-b">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-7 h-auto p-1">
                <TabsTrigger value="dashboard" className="flex flex-col py-3">
                  <span className="text-xs">📊</span>
                  <span className="text-xs">{t('dashboard')}</span>
                </TabsTrigger>
                <TabsTrigger value="tasks" className="flex flex-col py-3">
                  <span className="text-xs">📋</span>
                  <span className="text-xs">{t('tasks')}</span>
                </TabsTrigger>
                <TabsTrigger value="planning" className="flex flex-col py-3">
                  <span className="text-xs">⏰</span>
                  <span className="text-xs">{t('planning')}</span>
                </TabsTrigger>
                <TabsTrigger value="people" className="flex flex-col py-3">
                  <span className="text-xs">👥</span>
                  <span className="text-xs">{t('people')}</span>
                </TabsTrigger>
                <TabsTrigger value="vendors" className="flex flex-col py-3">
                  <span className="text-xs">🏢</span>
                  <span className="text-xs">{t('vendors')}</span>
                </TabsTrigger>
                <TabsTrigger value="documents" className="flex flex-col py-3">
                  <span className="text-xs">📁</span>
                  <span className="text-xs">{t('documents')}</span>
                </TabsTrigger>
                <TabsTrigger value="config" className="flex flex-col py-3">
                  <span className="text-xs">⚙️</span>
                  <span className="text-xs">{t('config')}</span>
                </TabsTrigger>
              </TabsList>

              <div className="p-6">
                <TabsContent value="dashboard">
                  <AdminDashboard />
                </TabsContent>
                <TabsContent value="tasks">
                  <TaskManagement />
                </TabsContent>
                <TabsContent value="planning">
                  <PlanningManagement />
                </TabsContent>
                <TabsContent value="people">
                  <PeopleManagement />
                </TabsContent>
                <TabsContent value="vendors">
                  <VendorManagement />
                </TabsContent>
                <TabsContent value="documents">
                  <DocumentManagement />
                </TabsContent>
                <TabsContent value="config">
                  <EventConfiguration />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminPortal;

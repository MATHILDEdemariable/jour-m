
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw, Settings } from 'lucide-react';
import { useSharedEventData } from '@/hooks/useSharedEventData';
import { EventSummaryCards } from '@/components/event/EventSummaryCards';
import { CriticalTasksList } from '@/components/event/CriticalTasksList';
import { PlanningTimeline } from '@/components/event/PlanningTimeline';
import { TeamOverview } from '@/components/event/TeamOverview';
import { VendorStatus } from '@/components/event/VendorStatus';

const EventPortal = () => {
  const navigate = useNavigate();
  const { loading, refreshData, getDaysUntilEvent } = useSharedEventData();
  
  const daysUntilEvent = getDaysUntilEvent();

  useEffect(() => {
    // Rafraîchir les données au montage
    refreshData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-purple-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="text-purple-700 hover:text-purple-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour à l'accueil
              </Button>
              <div className="h-6 w-px bg-purple-200" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Event Portal
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-sm text-purple-600 font-medium">
                J-{daysUntilEvent} jours
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={refreshData}
                disabled={loading}
                className="border-purple-200 text-purple-700 hover:bg-purple-50"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Actualiser
              </Button>
              <Button
                onClick={() => navigate('/admin')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Settings className="w-4 h-4 mr-2" />
                Admin
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
              <p className="text-purple-600">Chargement des données...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Summary Cards */}
            <EventSummaryCards />
            
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                <CriticalTasksList />
                <TeamOverview />
              </div>
              
              {/* Right Column */}
              <div className="space-y-6">
                <PlanningTimeline />
                <VendorStatus />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventPortal;

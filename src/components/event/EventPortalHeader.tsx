
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw, Settings, LogOut } from 'lucide-react';

interface EventPortalHeaderProps {
  userName: string;
  daysUntilEvent: number;
  isDataLoading: boolean;
  isRefreshing: boolean;
  isMobile: boolean;
  onBack: () => void;
  onRefresh: () => void;
  onLogout: () => void;
  onAdmin: () => void;
}

export const EventPortalHeader: React.FC<EventPortalHeaderProps> = ({
  userName,
  daysUntilEvent,
  isDataLoading,
  isRefreshing,
  isMobile,
  onBack,
  onRefresh,
  onLogout,
  onAdmin,
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm border-b border-purple-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-14 lg:h-16">
          <div className="flex items-center gap-2 lg:gap-4 overflow-hidden">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-purple-700 hover:text-purple-900 px-2 lg:px-3"
            >
              <ArrowLeft className="w-4 h-4 mr-1 lg:mr-2" />
              <span className="hidden sm:inline">Retour</span>
            </Button>
            <div className="hidden lg:block h-6 w-px bg-purple-200" />
            <h1 className="text-base lg:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent truncate">
              Jour-J - {userName}
            </h1>
          </div>
          
          <div className="flex items-center gap-1 lg:gap-3">
            <div className="text-xs lg:text-sm text-purple-600 font-medium whitespace-nowrap">
              J-{daysUntilEvent} jours
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isDataLoading}
              className="border-purple-200 text-purple-700 hover:bg-purple-50 h-7 w-7 lg:h-8 lg:w-auto lg:px-3 p-0"
              title="Synchronisation forcée"
            >
              <RefreshCw className={`w-4 h-4 ${!isMobile && 'mr-2'} ${isDataLoading ? 'animate-spin' : ''}`} />
              {!isMobile && (isRefreshing ? 'Sync...' : 'Actualiser')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              className="border-red-200 text-red-700 hover:bg-red-50 h-7 w-7 lg:h-8 lg:w-auto lg:px-3 p-0"
              title="Déconnexion"
            >
              <LogOut className="w-4 h-4 lg:mr-2" />
              {!isMobile && 'Déconnexion'}
            </Button>
            {!isMobile && (
              <Button
                onClick={onAdmin}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Settings className="w-4 h-4 mr-2" />
                Admin
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, LogOut, HelpCircle, Settings, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalEventData } from '@/contexts/LocalEventDataContext';
import { LanguageToggle } from '@/components/LanguageToggle';

interface ImprovedAdminHeaderProps {
  onTutorialOpen: () => void;
  isMobile: boolean;
}

export const ImprovedAdminHeader: React.FC<ImprovedAdminHeaderProps> = ({
  onTutorialOpen,
  isMobile
}) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { currentEvent } = useLocalEventData();

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
        {/* Left section */}
        <div className="flex items-center gap-4 overflow-hidden">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-900 flex-shrink-0"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {!isMobile && 'Accueil'}
          </Button>
          
          <div className="overflow-hidden">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Settings className="w-4 h-4 text-white" />
              </div>
              <div className="overflow-hidden">
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900 truncate">
                  {currentEvent ? `${currentEvent.name}` : 'Jour J'} - Admin
                </h1>
                {currentEvent && (
                  <p className="text-sm text-gray-500 truncate">
                    {currentEvent.event_type} • {new Date(currentEvent.event_date).toLocaleDateString('fr-FR')}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 hidden sm:flex">
            <Save className="w-3 h-3 mr-1" />
            Sauvegarde Auto
          </Badge>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onTutorialOpen}
            className="text-purple-600 border-purple-200 hover:bg-purple-50"
          >
            <HelpCircle className="w-4 h-4" />
            {!isMobile && <span className="ml-1">Aide</span>}
          </Button>
          
          {!isMobile && <LanguageToggle />}
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={signOut}
            className="text-gray-600 hover:text-gray-900"
          >
            <LogOut className="w-4 h-4" />
            {!isMobile && <span className="ml-1">Déconnexion</span>}
          </Button>
        </div>
      </div>
    </div>
  );
};

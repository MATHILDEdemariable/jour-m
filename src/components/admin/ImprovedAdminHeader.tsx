
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Share2, Settings, Calendar, Download } from 'lucide-react';
import { useLocalEventData } from '@/contexts/LocalEventDataContext';

interface ImprovedAdminHeaderProps {
  onTutorialOpen: () => void;
  isMobile: boolean;
}

export const ImprovedAdminHeader: React.FC<ImprovedAdminHeaderProps> = ({ 
  onTutorialOpen, 
  isMobile 
}) => {
  const { currentEvent, getDaysUntilEvent } = useLocalEventData();
  const daysLeft = getDaysUntilEvent();

  return (
    <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        <div className="flex items-center justify-between">
          {/* Event Info */}
          <div className="flex items-center gap-4 overflow-hidden">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div className="overflow-hidden">
              <h1 className="text-xl lg:text-3xl font-bold text-white truncate">
                {currentEvent?.name || 'Mon Événement'}
              </h1>
              <div className="flex items-center gap-4 text-sm text-purple-100">
                <span>{currentEvent?.event_type || 'mariage'}</span>
                <span>•</span>
                <span>{currentEvent?.event_date ? new Date(currentEvent.event_date).toLocaleDateString('fr-FR') : 'Date à définir'}</span>
                {currentEvent?.location && (
                  <>
                    <span>•</span>
                    <span className="truncate">{currentEvent.location}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {daysLeft !== null && (
              <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm hidden sm:flex">
                J-{daysLeft}
              </Badge>
            )}
            
            {!isMobile && (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Partager
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Paramètres
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

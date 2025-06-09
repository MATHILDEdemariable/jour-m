
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Users, Calendar, Settings } from 'lucide-react';
import { useSharedEventData } from '@/hooks/useSharedEventData';
import { useNavigate } from 'react-router-dom';

export const PlanningTimeline = () => {
  const { getUpcomingPlanningItems } = useSharedEventData();
  const navigate = useNavigate();
  const upcomingItems = getUpcomingPlanningItems();

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h${mins > 0 ? mins : ''}` : `${mins}min`;
  };

  const calculateEndTime = (startTime: string, duration: number) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + duration;
    const endHours = Math.floor(totalMinutes / 60);
    const endMins = totalMinutes % 60;
    return `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg text-gray-900">
          <Calendar className="w-5 h-5 text-purple-500" />
          Prochaines Étapes
        </CardTitle>
      </CardHeader>
      <CardContent>
        {upcomingItems.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="mb-4">Aucune étape planifiée</p>
            <Button
              onClick={() => navigate('/admin')}
              variant="outline"
              className="border-purple-200 text-purple-700 hover:bg-purple-50"
            >
              <Settings className="w-4 h-4 mr-2" />
              Créer un planning dans l'Admin Portal
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingItems.map((item, index) => {
              const endTime = calculateEndTime(item.time, item.duration);
              
              return (
                <div key={item.id} className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-200">
                  {/* Timeline indicator */}
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {item.time}
                    </div>
                    {index < upcomingItems.length - 1 && (
                      <div className="w-0.5 h-12 bg-gradient-to-b from-purple-300 to-pink-300 mt-2"></div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{item.title}</h4>
                      <Badge variant="outline" className="text-xs border-purple-200 text-purple-700">
                        {item.time} - {endTime}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                    
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDuration(item.duration)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {item.assignedTo.length} personne(s)
                      </div>
                    </div>
                    
                    {item.assignedTo.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {item.assignedTo.slice(0, 3).map(person => (
                          <Badge key={person} variant="outline" className="text-xs border-gray-300 text-gray-600">
                            {person.replace('-', ' ')}
                          </Badge>
                        ))}
                        {item.assignedTo.length > 3 && (
                          <Badge variant="outline" className="text-xs border-gray-300 text-gray-600">
                            +{item.assignedTo.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

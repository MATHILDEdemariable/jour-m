
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar } from 'lucide-react';
import { useSharedEventData } from '@/hooks/useSharedEventData';

interface PersonalPlanningTimelineProps {
  userId: string;
  userRole: string;
}

export const PersonalPlanningTimeline: React.FC<PersonalPlanningTimelineProps> = ({ userId, userRole }) => {
  const { timelineItems } = useSharedEventData();

  // Filtrer les éléments de timeline assignés à l'utilisateur
  const userTimelineItems = timelineItems.filter(item => {
    if (item.assigned_person_ids && item.assigned_person_ids.length > 0) {
      return item.assigned_person_ids.includes(userId);
    }
    return item.assigned_role === userRole;
  });

  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5);
  };

  const calculateEndTime = (startTime: string, duration: number): string => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + duration;
    const endHours = Math.floor(totalMinutes / 60);
    const endMins = totalMinutes % 60;
    return `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Mon planning
        </CardTitle>
      </CardHeader>
      <CardContent>
        {userTimelineItems.length === 0 ? (
          <p className="text-muted-foreground">Aucun élément de planning assigné pour le moment.</p>
        ) : (
          <div className="space-y-3">
            {userTimelineItems.map((item) => {
              const startTime = formatTime(item.time);
              const endTime = formatTime(calculateEndTime(item.time, item.duration));
              
              return (
                <div key={item.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">{item.title}</h3>
                      {item.description && (
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {startTime} - {endTime}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{item.category}</Badge>
                    <Badge variant={item.status === 'completed' ? 'default' : 'secondary'}>
                      {item.status}
                    </Badge>
                    {item.priority === 'high' && (
                      <Badge variant="destructive">Urgent</Badge>
                    )}
                  </div>
                  
                  {item.notes && (
                    <div className="mt-2 p-2 bg-muted rounded text-sm">
                      <strong>Note:</strong> {item.notes}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

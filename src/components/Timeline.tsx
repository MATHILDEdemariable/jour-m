
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSharedEventData } from '@/hooks/useSharedEventData';

interface TimelineProps {
  viewMode: 'personal' | 'global';
  userRole: string;
}

const ROLE_LABELS = {
  bride: "Mariée",
  groom: "Marié",
  "best-man": "Témoin",
  "maid-of-honor": "Demoiselle d'honneur",
  "wedding-planner": "Wedding Planner",
  photographer: "Photographe",
  caterer: "Traiteur",
  guest: "Invité",
  family: "Famille"
};

export const Timeline: React.FC<TimelineProps> = ({ viewMode, userRole }) => {
  const { planningItems, loading } = useSharedEventData();

  const filteredItems = viewMode === 'personal' 
    ? planningItems.filter(item => item.assignedTo.includes(userRole))
    : planningItems;

  const updateItemStatus = (itemId: number, newStatus: string) => {
    // Cette fonction pourrait être étendue pour permettre des mises à jour
    console.log(`Updating item ${itemId} to status ${newStatus}`);
  };

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
          <p className="text-purple-600">Chargement du planning...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {viewMode === 'personal' ? 'Mon Planning' : 'Planning Complet'}
        </h2>
        <Badge variant="secondary" className="text-xs">
          {filteredItems.length} étapes
        </Badge>
      </div>

      <div className="space-y-3">
        {filteredItems.map((item) => {
          const isMyTask = item.assignedTo.includes(userRole);
          const endTime = calculateEndTime(item.time, item.duration);
          
          return (
            <Card 
              key={item.id} 
              className={`border-l-4 ${isMyTask ? 'border-l-purple-500 bg-purple-50' : 'border-l-gray-300'} transition-all hover:shadow-md`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-purple-600">{item.time}</span>
                    <Badge variant="outline" className="text-xs">
                      {item.time} - {endTime}
                    </Badge>
                  </div>
                  <Badge variant="outline" className="text-xs border-purple-200 text-purple-700">
                    {Math.floor(item.duration / 60)}h{item.duration % 60 > 0 ? item.duration % 60 : ''}
                  </Badge>
                </div>
                <CardTitle className="text-base">{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Assigné à:</span>
                    <div className="flex gap-1">
                      {item.assignedTo.slice(0, 3).map(role => (
                        <Badge key={role} variant="outline" className="text-xs">
                          {ROLE_LABELS[role as keyof typeof ROLE_LABELS] || role.replace('-', ' ')}
                        </Badge>
                      ))}
                      {item.assignedTo.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{item.assignedTo.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

const calculateEndTime = (startTime: string, duration: number): string => {
  const [hours, minutes] = startTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + duration;
  const endHours = Math.floor(totalMinutes / 60);
  const endMins = totalMinutes % 60;
  return `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
};


import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Download, Eye, Edit } from 'lucide-react';

export const PlanningManagement = () => {
  const [viewMode, setViewMode] = useState<'timeline' | 'calendar'>('timeline');

  const planningItems = [
    {
      id: 1,
      time: "08:00",
      duration: 120,
      title: "Préparation mariée",
      description: "Coiffure, maquillage, habillage",
      category: "Préparation",
      status: "scheduled",
      assignedTo: ["bride", "maid-of-honor"]
    },
    {
      id: 2,
      time: "10:00",
      duration: 60,
      title: "Préparation marié",
      description: "Habillage et préparatifs",
      category: "Préparation", 
      status: "scheduled",
      assignedTo: ["groom", "best-man"]
    },
    {
      id: 3,
      time: "11:30",
      duration: 90,
      title: "Décoration salle",
      description: "Installation des décorations et vérifications",
      category: "Logistique",
      status: "scheduled",
      assignedTo: ["wedding-planner", "photographer"]
    },
    {
      id: 4,
      time: "14:00",
      duration: 30,
      title: "Cérémonie civile",
      description: "Échange des vœux en mairie",
      category: "Cérémonie",
      status: "scheduled",
      assignedTo: ["bride", "groom"]
    },
    {
      id: 5,
      time: "16:00",
      duration: 60,
      title: "Séance photos",
      description: "Photos de couple et de famille",
      category: "Photos",
      status: "scheduled",
      assignedTo: ["photographer"]
    },
    {
      id: 6,
      time: "19:00",
      duration: 180,
      title: "Réception",
      description: "Cocktail, dîner et soirée dansante",
      category: "Réception",
      status: "scheduled",
      assignedTo: ["caterer", "photographer"]
    }
  ];

  const categoryColors = {
    "Préparation": "bg-blue-100 text-blue-800",
    "Logistique": "bg-purple-100 text-purple-800",
    "Cérémonie": "bg-pink-100 text-pink-800",
    "Photos": "bg-green-100 text-green-800",
    "Réception": "bg-orange-100 text-orange-800"
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h${mins > 0 ? mins : ''}` : `${mins}min`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Rétro-planning Dynamique</h2>
          <p className="text-gray-600">Visualisez et organisez le planning de votre événement</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <Button
              variant={viewMode === 'timeline' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('timeline')}
            >
              Timeline
            </Button>
            <Button
              variant={viewMode === 'calendar' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('calendar')}
            >
              Calendrier
            </Button>
          </div>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Event Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Événement: Mariage Sarah & James
          </CardTitle>
          <CardDescription>
            Samedi 15 Juin 2024 - Château de Malmaison, Paris
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">6</div>
              <div className="text-sm text-gray-600">Étapes principales</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">11h</div>
              <div className="text-sm text-gray-600">Durée totale</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">12</div>
              <div className="text-sm text-gray-600">Personnes impliquées</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline View */}
      {viewMode === 'timeline' && (
        <Card>
          <CardHeader>
            <CardTitle>Timeline du Jour J</CardTitle>
            <CardDescription>Planning détaillé heure par heure</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {planningItems.map((item, index) => (
                <div key={item.id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {item.time}
                    </div>
                    {index < planningItems.length - 1 && (
                      <div className="w-0.5 h-16 bg-gray-200 mt-2"></div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                      <div className="flex items-center gap-2">
                        <Badge className={categoryColors[item.category as keyof typeof categoryColors]}>
                          {item.category}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{item.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatDuration(item.duration)}
                      </div>
                      <div className="flex items-center gap-1">
                        <span>{item.assignedTo.length} assigné(s)</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <Card>
          <CardHeader>
            <CardTitle>Vue Calendrier</CardTitle>
            <CardDescription>Visualisation en grille horaire</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-12 gap-2">
              {/* Time labels */}
              <div className="col-span-2">
                {Array.from({ length: 12 }, (_, i) => (
                  <div key={i} className="h-16 flex items-center text-sm font-medium border-b">
                    {String(8 + i).padStart(2, '0')}:00
                  </div>
                ))}
              </div>
              
              {/* Timeline bars */}
              <div className="col-span-10 relative">
                {planningItems.map((item) => {
                  const startHour = parseInt(item.time.split(':')[0]);
                  const startMinute = parseInt(item.time.split(':')[1]);
                  const top = ((startHour - 8) * 64) + (startMinute * 64 / 60);
                  const height = (item.duration * 64) / 60;
                  
                  return (
                    <div
                      key={item.id}
                      className="absolute left-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-2 rounded text-sm"
                      style={{
                        top: `${top}px`,
                        height: `${height}px`,
                        zIndex: 1
                      }}
                    >
                      <div className="font-semibold">{item.title}</div>
                      <div className="text-xs opacity-90">{formatDuration(item.duration)}</div>
                    </div>
                  );
                })}
                
                {/* Hour grid lines */}
                {Array.from({ length: 12 }, (_, i) => (
                  <div key={i} className="h-16 border-b border-gray-200"></div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};


import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, Users, User } from 'lucide-react';

interface PublicPersonalPlanningProps {
  timelineItems: any[];
  people: any[];
  vendors: any[];
  selectedPersonId: string | null;
  onPersonSelect: (personId: string | null) => void;
}

const roleLabels = {
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

export const PublicPersonalPlanning: React.FC<PublicPersonalPlanningProps> = ({
  timelineItems,
  people,
  vendors,
  selectedPersonId,
  onPersonSelect
}) => {
  const [viewMode, setViewMode] = useState<'personal' | 'global'>('global');

  // Filtrer les items selon le mode de vue et la personne sélectionnée
  const filteredItems = timelineItems.filter(item => {
    if (viewMode === 'global') return true;
    if (!selectedPersonId) return false;
    return item.assigned_person_id === selectedPersonId || 
           (item.assigned_person_ids && item.assigned_person_ids.includes(selectedPersonId));
  });

  const formatTime = (time: string, duration: number) => {
    const [hours, minutes] = time.split(':').map(Number);
    const endMinutes = hours * 60 + minutes + duration;
    const endHours = Math.floor(endMinutes / 60);
    const endMins = endMinutes % 60;
    return `${time.substring(0, 5)} - ${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
  };

  const getPersonName = (personId: string | null) => {
    if (!personId) return null;
    const person = people.find(p => p.id === personId);
    return person ? person.name : null;
  };

  const getPersonRole = (personId: string | null) => {
    if (!personId) return null;
    const person = people.find(p => p.id === personId);
    if (!person?.role) return null;
    return roleLabels[person.role as keyof typeof roleLabels] || person.role;
  };

  const getVendorName = (vendorId: string | null) => {
    if (!vendorId) return null;
    const vendor = vendors.find(v => v.id === vendorId);
    return vendor?.name ?? null;
  };

  const allTeamMembers = [
    ...people.map(p => ({ id: p.id, name: p.name, type: 'person', role: p.role })),
    ...vendors.map(v => ({ id: v.id, name: v.name, type: 'vendor', role: v.service_type }))
  ];

  return (
    <div className="space-y-6">
      {/* Contrôles */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2 text-lg text-gray-900">
              <Calendar className="w-5 h-5 text-purple-500" />
              Planning de l'Événement
            </CardTitle>
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3">
              {/* Sélecteur de personne */}
              <div className="flex items-center gap-2">
                <Select value={selectedPersonId || 'all'} onValueChange={(value) => onPersonSelect(value === 'all' ? null : value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Voir le planning de..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toute l'équipe</SelectItem>
                    {allTeamMembers.map(member => (
                      <SelectItem key={member.id} value={member.id}>
                        <div className="flex items-center gap-2">
                          {member.type === 'person' ? (
                            <User className="w-3 h-3" />
                          ) : (
                            <span className="text-xs">🏢</span>
                          )}
                          {member.name}
                          {member.role && (
                            <span className="text-xs text-gray-500">
                              ({roleLabels[member.role as keyof typeof roleLabels] || member.role})
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Toggle vue */}
              <div className="flex items-center gap-1">
                <Button
                  variant={viewMode === 'global' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('global')}
                  className={`text-xs py-1 h-7 ${
                    viewMode === 'global' 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700' 
                      : 'border-purple-200 text-purple-700 hover:bg-purple-50'
                  }`}
                >
                  Vue Globale
                </Button>
                <Button
                  variant={viewMode === 'personal' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('personal')}
                  disabled={!selectedPersonId}
                  className={`text-xs py-1 h-7 ${
                    viewMode === 'personal' 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700' 
                      : 'border-purple-200 text-purple-700 hover:bg-purple-50'
                  }`}
                >
                  Vue Personnelle
                </Button>
                <Badge variant="secondary" className="text-xs ml-2">
                  {filteredItems.length}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-sm lg:text-base">
                {viewMode === 'personal' && selectedPersonId
                  ? 'Aucune étape assignée à cette personne'
                  : 'Aucune étape planifiée pour le moment'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredItems.map((item) => {
                const personName = getPersonName(item.assigned_person_id);
                const personRole = getPersonRole(item.assigned_person_id);
                const vendorName = item.assigned_vendor_id ? getVendorName(item.assigned_vendor_id) : null;
                const isAssignedToSelected = selectedPersonId && (
                  item.assigned_person_id === selectedPersonId ||
                  (item.assigned_person_ids && item.assigned_person_ids.includes(selectedPersonId))
                );
                
                return (
                  <div 
                    key={item.id}
                    className={`flex items-start gap-3 lg:gap-4 p-3 lg:p-4 rounded-lg border backdrop-blur-sm shadow-sm transition-all ${
                      isAssignedToSelected 
                        ? 'border-purple-300 bg-purple-50/90 ring-1 ring-purple-200' 
                        : 'border-gray-200 bg-white/90'
                    }`}
                  >
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-lg flex items-center justify-center text-white ${
                        isAssignedToSelected 
                          ? 'bg-gradient-to-br from-purple-500 to-pink-500' 
                          : 'bg-gradient-to-br from-gray-400 to-gray-500'
                      }`}>
                        <Clock className="w-3 h-3 lg:w-4 lg:h-4" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col gap-1 mb-2">
                        {/* Time */}
                        <div className="flex items-center gap-2">
                          <span className={`text-lg font-bold whitespace-nowrap ${
                            isAssignedToSelected ? 'text-purple-700' : 'text-gray-700'
                          }`}>
                            {formatTime(item.time, item.duration)}
                          </span>
                          <span className="text-xs text-gray-500">
                            ({item.duration}min)
                          </span>
                        </div>
                        
                        {/* Title */}
                        <h4 className="font-medium text-sm lg:text-base text-gray-900 break-words">
                          {item.title}
                        </h4>
                      </div>

                      {item.description && (
                        <p className="text-xs lg:text-sm text-gray-600 mb-2 break-words">
                          {item.description}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-2 lg:gap-3 text-xs text-gray-500">
                        {item.category && (
                          <span className="truncate">• {item.category}</span>
                        )}
                        {item.status && item.status !== 'scheduled' && (
                          <span className="capitalize">
                            • {item.status === 'completed' ? 'Terminé' : 
                               item.status === 'in_progress' ? 'En cours' : 
                               item.status === 'delayed' ? 'Retardé' : item.status}
                          </span>
                        )}
                        
                        {/* Assignment info */}
                        {(personName || vendorName || item.assigned_role) && (
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span className={isAssignedToSelected ? 'font-medium text-purple-600' : ''}>
                              {personName ? (
                                <>
                                  {personName}
                                  {personRole && ` (${personRole})`}
                                </>
                              ) : vendorName ? (
                                `${vendorName} (Prestataire)`
                              ) : (
                                roleLabels[item.assigned_role as keyof typeof roleLabels] || item.assigned_role
                              )}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

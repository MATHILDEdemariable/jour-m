
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Users, Filter } from 'lucide-react';
import { useLocalEventData } from '@/contexts/LocalEventDataContext';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const PlanningView = () => {
  const { currentEvent, timelineItems, people, vendors } = useLocalEventData();
  const [selectedPerson, setSelectedPerson] = useState<string>('all');

  const filteredTimelineItems = useMemo(() => {
    const eventItems = timelineItems.filter(item => 
      item.event_id === (currentEvent?.id || 'default-event')
    );

    if (selectedPerson === 'all') {
      return eventItems;
    }

    return eventItems.filter(item => 
      item.assigned_people?.includes(selectedPerson) || 
      item.assigned_vendors?.includes(selectedPerson)
    );
  }, [timelineItems, currentEvent?.id, selectedPerson]);

  const allPersons = useMemo(() => {
    const eventPeople = people.filter(p => p.event_id === (currentEvent?.id || 'default-event'));
    const eventVendors = vendors.filter(v => v.event_id === (currentEvent?.id || 'default-event'));
    
    return [
      ...eventPeople.map(p => ({ id: p.id, name: p.name, type: 'person' as const })),
      ...eventVendors.map(v => ({ id: v.id, name: v.name, type: 'vendor' as const }))
    ];
  }, [people, vendors, currentEvent?.id]);

  const getPersonName = (personId: string) => {
    const person = allPersons.find(p => p.id === personId);
    return person?.name || personId;
  };

  const getPersonType = (personId: string) => {
    const person = allPersons.find(p => p.id === personId);
    return person?.type || 'person';
  };

  const sortedItems = [...filteredTimelineItems].sort((a, b) => {
    const timeA = new Date(`1970-01-01T${a.time}`).getTime();
    const timeB = new Date(`1970-01-01T${b.time}`).getTime();
    return timeA - timeB;
  });

  return (
    <div className="space-y-6">
      {/* Header avec filtre */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Planning du Jour-J</h2>
          <p className="text-gray-600">
            {filteredTimelineItems.length} activité{filteredTimelineItems.length > 1 ? 's' : ''} prévue{filteredTimelineItems.length > 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-gray-500" />
          <Select value={selectedPerson} onValueChange={setSelectedPerson}>
            <SelectTrigger className="w-full sm:w-64">
              <SelectValue placeholder="Filtrer par personne" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les activités</SelectItem>
              {allPersons.map((person) => (
                <SelectItem key={person.id} value={person.id}>
                  {person.name} ({person.type === 'person' ? 'Équipe' : 'Prestataire'})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {sortedItems.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune activité</h3>
              <p className="text-gray-500">
                {selectedPerson === 'all' 
                  ? 'Aucune activité programmée pour le moment.'
                  : 'Aucune activité assignée à cette personne.'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          sortedItems.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {item.description}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="ml-4">
                    <Clock className="w-3 h-3 mr-1" />
                    {item.time}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {item.location && (
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {item.location}
                  </div>
                )}
                
                {(item.assigned_people?.length || item.assigned_vendors?.length) && (
                  <div className="flex flex-wrap gap-2">
                    {item.assigned_people?.map((personId) => (
                      <Badge 
                        key={personId} 
                        variant="secondary"
                        className={getPersonType(personId) === 'person' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}
                      >
                        <Users className="w-3 h-3 mr-1" />
                        {getPersonName(personId)}
                      </Badge>
                    ))}
                    {item.assigned_vendors?.map((vendorId) => (
                      <Badge 
                        key={vendorId} 
                        variant="secondary"
                        className="bg-blue-100 text-blue-800"
                      >
                        <Users className="w-3 h-3 mr-1" />
                        {getPersonName(vendorId)}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

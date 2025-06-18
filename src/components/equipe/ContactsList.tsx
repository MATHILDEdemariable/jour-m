
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Phone, Mail, Users, Building2 } from 'lucide-react';
import { useLocalEventData } from '@/contexts/LocalEventDataContext';

export const ContactsList = () => {
  const { currentEvent, people, vendors } = useLocalEventData();

  const eventPeople = people.filter(person => 
    person.event_id === (currentEvent?.id || 'default-event')
  );
  
  const eventVendors = vendors.filter(vendor => 
    vendor.event_id === (currentEvent?.id || 'default-event')
  );

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Contacts de l'équipe</h2>
        <p className="text-gray-600">
          {eventPeople.length} membre{eventPeople.length > 1 ? 's' : ''} d'équipe 
          {eventVendors.length > 0 && ` et ${eventVendors.length} prestataire${eventVendors.length > 1 ? 's' : ''}`}
        </p>
      </div>

      {/* Équipe */}
      {eventPeople.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            <h3 className="text-xl font-semibold text-gray-900">Équipe Jour-J</h3>
            <Badge variant="outline" className="bg-purple-50 text-purple-700">
              {eventPeople.length}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {eventPeople.map((person) => (
              <Card key={person.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-purple-100 text-purple-700">
                        {getInitials(person.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{person.name}</CardTitle>
                      {person.role && (
                        <p className="text-sm text-gray-600">{person.role}</p>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {person.phone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 mr-2" />
                      <a href={`tel:${person.phone}`} className="hover:text-purple-600">
                        {person.phone}
                      </a>
                    </div>
                  )}
                  {person.email && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      <a href={`mailto:${person.email}`} className="hover:text-purple-600">
                        {person.email}
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Prestataires */}
      {eventVendors.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-900">Prestataires</h3>
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              {eventVendors.length}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {eventVendors.map((vendor) => (
              <Card key={vendor.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-blue-100 text-blue-700">
                        {getInitials(vendor.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{vendor.name}</CardTitle>
                      {vendor.service_type && (
                        <p className="text-sm text-gray-600">{vendor.service_type}</p>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {vendor.phone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 mr-2" />
                      <a href={`tel:${vendor.phone}`} className="hover:text-blue-600">
                        {vendor.phone}
                      </a>
                    </div>
                  )}
                  {vendor.email && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      <a href={`mailto:${vendor.email}`} className="hover:text-blue-600">
                        {vendor.email}
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Message si aucun contact */}
      {eventPeople.length === 0 && eventVendors.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun contact</h3>
            <p className="text-gray-500">
              Les contacts de l'équipe apparaîtront ici une fois ajoutés.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

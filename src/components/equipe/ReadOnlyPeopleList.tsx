
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Phone, Mail, Users, User } from 'lucide-react';
import { useLocalEventData } from '@/contexts/LocalEventDataContext';

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

export const ReadOnlyPeopleList = () => {
  const { people } = useLocalEventData();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800">Confirmé</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      case 'declined':
        return <Badge className="bg-red-100 text-red-800">Refusé</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (people.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune personne</h3>
          <p className="text-gray-500">
            Les membres de l'équipe apparaîtront ici une fois ajoutés.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Users className="w-5 h-5 text-purple-600" />
        <h2 className="text-2xl font-bold text-gray-900">Équipe</h2>
        <Badge variant="outline" className="bg-purple-50 text-purple-700">
          {people.length} membre{people.length > 1 ? 's' : ''}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {people.map((person) => (
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
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <p className="text-sm text-gray-600">
                      {roleLabels[person.role as keyof typeof roleLabels] || person.role}
                    </p>
                    {getStatusBadge(person.status || 'pending')}
                  </div>
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
  );
};

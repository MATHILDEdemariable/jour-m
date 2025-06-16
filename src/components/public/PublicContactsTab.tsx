
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, User, Building, Mail, Phone, MapPin } from 'lucide-react';

interface PublicContactsTabProps {
  people: any[];
  vendors: any[];
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

export const PublicContactsTab: React.FC<PublicContactsTabProps> = ({ people, vendors }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'declined': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getContractStatusColor = (status: string) => {
    switch (status) {
      case 'signed': return 'bg-green-100 text-green-800 border-green-200';
      case 'quote': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'negotiation': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Équipe */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-gray-900">
            <Users className="w-5 h-5 text-purple-500" />
            Équipe
            <Badge variant="outline" className="border-purple-200 text-purple-700">
              {people.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {people.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Aucun membre d'équipe</p>
            </div>
          ) : (
            <div className="space-y-3">
              {people.map((person) => (
                <div key={person.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                      <User className="w-5 h-5" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900 truncate">{person.name}</h4>
                      {person.confirmation_status && (
                        <Badge className={`text-xs ${getStatusColor(person.confirmation_status)}`}>
                          {person.confirmation_status === 'confirmed' ? 'Confirmé' : 
                           person.confirmation_status === 'pending' ? 'En attente' : 
                           person.confirmation_status === 'declined' ? 'Décliné' : person.confirmation_status}
                        </Badge>
                      )}
                    </div>
                    
                    {person.role && (
                      <p className="text-sm text-purple-600 font-medium mb-2">
                        {roleLabels[person.role as keyof typeof roleLabels] || person.custom_role || person.role}
                      </p>
                    )}
                    
                    <div className="space-y-1 text-xs text-gray-600">
                      {person.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          <a href={`mailto:${person.email}`} className="hover:text-purple-600 transition-colors">
                            {person.email}
                          </a>
                        </div>
                      )}
                      {person.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          <a href={`tel:${person.phone}`} className="hover:text-purple-600 transition-colors">
                            {person.phone}
                          </a>
                        </div>
                      )}
                    </div>
                    
                    {person.notes && (
                      <p className="text-xs text-gray-500 mt-2 bg-white p-2 rounded border">
                        {person.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Prestataires */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-gray-900">
            <Building className="w-5 h-5 text-blue-500" />
            Prestataires
            <Badge variant="outline" className="border-blue-200 text-blue-700">
              {vendors.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {vendors.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Building className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Aucun prestataire</p>
            </div>
          ) : (
            <div className="space-y-3">
              {vendors.map((vendor) => (
                <div key={vendor.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                      <Building className="w-5 h-5" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900 truncate">{vendor.name}</h4>
                      {vendor.contract_status && (
                        <Badge className={`text-xs ${getContractStatusColor(vendor.contract_status)}`}>
                          {vendor.contract_status === 'signed' ? 'Signé' : 
                           vendor.contract_status === 'quote' ? 'Devis' : 
                           vendor.contract_status === 'negotiation' ? 'Négociation' : vendor.contract_status}
                        </Badge>
                      )}
                    </div>
                    
                    {vendor.service_type && (
                      <p className="text-sm text-blue-600 font-medium mb-2">
                        {vendor.service_type}
                      </p>
                    )}
                    
                    <div className="space-y-1 text-xs text-gray-600">
                      {vendor.contact_person && (
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {vendor.contact_person}
                        </div>
                      )}
                      {vendor.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          <a href={`mailto:${vendor.email}`} className="hover:text-blue-600 transition-colors">
                            {vendor.email}
                          </a>
                        </div>
                      )}
                      {vendor.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          <a href={`tel:${vendor.phone}`} className="hover:text-blue-600 transition-colors">
                            {vendor.phone}
                          </a>
                        </div>
                      )}
                      {vendor.address && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {vendor.address}
                        </div>
                      )}
                    </div>
                    
                    {vendor.notes && (
                      <p className="text-xs text-gray-500 mt-2 bg-white p-2 rounded border">
                        {vendor.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

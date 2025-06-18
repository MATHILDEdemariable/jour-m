
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Phone, Mail, Building2, MapPin, ExternalLink } from 'lucide-react';
import { useLocalEventData } from '@/contexts/LocalEventDataContext';

export const ReadOnlyVendorList = () => {
  const { vendors } = useLocalEventData();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getContractStatusBadge = (status: string) => {
    switch (status) {
      case 'signed':
        return <Badge className="bg-green-100 text-green-800">Signé</Badge>;
      case 'quote':
        return <Badge className="bg-blue-100 text-blue-800">Devis</Badge>;
      case 'negotiation':
        return <Badge className="bg-yellow-100 text-yellow-800">Négociation</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Refusé</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (vendors.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun prestataire</h3>
          <p className="text-gray-500">
            Les prestataires apparaîtront ici une fois ajoutés.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Building2 className="w-5 h-5 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Prestataires</h2>
        <Badge variant="outline" className="bg-blue-50 text-blue-700">
          {vendors.length} prestataire{vendors.length > 1 ? 's' : ''}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vendors.map((vendor) => (
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
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <p className="text-sm text-gray-600">{vendor.service_type}</p>
                    {getContractStatusBadge(vendor.contract_status || 'quote')}
                  </div>
                  {vendor.contact_person && (
                    <p className="text-xs text-gray-500">Contact: {vendor.contact_person}</p>
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
              {vendor.address && (
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{vendor.address}</span>
                </div>
              )}
              {vendor.website && (
                <div className="flex items-center text-sm text-gray-600">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  <a 
                    href={vendor.website.startsWith('http') ? vendor.website : `https://${vendor.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600"
                  >
                    Site web
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

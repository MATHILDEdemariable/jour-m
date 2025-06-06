
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Phone, Mail, ExternalLink } from 'lucide-react';
import { useSharedEventData } from '@/hooks/useSharedEventData';

export const VendorStatus = () => {
  const { vendors, getVendorsSummary } = useSharedEventData();
  const vendorsSummary = getVendorsSummary();

  const contractStatusColors = {
    quote: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    signed: 'bg-green-100 text-green-800 border-green-200',
    negotiation: 'bg-blue-100 text-blue-800 border-blue-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200'
  };

  const contractStatusLabels = {
    quote: 'Devis',
    signed: 'Signé',
    negotiation: 'Négociation',
    cancelled: 'Annulé'
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-lg text-gray-900">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-purple-500" />
            Prestataires
          </div>
          <Badge variant="outline" className="text-purple-700 border-purple-200">
            {vendorsSummary.confirmed}/{vendorsSummary.total} signés
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {vendors.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Building2 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Aucun prestataire enregistré</p>
          </div>
        ) : (
          <div className="space-y-3">
            {vendors.slice(0, 6).map((vendor) => (
              <div key={vendor.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{vendor.name}</h4>
                    <p className="text-sm text-gray-600">{vendor.service_type}</p>
                    {vendor.contact_person && (
                      <p className="text-xs text-gray-500">{vendor.contact_person}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge 
                    className={contractStatusColors[vendor.contract_status as keyof typeof contractStatusColors]} 
                    variant="outline"
                  >
                    {contractStatusLabels[vendor.contract_status as keyof typeof contractStatusLabels] || vendor.contract_status}
                  </Badge>
                  
                  <div className="flex gap-1">
                    {vendor.email && (
                      <div className="p-1 bg-blue-100 rounded">
                        <Mail className="w-3 h-3 text-blue-600" />
                      </div>
                    )}
                    {vendor.phone && (
                      <div className="p-1 bg-green-100 rounded">
                        <Phone className="w-3 h-3 text-green-600" />
                      </div>
                    )}
                    {vendor.website && (
                      <div className="p-1 bg-purple-100 rounded">
                        <ExternalLink className="w-3 h-3 text-purple-600" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {vendors.length > 6 && (
              <div className="text-center pt-2">
                <Badge variant="outline" className="text-gray-600 border-gray-300">
                  +{vendors.length - 6} autres prestataires
                </Badge>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

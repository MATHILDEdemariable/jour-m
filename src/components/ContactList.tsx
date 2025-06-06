import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSharedEventData } from '@/hooks/useSharedEventData';

const PRIORITY_CONFIG = {
  emergency: { color: 'bg-red-100 text-red-800', label: '🚨 Emergency' },
  important: { color: 'bg-yellow-100 text-yellow-800', label: '⚡ Important' },
  normal: { color: 'bg-gray-100 text-gray-800', label: '📞 Normal' }
};

const STATUS_CONFIG = {
  confirmed: { color: 'bg-green-100 text-green-800', icon: '🟢', label: 'Confirmé' },
  pending: { color: 'bg-yellow-100 text-yellow-800', icon: '🟡', label: 'En attente' },
  declined: { color: 'bg-red-100 text-red-800', icon: '🔴', label: 'Décliné' }
};

const CONTRACT_STATUS_CONFIG = {
  signed: { color: 'bg-green-100 text-green-800', icon: '🟢', label: 'Signé' },
  quote: { color: 'bg-yellow-100 text-yellow-800', icon: '🟡', label: 'Devis' },
  negotiation: { color: 'bg-blue-100 text-blue-800', icon: '🔵', label: 'Négociation' },
  cancelled: { color: 'bg-red-100 text-red-800', icon: '🔴', label: 'Annulé' }
};

export const ContactList: React.FC = () => {
  const { people, vendors, loading } = useSharedEventData();

  const handleCall = (phone: string) => {
    if (phone) window.open(`tel:${phone}`);
  };

  const handleMessage = (phone: string) => {
    if (phone) window.open(`sms:${phone}`);
  };

  const handleEmail = (email: string) => {
    if (email) window.open(`mailto:${email}`);
  };

  // Séparer les contacts d'urgence (wedding-planner, photographer, caterer)
  const emergencyRoles = ['wedding-planner', 'photographer', 'caterer'];
  const emergencyContacts = people.filter(person => emergencyRoles.includes(person.role));
  const otherContacts = people.filter(person => !emergencyRoles.includes(person.role));

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
          <p className="text-purple-600">Chargement des contacts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold">Contacts</h2>

      {/* Emergency Contacts */}
      {emergencyContacts.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-md font-medium text-red-600 flex items-center gap-2">
            🚨 Contacts d'urgence
          </h3>
          {emergencyContacts.map((person) => (
            <PersonContactCard 
              key={person.id} 
              person={person}
              priority="emergency"
              onCall={handleCall}
              onMessage={handleMessage}
              onEmail={handleEmail}
            />
          ))}
        </div>
      )}

      {/* Other People */}
      {otherContacts.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-md font-medium text-gray-700">Équipe</h3>
          {otherContacts.map((person) => (
            <PersonContactCard 
              key={person.id} 
              person={person}
              priority="normal"
              onCall={handleCall}
              onMessage={handleMessage}
              onEmail={handleEmail}
            />
          ))}
        </div>
      )}

      {/* Vendors */}
      {vendors.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-md font-medium text-gray-700">Prestataires</h3>
          {vendors.map((vendor) => (
            <VendorContactCard 
              key={vendor.id} 
              vendor={vendor}
              onCall={handleCall}
              onMessage={handleMessage}
              onEmail={handleEmail}
            />
          ))}
        </div>
      )}

      {people.length === 0 && vendors.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Aucun contact trouvé</p>
        </div>
      )}
    </div>
  );
};

interface PersonContactCardProps {
  person: any;
  priority: 'emergency' | 'important' | 'normal';
  onCall: (phone: string) => void;
  onMessage: (phone: string) => void;
  onEmail: (email: string) => void;
}

const PersonContactCard: React.FC<PersonContactCardProps> = ({ person, priority, onCall, onMessage, onEmail }) => {
  const priorityConfig = PRIORITY_CONFIG[priority];
  const statusConfig = STATUS_CONFIG[person.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending;

  return (
    <Card className="hover:shadow-md transition-all">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-medium text-lg">{person.name}</h3>
            <p className="text-sm text-gray-600">{person.role?.replace('-', ' ')}</p>
          </div>
          <div className="flex flex-col gap-1 items-end">
            <Badge className={priorityConfig.color} variant="secondary">
              {priorityConfig.label}
            </Badge>
            <Badge className={statusConfig.color} variant="secondary">
              {statusConfig.icon} {statusConfig.label}
            </Badge>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          {person.phone && <p className="text-sm text-gray-700">📞 {person.phone}</p>}
          {person.email && <p className="text-sm text-gray-700">✉️ {person.email}</p>}
        </div>

        <div className="flex gap-2">
          {person.phone && (
            <>
              <Button 
                size="sm" 
                onClick={() => onCall(person.phone)}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                📞 Appeler
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onMessage(person.phone)}
                className="flex-1"
              >
                💬 SMS
              </Button>
            </>
          )}
          {person.email && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onEmail(person.email)}
              className="flex-1"
            >
              ✉️ Email
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface VendorContactCardProps {
  vendor: any;
  onCall: (phone: string) => void;
  onMessage: (phone: string) => void;
  onEmail: (email: string) => void;
}

const VendorContactCard: React.FC<VendorContactCardProps> = ({ vendor, onCall, onMessage, onEmail }) => {
  const contractConfig = CONTRACT_STATUS_CONFIG[vendor.contract_status as keyof typeof CONTRACT_STATUS_CONFIG] || CONTRACT_STATUS_CONFIG.quote;

  return (
    <Card className="hover:shadow-md transition-all">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-medium text-lg">{vendor.name}</h3>
            <p className="text-sm text-gray-600">{vendor.service_type}</p>
            {vendor.contact_person && (
              <p className="text-xs text-gray-500">{vendor.contact_person}</p>
            )}
          </div>
          <Badge className={contractConfig.color} variant="secondary">
            {contractConfig.icon} {contractConfig.label}
          </Badge>
        </div>

        <div className="space-y-2 mb-4">
          {vendor.phone && <p className="text-sm text-gray-700">📞 {vendor.phone}</p>}
          {vendor.email && <p className="text-sm text-gray-700">✉️ {vendor.email}</p>}
        </div>

        <div className="flex gap-2">
          {vendor.phone && (
            <>
              <Button 
                size="sm" 
                onClick={() => onCall(vendor.phone)}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                📞 Appeler
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onMessage(vendor.phone)}
                className="flex-1"
              >
                💬 SMS
              </Button>
            </>
          )}
          {vendor.email && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onEmail(vendor.email)}
              className="flex-1"
            >
              ✉️ Email
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Contact {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  priority: 'emergency' | 'important' | 'normal';
  availability: 'available' | 'busy' | 'unknown';
}

const SAMPLE_CONTACTS: Contact[] = [
  {
    id: '1',
    name: 'Patricia Wilson',
    role: 'Wedding Planner',
    phone: '+1 555-0123',
    email: 'patricia@perfectday.com',
    priority: 'emergency',
    availability: 'available'
  },
  {
    id: '2',
    name: 'Creative Lens Studio',
    role: 'Photographer',
    phone: '+1 555-0124',
    email: 'hello@creativelens.com',
    priority: 'important',
    availability: 'busy'
  },
  {
    id: '3',
    name: 'Gourmet Catering',
    role: 'Caterer',
    phone: '+1 555-0125',
    email: 'events@gourmetcatering.com',
    priority: 'important',
    availability: 'available'
  },
  {
    id: '4',
    name: 'Bella Vista Venue',
    role: 'Venue Coordinator',
    phone: '+1 555-0126',
    email: 'coordinator@bellavista.com',
    priority: 'emergency',
    availability: 'unknown'
  },
  {
    id: '5',
    name: 'Harmony Music',
    role: 'DJ/Music',
    phone: '+1 555-0127',
    email: 'dj@harmonymusic.com',
    priority: 'normal',
    availability: 'available'
  }
];

const PRIORITY_CONFIG = {
  emergency: { color: 'bg-red-100 text-red-800', label: '🚨 Emergency' },
  important: { color: 'bg-amber-100 text-amber-800', label: '⚡ Important' },
  normal: { color: 'bg-emerald-100 text-emerald-800', label: '📞 Normal' }
};

const AVAILABILITY_CONFIG = {
  available: { color: 'bg-emerald-100 text-emerald-800', icon: '🟢', label: 'Available' },
  busy: { color: 'bg-red-100 text-red-800', icon: '🔴', label: 'Busy' },
  unknown: { color: 'bg-stone-100 text-stone-800', icon: '⚪', label: 'Unknown' }
};

export const ContactList: React.FC = () => {
  const emergencyContacts = SAMPLE_CONTACTS.filter(contact => contact.priority === 'emergency');
  const otherContacts = SAMPLE_CONTACTS.filter(contact => contact.priority !== 'emergency');

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`);
  };

  const handleMessage = (phone: string) => {
    window.open(`sms:${phone}`);
  };

  const handleEmail = (email: string) => {
    window.open(`mailto:${email}`);
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold text-stone-900">Contacts</h2>

      {/* Emergency Contacts */}
      <div className="space-y-3">
        <h3 className="text-md font-medium text-red-600 flex items-center gap-2">
          🚨 Emergency Contacts
        </h3>
        {emergencyContacts.map((contact) => (
          <ContactCard 
            key={contact.id} 
            contact={contact} 
            onCall={handleCall}
            onMessage={handleMessage}
            onEmail={handleEmail}
          />
        ))}
      </div>

      {/* Other Contacts */}
      <div className="space-y-3">
        <h3 className="text-md font-medium text-stone-700">All Vendors</h3>
        {otherContacts.map((contact) => (
          <ContactCard 
            key={contact.id} 
            contact={contact} 
            onCall={handleCall}
            onMessage={handleMessage}
            onEmail={handleEmail}
          />
        ))}
      </div>
    </div>
  );
};

interface ContactCardProps {
  contact: Contact;
  onCall: (phone: string) => void;
  onMessage: (phone: string) => void;
  onEmail: (email: string) => void;
}

const ContactCard: React.FC<ContactCardProps> = ({ contact, onCall, onMessage, onEmail }) => {
  const priorityConfig = PRIORITY_CONFIG[contact.priority];
  const availabilityConfig = AVAILABILITY_CONFIG[contact.availability];

  return (
    <Card className="hover:shadow-md transition-all bg-stone-50 border-emerald-200">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-medium text-lg text-stone-900">{contact.name}</h3>
            <p className="text-sm text-stone-600">{contact.role}</p>
          </div>
          <div className="flex flex-col gap-1 items-end">
            <Badge className={priorityConfig.color} variant="secondary">
              {priorityConfig.label}
            </Badge>
            <Badge className={availabilityConfig.color} variant="secondary">
              {availabilityConfig.icon} {availabilityConfig.label}
            </Badge>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <p className="text-sm text-stone-700">📞 {contact.phone}</p>
          <p className="text-sm text-stone-700">✉️ {contact.email}</p>
        </div>

        <div className="flex gap-2">
          <Button 
            size="sm" 
            onClick={() => onCall(contact.phone)}
            className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-stone-100"
          >
            📞 Call
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onMessage(contact.phone)}
            className="flex-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
          >
            💬 Text
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onEmail(contact.email)}
            className="flex-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
          >
            ✉️ Email
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

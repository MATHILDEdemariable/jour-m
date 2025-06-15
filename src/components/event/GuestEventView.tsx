
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSharedEventData } from '@/hooks/useSharedEventData';
import { ContactsTab } from '@/components/event/ContactsTab';
import { GuestEvent } from '@/types/event';
import { EventPortalLoading } from './EventPortalLoading';

export const GuestEventView = ({ event }: { event: GuestEvent }) => {
  const [activeTab, setActiveTab] = useState('planning');
  const { planningItems, loading: dataLoading } = useSharedEventData();

  const renderGuestTabContent = () => {
    if (dataLoading) {
      return <EventPortalLoading message="Chargement du planning..." details={null}/>;
    }
    switch (activeTab) {
      case 'planning':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Planning de l'événement</CardTitle>
            </CardHeader>
            <CardContent>
              {planningItems && planningItems.length > 0 ? (
                <ul className="space-y-4">
                  {[...planningItems].sort((a, b) => (a.time || "").localeCompare(b.time || "")).map(item => (
                    <li key={item.id} className="flex items-start gap-4">
                      <div className="font-bold text-purple-600 w-20 shrink-0 text-right">{item.time?.substring(0, 5)}</div>
                      <div className="flex-1 border-l-2 border-purple-200 pl-4">
                        <h4 className="font-semibold">{item.title}</h4>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Le planning n'est pas encore disponible.</p>
              )}
            </CardContent>
          </Card>
        );
      case 'contacts':
        return <ContactsTab userId="" userType="person" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <div className="bg-white/80 backdrop-blur-sm border-b border-purple-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-14 lg:h-16">
            <h1 className="text-base lg:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent truncate">
              {event.name}
            </h1>
            <p className="text-xs lg:text-sm text-gray-600 truncate">
              {event.event_type} • {new Date(event.event_date).toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 lg:py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="planning">📅 Planning</TabsTrigger>
            <TabsTrigger value="contacts">👥 Contacts</TabsTrigger>
          </TabsList>
          <TabsContent value="planning" className="mt-4">
            {activeTab === 'planning' && renderGuestTabContent()}
          </TabsContent>
          <TabsContent value="contacts" className="mt-4">
            {activeTab === 'contacts' && renderGuestTabContent()}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

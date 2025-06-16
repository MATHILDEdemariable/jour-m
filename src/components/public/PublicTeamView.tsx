
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, FileText, Clock, MapPin, AlertCircle } from 'lucide-react';
import { usePublicEventData } from '@/hooks/usePublicEventData';
import { PublicPersonalPlanning } from './PublicPersonalPlanning';
import { PublicContactsTab } from './PublicContactsTab';
import { PublicDocuments } from './PublicDocuments';

export const PublicTeamView = () => {
  const { eventId, shareToken } = useParams<{ eventId: string; shareToken: string }>();
  const { data, loading, error } = usePublicEventData(eventId!, shareToken!);
  const [activeTab, setActiveTab] = useState<'planning' | 'contacts' | 'documents'>('planning');
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des données de l'équipe...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Accès non autorisé</h2>
            <p className="text-gray-600 mb-4">
              {error || 'Le lien est invalide ou a expiré.'}
            </p>
            <p className="text-sm text-gray-500">
              Veuillez demander un nouveau lien à l'organisateur de l'événement.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { event, people, vendors, timelineItems, documents } = data;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const tabs = [
    { id: 'planning', label: 'Planning', icon: Calendar, count: timelineItems.length },
    { id: 'contacts', label: 'Équipe', icon: Users, count: people.length + vendors.length },
    { id: 'documents', label: 'Documents', icon: FileText, count: documents.length }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'planning':
        return (
          <PublicPersonalPlanning 
            timelineItems={timelineItems}
            people={people}
            vendors={vendors}
            selectedPersonId={selectedPersonId}
            onPersonSelect={setSelectedPersonId}
          />
        );
      case 'contacts':
        return <PublicContactsTab people={people} vendors={vendors} />;
      case 'documents':
        return (
          <PublicDocuments 
            documents={documents}
            selectedPersonId={selectedPersonId}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {event.name}
                </h1>
                <Badge variant="outline" className="border-purple-200 text-purple-700 bg-purple-50">
                  Accès Équipe
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(event.event_date)}
                </div>
                {event.start_time && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {event.start_time.substring(0, 5)}
                  </div>
                )}
                {event.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {event.location}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'default' : 'outline'}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                    : 'border-purple-200 text-purple-700 hover:bg-purple-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                <Badge variant="secondary" className="ml-1 text-xs">
                  {tab.count}
                </Badge>
              </Button>
            );
          })}
        </div>

        {/* Content */}
        <div className="space-y-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

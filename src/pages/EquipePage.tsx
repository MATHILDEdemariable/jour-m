
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, Calendar, Settings, Building2, FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLocalEventData } from '@/contexts/LocalEventDataContext';
import { PlanningView } from '@/components/equipe/PlanningView';
import { ContactsList } from '@/components/equipe/ContactsList';
import { ReadOnlyEventConfig } from '@/components/equipe/ReadOnlyEventConfig';
import { ReadOnlyPeopleList } from '@/components/equipe/ReadOnlyPeopleList';
import { ReadOnlyVendorList } from '@/components/equipe/ReadOnlyVendorList';
import { ReadOnlyDocumentsList } from '@/components/equipe/ReadOnlyDocumentsList';

const EquipePage = () => {
  const navigate = useNavigate();
  const { currentEvent } = useLocalEventData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/')}
              className="text-gray-600"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Accueil
            </Button>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {currentEvent ? currentEvent.name : 'Jour J - Équipe'}
              </h1>
              {currentEvent && (
                <p className="text-sm text-gray-600">
                  {currentEvent.event_type} • {new Date(currentEvent.event_date).toLocaleDateString('fr-FR')}
                </p>
              )}
            </div>
          </div>
          <Badge className="bg-purple-100 text-purple-800 flex items-center gap-1">
            <Users className="w-3 h-3" />
            Vue Équipe
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="config" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="config" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Configuration</span>
            </TabsTrigger>
            <TabsTrigger value="people" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Équipe</span>
            </TabsTrigger>
            <TabsTrigger value="vendors" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              <span className="hidden sm:inline">Prestataires</span>
            </TabsTrigger>
            <TabsTrigger value="planning" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Planning</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Documents</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="config" className="space-y-6">
            <ReadOnlyEventConfig />
          </TabsContent>

          <TabsContent value="people" className="space-y-6">
            <ReadOnlyPeopleList />
          </TabsContent>

          <TabsContent value="vendors" className="space-y-6">
            <ReadOnlyVendorList />
          </TabsContent>

          <TabsContent value="planning" className="space-y-6">
            <PlanningView />
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <ReadOnlyDocumentsList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EquipePage;

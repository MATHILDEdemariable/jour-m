
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, Calendar } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLocalEventData } from '@/contexts/LocalEventDataContext';
import { PlanningView } from '@/components/equipe/PlanningView';
import { ContactsList } from '@/components/equipe/ContactsList';

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
              Retour
            </Button>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {currentEvent ? currentEvent.name : 'Notre Jour J'}
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
        <Tabs defaultValue="planning" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="planning" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Planning Jour-J
            </TabsTrigger>
            <TabsTrigger value="contacts" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Contacts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="planning" className="space-y-6">
            <PlanningView />
          </TabsContent>

          <TabsContent value="contacts" className="space-y-6">
            <ContactsList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EquipePage;

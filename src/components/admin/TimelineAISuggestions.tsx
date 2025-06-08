
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Clock, Plus, Wand2 } from 'lucide-react';
import { TimelineItem } from '@/hooks/useTimelineItems';

interface TimelineAISuggestionsProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSuggestion: (suggestion: Omit<TimelineItem, 'id' | 'event_id' | 'created_at' | 'updated_at'>) => void;
}

const suggestedTimelineItems = [
  {
    title: "Préparation des mariés",
    description: "Coiffure, maquillage et habillage",
    duration: 120,
    category: "Préparation",
    priority: "high" as const,
    status: "scheduled" as const,
    time: "08:00",
    order_index: 0,
    assigned_person_id: null,
    assigned_role: "wedding-planner",
    notes: "Prévoir 2h pour être prêt à temps"
  },
  {
    title: "Photos des préparatifs",
    description: "Séance photo pendant les préparatifs",
    duration: 60,
    category: "Photos",
    priority: "medium" as const,
    status: "scheduled" as const,
    time: "09:00",
    order_index: 1,
    assigned_person_id: null,
    assigned_role: "photographer",
    notes: "Capturer les moments d'émotion"
  },
  {
    title: "Arrivée des invités",
    description: "Accueil des invités et vin d'honneur",
    duration: 30,
    category: "Logistique",
    priority: "high" as const,
    status: "scheduled" as const,
    time: "14:00",
    order_index: 2,
    assigned_person_id: null,
    assigned_role: "wedding-planner",
    notes: "Organiser l'accueil et la signature du livre d'or"
  },
  {
    title: "Cérémonie civile",
    description: "Échange des vœux et signatures",
    duration: 45,
    category: "Cérémonie",
    priority: "high" as const,
    status: "scheduled" as const,
    time: "14:30",
    order_index: 3,
    assigned_person_id: null,
    assigned_role: null,
    notes: "Moment principal de la journée"
  },
  {
    title: "Séance photo de couple",
    description: "Photos des mariés après la cérémonie",
    duration: 90,
    category: "Photos",
    priority: "medium" as const,
    status: "scheduled" as const,
    time: "15:30",
    order_index: 4,
    assigned_person_id: null,
    assigned_role: "photographer",
    notes: "Profiter de la lumière naturelle"
  },
  {
    title: "Cocktail et photos de groupe",
    description: "Vin d'honneur avec photos famille et amis",
    duration: 90,
    category: "Réception",
    priority: "medium" as const,
    status: "scheduled" as const,
    time: "17:00",
    order_index: 5,
    assigned_person_id: null,
    assigned_role: "wedding-planner",
    notes: "Organiser les groupes pour les photos"
  },
  {
    title: "Dîner de réception",
    description: "Repas principal avec animation",
    duration: 180,
    category: "Réception",
    priority: "high" as const,
    status: "scheduled" as const,
    time: "19:00",
    order_index: 6,
    assigned_person_id: null,
    assigned_role: "traiteur",
    notes: "Service en 3 temps avec discours"
  },
  {
    title: "Ouverture du bal",
    description: "Première danse des mariés",
    duration: 15,
    category: "Réception",
    priority: "medium" as const,
    status: "scheduled" as const,
    time: "22:00",
    order_index: 7,
    assigned_person_id: null,
    assigned_role: "dj",
    notes: "Moment symbolique à ne pas manquer"
  }
];

const categoryColors = {
  "Préparation": "bg-blue-100 text-blue-800 border-blue-200",
  "Logistique": "bg-purple-100 text-purple-800 border-purple-200",
  "Cérémonie": "bg-pink-100 text-pink-800 border-pink-200",
  "Photos": "bg-green-100 text-green-800 border-green-200",
  "Réception": "bg-orange-100 text-orange-800 border-orange-200"
};

export const TimelineAISuggestions: React.FC<TimelineAISuggestionsProps> = ({
  isOpen,
  onClose,
  onAddSuggestion
}) => {
  const [selectedSuggestions, setSelectedSuggestions] = useState<Set<number>>(new Set());

  const handleToggleSuggestion = (index: number) => {
    const newSelected = new Set(selectedSuggestions);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedSuggestions(newSelected);
  };

  const handleAddSelected = () => {
    selectedSuggestions.forEach(index => {
      onAddSuggestion(suggestedTimelineItems[index]);
    });
    setSelectedSuggestions(new Set());
    onClose();
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h${mins > 0 ? mins : ''}` : `${mins}min`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            Suggestions IA - Étapes du Jour J
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Wand2 className="w-4 h-4 text-purple-600" />
              <p className="text-sm font-medium text-purple-800">Planning intelligent généré par IA</p>
            </div>
            <p className="text-xs text-purple-600">
              Sélectionnez les étapes que vous souhaitez ajouter à votre planning. 
              Les horaires se calculeront automatiquement selon l'ordre.
            </p>
          </div>

          <div className="grid gap-3">
            {suggestedTimelineItems.map((item, index) => (
              <Card 
                key={index}
                className={`cursor-pointer transition-all border-2 ${
                  selectedSuggestions.has(index) 
                    ? 'border-purple-300 bg-purple-50 shadow-md' 
                    : 'border-stone-200 hover:border-purple-200 hover:shadow-sm'
                }`}
                onClick={() => handleToggleSuggestion(index)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-stone-500" />
                          <span className="font-medium text-stone-700">{item.time}</span>
                        </div>
                        <h4 className="font-semibold text-stone-800">{item.title}</h4>
                        <Badge className={categoryColors[item.category]}>
                          {item.category}
                        </Badge>
                        {item.priority === 'high' && (
                          <Badge variant="destructive" className="text-xs">
                            🔴 Urgent
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-stone-600 mb-2">{item.description}</p>
                      
                      <div className="flex items-center gap-4 text-xs text-stone-500">
                        <span>Durée: {formatDuration(item.duration)}</span>
                        {item.assigned_role && (
                          <span>Assigné à: {item.assigned_role.replace('-', ' ')}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedSuggestions.has(index)
                        ? 'border-purple-500 bg-purple-500'
                        : 'border-stone-300'
                    }`}>
                      {selectedSuggestions.has(index) && (
                        <Plus className="w-3 h-3 text-white" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <p className="text-sm text-stone-600">
              {selectedSuggestions.size} étape(s) sélectionnée(s)
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose}>
                Fermer
              </Button>
              <Button 
                onClick={handleAddSelected}
                disabled={selectedSuggestions.size === 0}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter {selectedSuggestions.size > 0 && `(${selectedSuggestions.size})`}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};


import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Plus, Clock, Users } from 'lucide-react';

interface LogisticsSuggestion {
  id: string;
  title: string;
  description: string;
  duration: number;
  category: string;
  assignedTo: string[];
  phase: string;
  priority: 'high' | 'medium' | 'low';
}

interface LogisticsAISuggestionsProps {
  onAddSuggestion: (suggestion: Omit<LogisticsSuggestion, 'id'>) => void;
}

export const LogisticsAISuggestions: React.FC<LogisticsAISuggestionsProps> = ({
  onAddSuggestion
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState<string>('all');

  const suggestions: LogisticsSuggestion[] = [
    // Phase Préparation (6h-10h)
    {
      id: 'prep-1',
      title: 'Livraison des fleurs et décoration',
      description: 'Réception et vérification des compositions florales',
      duration: 45,
      category: 'Logistique',
      assignedTo: ['florist', 'wedding-planner'],
      phase: 'preparation',
      priority: 'high'
    },
    {
      id: 'prep-2',
      title: 'Arrivée équipe coiffure/maquillage',
      description: 'Installation du matériel et préparation de l\'espace beauté',
      duration: 30,
      category: 'Préparation',
      assignedTo: ['hairdresser', 'makeup-artist'],
      phase: 'preparation',
      priority: 'high'
    },
    {
      id: 'prep-3',
      title: 'Installation matériel son/éclairage',
      description: 'Test et réglage de tous les équipements audiovisuels',
      duration: 60,
      category: 'Logistique',
      assignedTo: ['sound-engineer', 'lighting-tech'],
      phase: 'preparation',
      priority: 'medium'
    },

    // Phase Setup (10h-14h)
    {
      id: 'setup-1',
      title: 'Montage chapiteau/décoration salle',
      description: 'Installation complète de la décoration et aménagement des espaces',
      duration: 120,
      category: 'Logistique',
      assignedTo: ['decorator', 'wedding-planner'],
      phase: 'setup',
      priority: 'high'
    },
    {
      id: 'setup-2',
      title: 'Dressage des tables',
      description: 'Mise en place de la vaisselle, verres et décoration de table',
      duration: 90,
      category: 'Logistique',
      assignedTo: ['caterer', 'decorator'],
      phase: 'setup',
      priority: 'high'
    },
    {
      id: 'setup-3',
      title: 'Briefing équipes prestataires',
      description: 'Réunion de coordination avec tous les intervenants',
      duration: 30,
      category: 'Logistique',
      assignedTo: ['wedding-planner'],
      phase: 'setup',
      priority: 'medium'
    },

    // Phase Cérémonie (14h-17h)
    {
      id: 'ceremony-1',
      title: 'Accueil invités et placement',
      description: 'Gestion de l\'arrivée et orientation des invités',
      duration: 45,
      category: 'Cérémonie',
      assignedTo: ['ushers', 'wedding-planner'],
      phase: 'ceremony',
      priority: 'high'
    },
    {
      id: 'ceremony-2',
      title: 'Coordination arrivée cortège',
      description: 'Organisation et timing de l\'entrée des mariés',
      duration: 15,
      category: 'Cérémonie',
      assignedTo: ['wedding-planner', 'musician'],
      phase: 'ceremony',
      priority: 'high'
    },

    // Phase Réception (17h-23h)
    {
      id: 'reception-1',
      title: 'Transition cocktail vers dîner',
      description: 'Gestion du passage et installation des invités à table',
      duration: 30,
      category: 'Réception',
      assignedTo: ['wedding-planner', 'caterer'],
      phase: 'reception',
      priority: 'medium'
    },
    {
      id: 'reception-2',
      title: 'Coordination fin de soirée',
      description: 'Gestion des départs et nettoyage des espaces',
      duration: 60,
      category: 'Logistique',
      assignedTo: ['wedding-planner', 'cleaning-crew'],
      phase: 'reception',
      priority: 'medium'
    }
  ];

  const phases = [
    { key: 'all', label: 'Toutes les phases', color: 'bg-gray-100' },
    { key: 'preparation', label: 'Préparation (6h-10h)', color: 'bg-blue-100' },
    { key: 'setup', label: 'Setup (10h-14h)', color: 'bg-purple-100' },
    { key: 'ceremony', label: 'Cérémonie (14h-17h)', color: 'bg-pink-100' },
    { key: 'reception', label: 'Réception (17h-23h)', color: 'bg-orange-100' }
  ];

  const categoryColors = {
    "Préparation": "bg-blue-100 text-blue-800 border-blue-200",
    "Logistique": "bg-purple-100 text-purple-800 border-purple-200",
    "Cérémonie": "bg-pink-100 text-pink-800 border-pink-200",
    "Photos": "bg-green-100 text-green-800 border-green-200",
    "Réception": "bg-orange-100 text-orange-800 border-orange-200"
  };

  const priorityColors = {
    high: "bg-red-100 text-red-800 border-red-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    low: "bg-green-100 text-green-800 border-green-200"
  };

  const filteredSuggestions = selectedPhase === 'all' 
    ? suggestions 
    : suggestions.filter(s => s.phase === selectedPhase);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h${mins > 0 ? mins : ''}` : `${mins}min`;
  };

  const handleAddSuggestion = (suggestion: LogisticsSuggestion) => {
    onAddSuggestion({
      title: suggestion.title,
      description: suggestion.description,
      duration: suggestion.duration,
      category: suggestion.category,
      assignedTo: suggestion.assignedTo,
      status: 'scheduled'
    });
    
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-sage-600 to-sage-700 hover:from-sage-700 hover:to-sage-800 text-white shadow-lg">
          <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
          Suggestions IA Logistique
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-stone-800 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-sage-600" />
            Assistant IA - Suggestions Logistique Mariage
          </DialogTitle>
          <DialogDescription className="text-stone-600">
            Sélectionnez des étapes logistiques prédéfinies pour enrichir votre planning
          </DialogDescription>
        </DialogHeader>

        {/* Filtres par phase */}
        <div className="flex flex-wrap gap-2 mb-6">
          {phases.map(phase => (
            <Button
              key={phase.key}
              variant={selectedPhase === phase.key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPhase(phase.key)}
              className={selectedPhase === phase.key ? 'bg-sage-600 text-white' : 'border-stone-300 text-stone-700'}
            >
              {phase.label}
            </Button>
          ))}
        </div>

        {/* Liste des suggestions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSuggestions.map(suggestion => (
            <Card key={suggestion.id} className="border-stone-200 hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base text-stone-800">{suggestion.title}</CardTitle>
                  <Badge className={priorityColors[suggestion.priority]} variant="outline">
                    {suggestion.priority}
                  </Badge>
                </div>
                <CardDescription className="text-sm text-stone-600">
                  {suggestion.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4 text-sm text-stone-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {formatDuration(suggestion.duration)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {suggestion.assignedTo.length}
                    </div>
                  </div>
                  <Badge className={categoryColors[suggestion.category as keyof typeof categoryColors]} variant="outline">
                    {suggestion.category}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {suggestion.assignedTo.slice(0, 2).map(person => (
                      <Badge key={person} variant="outline" className="text-xs border-stone-300 text-stone-600">
                        {person.replace('-', ' ')}
                      </Badge>
                    ))}
                    {suggestion.assignedTo.length > 2 && (
                      <Badge variant="outline" className="text-xs border-stone-300 text-stone-600">
                        +{suggestion.assignedTo.length - 2}
                      </Badge>
                    )}
                  </div>
                  
                  <Button 
                    size="sm" 
                    onClick={() => handleAddSuggestion(suggestion)}
                    className="bg-sage-600 hover:bg-sage-700 text-white"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Ajouter
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSuggestions.length === 0 && (
          <div className="text-center py-8 text-stone-500">
            Aucune suggestion disponible pour cette phase
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

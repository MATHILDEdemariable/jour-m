
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Plus, Clock, Users } from 'lucide-react';
import { CreateTaskData } from '@/hooks/useTasks';

interface TaskSuggestion {
  id: string;
  title: string;
  description: string;
  duration_minutes: number;
  priority: 'high' | 'medium' | 'low';
  assigned_role: string;
  phase: string;
  category: string;
}

const TASK_SUGGESTIONS: TaskSuggestion[] = [
  // Préparatifs (3 mois avant)
  {
    id: '1',
    title: 'Réservation du lieu de réception',
    description: 'Confirmer la réservation et signer le contrat avec le lieu de réception',
    duration_minutes: 120,
    priority: 'high',
    assigned_role: 'wedding-planner',
    phase: 'Préparatifs (3 mois avant)',
    category: 'Logistique'
  },
  {
    id: '2',
    title: 'Sélection du traiteur',
    description: 'Choisir le menu et finaliser le contrat de restauration',
    duration_minutes: 90,
    priority: 'high',
    assigned_role: 'bride',
    phase: 'Préparatifs (3 mois avant)',
    category: 'Restauration'
  },
  {
    id: '3',
    title: 'Engagement du photographe',
    description: 'Sélectionner et réserver le photographe/vidéaste',
    duration_minutes: 60,
    priority: 'high',
    assigned_role: 'groom',
    phase: 'Préparatifs (3 mois avant)',
    category: 'Photographie'
  },

  // Organisation (1 mois avant)
  {
    id: '4',
    title: 'Essayage final de la robe',
    description: 'Derniers ajustements et vérifications de la robe de mariée',
    duration_minutes: 120,
    priority: 'high',
    assigned_role: 'bride',
    phase: 'Organisation (1 mois avant)',
    category: 'Préparation'
  },
  {
    id: '5',
    title: 'Confirmation du nombre d\'invités',
    description: 'Finaliser la liste des invités avec le traiteur',
    duration_minutes: 30,
    priority: 'high',
    assigned_role: 'wedding-planner',
    phase: 'Organisation (1 mois avant)',
    category: 'Logistique'
  },
  {
    id: '6',
    title: 'Préparation des centres de table',
    description: 'Finaliser la décoration florale des tables',
    duration_minutes: 180,
    priority: 'medium',
    assigned_role: 'florist',
    phase: 'Organisation (1 mois avant)',
    category: 'Décoration'
  },

  // Jour J matin
  {
    id: '7',
    title: 'Coiffure et maquillage de la mariée',
    description: 'Séance beauté complète pour la mariée',
    duration_minutes: 180,
    priority: 'high',
    assigned_role: 'bride',
    phase: 'Jour J matin',
    category: 'Préparation'
  },
  {
    id: '8',
    title: 'Installation des décorations',
    description: 'Mise en place de toute la décoration du lieu',
    duration_minutes: 120,
    priority: 'high',
    assigned_role: 'wedding-planner',
    phase: 'Jour J matin',
    category: 'Décoration'
  },
  {
    id: '9',
    title: 'Test du matériel audiovisuel',
    description: 'Vérification du son, éclairage et équipements',
    duration_minutes: 60,
    priority: 'high',
    assigned_role: 'musician',
    phase: 'Jour J matin',
    category: 'Technique'
  },

  // Cérémonie
  {
    id: '10',
    title: 'Préparation de l\'espace cérémonie',
    description: 'Mise en place des chaises, allée, autel',
    duration_minutes: 90,
    priority: 'high',
    assigned_role: 'wedding-planner',
    phase: 'Cérémonie',
    category: 'Logistique'
  },
  {
    id: '11',
    title: 'Placement des invités',
    description: 'Accueil et placement des invités selon le plan de table',
    duration_minutes: 30,
    priority: 'medium',
    assigned_role: 'best-man',
    phase: 'Cérémonie',
    category: 'Logistique'
  },

  // Réception
  {
    id: '12',
    title: 'Service du cocktail',
    description: 'Organisation du cocktail de bienvenue',
    duration_minutes: 120,
    priority: 'medium',
    assigned_role: 'caterer',
    phase: 'Réception',
    category: 'Restauration'
  },
  {
    id: '13',
    title: 'Premier service du dîner',
    description: 'Service de l\'entrée et plat principal',
    duration_minutes: 90,
    priority: 'high',
    assigned_role: 'caterer',
    phase: 'Réception',
    category: 'Restauration'
  },
  {
    id: '14',
    title: 'Animation musicale',
    description: 'Musique d\'ambiance et animation de la soirée',
    duration_minutes: 240,
    priority: 'medium',
    assigned_role: 'musician',
    phase: 'Réception',
    category: 'Animation'
  }
];

interface TaskSuggestionsProps {
  onAddTask: (taskData: CreateTaskData) => void;
}

export const TaskSuggestions: React.FC<TaskSuggestionsProps> = ({ onAddTask }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState<string>('');

  const phases = [...new Set(TASK_SUGGESTIONS.map(task => task.phase))];
  const filteredTasks = selectedPhase 
    ? TASK_SUGGESTIONS.filter(task => task.phase === selectedPhase)
    : TASK_SUGGESTIONS;

  const handleAddSuggestion = (suggestion: TaskSuggestion) => {
    const taskData: CreateTaskData = {
      title: suggestion.title,
      description: suggestion.description,
      duration_minutes: suggestion.duration_minutes,
      priority: suggestion.priority,
      assigned_role: suggestion.assigned_role,
    };
    onAddTask(taskData);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-amber-100 text-amber-800';
      case 'low': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-stone-100 text-stone-800';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return '🔴 Haute';
      case 'medium': return '🟡 Moyenne';  
      case 'low': return '🟢 Basse';
      default: return priority;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white">
          <Sparkles className="w-4 h-4 mr-2" />
          Suggestions IA
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-emerald-800 flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Suggestions de tâches intelligentes
          </DialogTitle>
          <DialogDescription>
            Sélectionnez les tâches prédéfinies à ajouter à votre planning
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Filtres par phase */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedPhase === '' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPhase('')}
              className={selectedPhase === '' ? 'bg-emerald-700 text-white' : 'border-stone-300'}
            >
              Toutes les phases
            </Button>
            {phases.map((phase) => (
              <Button
                key={phase}
                variant={selectedPhase === phase ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPhase(phase)}
                className={selectedPhase === phase ? 'bg-emerald-700 text-white' : 'border-stone-300'}
              >
                {phase}
              </Button>
            ))}
          </div>

          {/* Liste des suggestions */}
          <div className="overflow-y-auto max-h-96 space-y-3">
            {filteredTasks.map((suggestion) => (
              <Card key={suggestion.id} className="hover:shadow-md transition-shadow border-stone-200">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base text-stone-800">{suggestion.title}</CardTitle>
                      <CardDescription className="text-sm text-stone-600 mt-1">
                        {suggestion.description}
                      </CardDescription>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleAddSuggestion(suggestion)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white ml-2"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Ajouter
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-stone-600">
                      <Clock className="w-4 h-4" />
                      <span>{suggestion.duration_minutes}min</span>
                    </div>
                    <div className="flex items-center gap-1 text-stone-600">
                      <Users className="w-4 h-4" />
                      <span>{suggestion.assigned_role.replace('-', ' ')}</span>
                    </div>
                    <Badge className={getPriorityColor(suggestion.priority)}>
                      {getPriorityLabel(suggestion.priority)}
                    </Badge>
                    <Badge variant="outline" className="border-stone-300">
                      {suggestion.category}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

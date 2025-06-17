
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Plus, Clock, User, RefreshCw } from 'lucide-react';
import { useLocalTimelineSuggestions } from '@/hooks/useLocalTimelineSuggestions';

interface TimelineAISuggestionsProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSuggestion: (suggestion: any) => void;
}

export const TimelineAISuggestions: React.FC<TimelineAISuggestionsProps> = ({
  isOpen,
  onClose,
  onAddSuggestion
}) => {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const { generateSuggestions, loading } = useLocalTimelineSuggestions();

  const handleGenerateSuggestions = async () => {
    try {
      const newSuggestions = await generateSuggestions();
      setSuggestions(newSuggestions);
    } catch (error) {
      console.error('Error generating suggestions:', error);
    }
  };

  const handleAddSuggestion = (suggestion: any) => {
    onAddSuggestion(suggestion);
    onClose();
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h${mins > 0 ? mins : ''}` : `${mins}min`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      "Préparation": "bg-blue-100 text-blue-800 border-blue-200",
      "Logistique": "bg-purple-100 text-purple-800 border-purple-200",
      "Cérémonie": "bg-pink-100 text-pink-800 border-pink-200",
      "Photos": "bg-green-100 text-green-800 border-green-200",
      "Réception": "bg-orange-100 text-orange-800 border-orange-200"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="w-6 h-6 text-purple-600" />
            Suggestions d'Étapes Créatives
          </DialogTitle>
          <DialogDescription>
            Générez des suggestions d'étapes personnalisées pour enrichir votre planning
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Generate Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleGenerateSuggestions}
              disabled={loading}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Génération en cours...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Générer des Suggestions
                </>
              )}
            </Button>
          </div>

          {/* Suggestions Grid */}
          {suggestions.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2">
              {suggestions.map((suggestion, index) => (
                <Card key={index} className="border-purple-200 hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{suggestion.title}</CardTitle>
                      <div className="flex gap-2">
                        <Badge variant="outline" className={getCategoryColor(suggestion.category)}>
                          {suggestion.category}
                        </Badge>
                        <Badge variant="outline" className={getPriorityColor(suggestion.priority)}>
                          {suggestion.priority}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">{suggestion.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatDuration(suggestion.duration)}</span>
                      </div>
                      {suggestion.assigned_role && (
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{suggestion.assigned_role}</span>
                        </div>
                      )}
                    </div>

                    {suggestion.notes && (
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                        <p className="text-sm text-purple-800">
                          <strong>Note:</strong> {suggestion.notes}
                        </p>
                      </div>
                    )}

                    <Button
                      onClick={() => handleAddSuggestion(suggestion)}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Ajouter cette étape
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Empty State */}
          {suggestions.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">
              <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Cliquez sur "Générer des Suggestions" pour découvrir de nouvelles idées d'étapes créatives pour votre événement.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

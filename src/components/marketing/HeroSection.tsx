
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight,
  Sparkles,
  Heart
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEvents } from '@/hooks/useEvents';

interface HeroSectionProps {
  onAdminClick?: () => void;
  onEventClick?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const { events, currentEvent } = useEvents();

  const handleCreateEventClick = () => {
    if (isLoading) return;

    if (user) {
      // Utilisateur connecté
      if (currentEvent || events.length > 0) {
        // A déjà un événement, rediriger vers le portail
        navigate('/portal');
      } else {
        // Pas d'événement, rediriger vers la configuration
        navigate('/portal?tab=config&setup=true');
      }
    } else {
      // Utilisateur non connecté, marquer l'intention de création
      localStorage.setItem('create_event_intent', 'true');
      navigate('/auth?action=create');
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <div className="container mx-auto px-4 py-12 lg:py-20">
        <div className="text-center max-w-4xl mx-auto">
          <Badge className="mb-8 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border-purple-200">
            <Heart className="w-4 h-4 mr-1" />
            Organisez votre mariage en toute sérénité
          </Badge>
          
          <h1 className="text-5xl lg:text-7xl font-bold mb-8">
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
              Jour J
            </span>
          </h1>
          
          <p className="text-2xl lg:text-3xl text-gray-700 mb-6 font-medium">
            La plateforme tout-en-un pour votre mariage parfait
          </p>
          
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Planning intelligent, gestion des invités, coordination des prestataires et bien plus.
            Tout ce dont vous avez besoin pour organiser le plus beau jour de votre vie.
          </p>

          <Button
            onClick={handleCreateEventClick}
            disabled={isLoading}
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xl px-12 py-6 h-auto rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <Sparkles className="w-6 h-6 mr-3" />
            {isLoading ? 'Chargement...' : 
             user ? (currentEvent || events.length > 0 ? 'Accéder à mon Jour-J' : 'Configurer mon Jour-J') : 'Créer mon Jour-J'}
            <ArrowRight className="w-6 h-6 ml-3" />
          </Button>

          <p className="text-sm text-gray-500 mt-6">
            Gratuit • Aucune installation requise • Partage avec votre équipe
          </p>
        </div>
      </div>
    </div>
  );
};


import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface TimelineSuggestion {
  title: string;
  description: string;
  duration: number;
  category: string;
  priority: 'high' | 'medium' | 'low';
  assigned_role: string | null;
  notes: string;
}

// Suggestions prédéfinies pour éviter les appels OpenAI
const LOCAL_TIMELINE_SUGGESTIONS: TimelineSuggestion[] = [
  {
    title: "Mise en place de l'éclairage d'ambiance",
    description: "Installation et test de l'éclairage LED personnalisé pour créer l'atmosphère parfaite",
    duration: 45,
    category: "Préparation",
    priority: "high",
    assigned_role: "Technicien",
    notes: "Prévoir des éclairages de secours"
  },
  {
    title: "Séance photo surprise des préparatifs",
    description: "Capture des moments intimes et spontanés pendant les préparatifs",
    duration: 30,
    category: "Photos",
    priority: "medium",
    assigned_role: "Photographe",
    notes: "Photos naturelles et non posées"
  },
  {
    title: "Accueil personnalisé des invités VIP",
    description: "Réception dédiée pour les invités d'honneur avec service premium",
    duration: 60,
    category: "Réception",
    priority: "high",
    assigned_role: "Maître de cérémonie",
    notes: "Liste VIP à préparer à l'avance"
  },
  {
    title: "Animation surprise pour les enfants",
    description: "Atelier créatif ou spectacle adapté aux jeunes invités",
    duration: 90,
    category: "Réception",
    priority: "medium",
    assigned_role: "Animateur",
    notes: "Prévoir matériel adapté aux âges"
  },
  {
    title: "Installation du photobooth personnalisé",
    description: "Montage du coin photo avec accessoires thématiques et fond personnalisé",
    duration: 30,
    category: "Préparation",
    priority: "medium",
    assigned_role: "Décorateur",
    notes: "Accessoires à thème et éclairage adapté"
  },
  {
    title: "Service de conciergerie invités",
    description: "Assistance dédiée pour les besoins spéciaux des invités (mobilité, allergies, etc.)",
    duration: 120,
    category: "Logistique",
    priority: "high",
    assigned_role: "Concierge",
    notes: "Liste des besoins spéciaux à préparer"
  },
  {
    title: "Préparation des cadeaux de départ",
    description: "Emballage et personnalisation des souvenirs pour les invités",
    duration: 60,
    category: "Préparation",
    priority: "low",
    assigned_role: "Assistant",
    notes: "Un cadeau par famille/couple"
  },
  {
    title: "Test du système de sonorisation",
    description: "Vérification complète du matériel audio et des micros sans fil",
    duration: 30,
    category: "Préparation",
    priority: "high",
    assigned_role: "Technicien son",
    notes: "Prévoir matériel de secours"
  }
];

export const useLocalTimelineSuggestions = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generateSuggestions = async () => {
    setLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Return 5 random suggestions
      const shuffled = [...LOCAL_TIMELINE_SUGGESTIONS].sort(() => 0.5 - Math.random());
      const suggestions = shuffled.slice(0, 5);
      
      toast({
        title: 'Suggestions générées',
        description: `${suggestions.length} nouvelles étapes créatives ont été générées`,
      });
      
      return suggestions;
    } catch (error) {
      console.error('Error generating suggestions:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de générer les suggestions',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    generateSuggestions,
    loading
  };
};

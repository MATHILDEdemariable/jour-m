
import React from 'react';
import { Calendar, Users, Building2, FileText, Settings, GripVertical, Clock, CheckCircle, Upload, Link } from 'lucide-react';

export const TUTORIAL_CONTENT = {
  dashboard: {
    title: "📊 Tableau de Bord - Vue d'ensemble",
    description: "Suivez l'avancement global de votre événement et identifiez les points d'attention.",
    steps: [
      {
        icon: <CheckCircle className="w-5 h-5" />,
        title: "Progression générale",
        description: "Visualisez le pourcentage d'avancement des tâches, timeline et prestataires. Les barres de progression vous donnent un aperçu rapide."
      },
      {
        icon: <Clock className="w-5 h-5" />,
        title: "Alertes critiques",
        description: "Les tâches en retard et étapes critiques apparaissent en rouge. Traitez-les en priorité pour éviter les blocages."
      },
      {
        icon: <Calendar className="w-5 h-5" />,
        title: "Activité récente",
        description: "Suivez les dernières modifications de votre équipe pour rester synchronisé sur l'avancement."
      }
    ]
  },
  planning: {
    title: "⏰ Planning & Timeline - Organisation Jour J",
    description: "Créez et gérez le planning détaillé de votre événement avec drag & drop et calculs automatiques.",
    steps: [
      {
        icon: <GripVertical className="w-5 h-5" />,
        title: "Drag & Drop intelligent",
        description: "Glissez-déposez les éléments pour réorganiser. Les horaires se recalculent automatiquement en fonction des durées."
      },
      {
        icon: <Users className="w-5 h-5" />,
        title: "Assignation d'équipe",
        description: "Assignez chaque étape à des personnes spécifiques. Elles verront leur planning personnalisé dans l'interface publique."
      },
      {
        icon: <Clock className="w-5 h-5" />,
        title: "Gestion des durées",
        description: "Définissez la durée de chaque étape. Le système calcule automatiquement les heures de fin et détecte les conflits."
      },
      {
        icon: <CheckCircle className="w-5 h-5" />,
        title: "Suivi en temps réel",
        description: "Marquez les étapes comme terminées le jour J. L'équipe voit l'avancement en direct."
      }
    ]
  },
  people: {
    title: "👥 Gestion d'Équipe - Personnes & Rôles",
    description: "Gérez votre équipe, définissez les rôles et suivez les confirmations de présence.",
    steps: [
      {
        icon: <Users className="w-5 h-5" />,
        title: "Ajout de personnes",
        description: "Créez des profils pour chaque membre de l'équipe avec nom, rôle, contact et notes spéciales."
      },
      {
        icon: <CheckCircle className="w-5 h-5" />,
        title: "Statuts de confirmation",
        description: "Suivez qui a confirmé sa présence (Confirmé/En attente/Décliné). Relancez les personnes en attente."
      },
      {
        icon: <FileText className="w-5 h-5" />,
        title: "Informations détaillées",
        description: "Ajoutez des notes sur la disponibilité, régimes alimentaires ou besoins spéciaux pour chaque personne."
      },
      {
        icon: <Link className="w-5 h-5" />,
        title: "Accès personnalisé",
        description: "Chaque personne peut accéder à son planning personnalisé via l'interface publique de l'événement."
      }
    ]
  },
  vendors: {
    title: "🏢 Prestataires - Suivi Contrats & Services",
    description: "Gérez vos prestataires, suivez les devis et contrats, organisez les documents.",
    steps: [
      {
        icon: <Building2 className="w-5 h-5" />,
        title: "Fiche prestataire complète",
        description: "Enregistrez toutes les infos : contact, service, prix, dates de livraison, notes internes."
      },
      {
        icon: <CheckCircle className="w-5 h-5" />,
        title: "Workflow des contrats",
        description: "Suivez l'évolution : Devis → Confirmé → En cours → Terminé. Visualisez rapidement les statuts."
      },
      {
        icon: <FileText className="w-5 h-5" />,
        title: "Documents intégrés",
        description: "Attachez devis, contrats et factures directement sur la fiche prestataire pour un suivi centralisé."
      },
      {
        icon: <Calendar className="w-5 h-5" />,
        title: "Planning livraisons",
        description: "Coordonnez les dates et heures de livraison/installation avec votre timeline principale."
      }
    ]
  },
  documents: {
    title: "📁 Documents - Stockage & Partage",
    description: "Centralisez vos documents, connectez Google Drive et gérez les accès équipe.",
    steps: [
      {
        icon: <Upload className="w-5 h-5" />,
        title: "Upload direct",
        description: "Glissez-déposez vos fichiers directement dans la plateforme. Ils seront accessibles à votre équipe instantanément."
      },
      {
        icon: <Link className="w-5 h-5" />,
        title: "Google Drive externe",
        description: "Connectez un dossier Google Drive pour partager le lien avec l'équipe sans dupliquer les fichiers."
      },
      {
        icon: <Users className="w-5 h-5" />,
        title: "Assignation de documents",
        description: "Assignez des documents spécifiques à des personnes. Elles les verront dans leur interface personnelle."
      },
      {
        icon: <CheckCircle className="w-5 h-5" />,
        title: "Accès unifié",
        description: "L'équipe accède aux documents via l'interface publique, avec filtrage automatique selon les assignations."
      }
    ]
  },
  config: {
    title: "⚙️ Configuration - Paramètres Événement",
    description: "Configurez les paramètres généraux de votre événement et personnalisez l'expérience.",
    steps: [
      {
        icon: <Settings className="w-5 h-5" />,
        title: "Informations générales",
        description: "Modifiez le nom, type, date et lieu de l'événement. Ces infos apparaissent partout dans l'interface."
      },
      {
        icon: <Users className="w-5 h-5" />,
        title: "Accès équipe",
        description: "Configurez les permissions et l'accès pour votre équipe à l'interface publique de l'événement."
      },
      {
        icon: <FileText className="w-5 h-5" />,
        title: "Paramètres avancés",
        description: "Personnalisez les notifications, sauvegarde automatique et autres options selon vos besoins."
      }
    ]
  }
};


import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Users, 
  CheckSquare, 
  FileText, 
  Shield, 
  UserCheck,
  ArrowRight,
  Sparkles,
  Key
} from 'lucide-react';

interface HeroSectionProps {
  onAdminClick: () => void;
  onEventClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onAdminClick,
  onEventClick
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="flex-1 min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      {/* Hero Content */}
      <div className="container mx-auto px-4 py-12 lg:py-20">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <Badge className="mb-6 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border-purple-200">
            <Sparkles className="w-4 h-4 mr-1" />
            Organisez votre événement en toute sérénité
          </Badge>
          
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
              Jour J
            </span>
          </h1>
          
          <p className="text-xl lg:text-2xl text-gray-600 mb-8 leading-relaxed">
            La plateforme tout-en-un pour orchestrer parfaitement votre événement.
            <br />
            <span className="text-lg text-gray-500 mt-2 block">
              Planning, tâches, contacts et documents centralisés en un seul endroit.
            </span>
          </p>

          {/* Main CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              onClick={onAdminClick}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg px-8 py-4 h-auto"
            >
              <Shield className="w-5 h-5 mr-2" />
              Accéder au Portail
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <Button
              onClick={onEventClick}
              size="lg"
              variant="outline"
              className="border-2 border-purple-200 text-purple-700 hover:bg-purple-50 text-lg px-8 py-4 h-auto"
            >
              <Key className="w-5 h-5 mr-2" />
              Rejoindre une Équipe
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="text-center pb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-lg">Planning Intelligent</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription>
                Timeline détaillée avec assignation automatique et gestion des conflits
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="text-center pb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckSquare className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-lg">Gestion des Tâches</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription>
                Suivi en temps réel avec priorisation et délégation intelligente
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="text-center pb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-lg">Équipe Connectée</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription>
                Coordination parfaite entre équipe personnelle et prestataires
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="text-center pb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-lg">Documents Centralisés</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription>
                Tous vos contrats, photos et documents accessibles instantanément
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-16 max-w-2xl mx-auto">
          <p className="text-gray-600 mb-4">
            <strong>Portal unifié :</strong> Interface adaptée automatiquement selon votre rôle et permissions
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="outline" className="bg-white/50">👑 Admin complet</Badge>
            <Badge variant="outline" className="bg-white/50">👥 Vue équipe</Badge>
            <Badge variant="outline" className="bg-white/50">🏢 Espace prestataires</Badge>
            <Badge variant="outline" className="bg-white/50">🔗 Liens personnalisés</Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

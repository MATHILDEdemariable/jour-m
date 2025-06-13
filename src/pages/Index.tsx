
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Users, 
  CheckCircle, 
  Star, 
  Crown, 
  ArrowRight,
  Sparkles,
  UserCheck,
  Settings
} from 'lucide-react';

export const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Calendar,
      title: 'Planning intelligent',
      description: 'Organisez votre événement avec notre timeline interactive et nos suggestions IA'
    },
    {
      icon: Users,
      title: 'Gestion des invités',
      description: 'Suivez les confirmations, gérez les rôles et les informations de contact'
    },
    {
      icon: CheckCircle,
      title: 'Suivi des tâches',
      description: 'Ne manquez aucune étape avec notre système de tâches et rappels'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Calendar className="w-8 h-8 text-purple-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Jour J
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate('/auth')}>
                Connexion
              </Button>
              <Button onClick={() => navigate('/auth')} className="bg-gradient-to-r from-purple-600 to-pink-600">
                Commencer
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 to-pink-50 pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Organisez vos événements{' '}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                parfaitement
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              La plateforme tout-en-un pour planifier, organiser et gérer vos événements avec une précision d'expert.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate('/auth')} className="bg-gradient-to-r from-purple-600 to-pink-600 text-lg px-8">
                Essayez gratuitement
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8" onClick={() => navigate('/demo')}>
                Voir la démo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tout ce dont vous avez besoin pour réussir
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Des outils puissants et intuitifs pour transformer votre vision en réalité
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 mx-auto bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Access Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Accès simplifié pour votre équipe
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Vos invités et prestataires accèdent facilement à leurs informations personnalisées, 
              sans inscription ni compte requis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* For Event Organizers */}
            <Card className="text-center hover:shadow-lg transition-shadow border-2 border-purple-200">
              <CardHeader>
                <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mb-4">
                  <Settings className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Organisateurs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Créez votre compte, configurez votre événement et gérez tous les aspects de votre organisation.
                </p>
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Portail d'administration complet</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Gestion des tâches et timeline</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Coordination équipe & prestataires</span>
                  </div>
                </div>
                <Button 
                  onClick={() => navigate('/auth')}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-lg"
                >
                  Créer mon événement
                </Button>
              </CardContent>
            </Card>

            {/* For Team Members */}
            <Card className="text-center hover:shadow-lg transition-shadow border-2 border-blue-200">
              <CardHeader>
                <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center mb-4">
                  <UserCheck className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Équipe & Invités</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Accédez directement à votre planning et vos tâches personnalisées, sans créer de compte.
                </p>
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Accès sans inscription</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Planning personnalisé</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Communication directe</span>
                  </div>
                </div>
                <Button 
                  onClick={() => navigate('/equipe')}
                  variant="outline"
                  className="w-full border-blue-300 text-blue-700 hover:bg-blue-50 text-lg"
                >
                  <UserCheck className="w-5 h-5 mr-2" />
                  Rejoindre un événement
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Card className="bg-white/80 backdrop-blur-sm max-w-2xl mx-auto">
              <CardContent className="p-8">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Users className="w-6 h-6 text-purple-600" />
                  <h3 className="text-xl font-semibold">Comment ça marche ?</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  L'organisateur vous donne simplement l'ID de l'événement. 
                  Vous sélectionnez votre nom dans la liste et accédez immédiatement 
                  à votre espace personnalisé.
                </p>
                <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                  Simple • Rapide • Sécurisé
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Prêt à organiser votre prochain événement ?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Rejoignez des milliers d'organisateurs qui font confiance à Jour J
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/auth')} className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8">
              <Sparkles className="w-5 h-5 mr-2" />
              Commencer maintenant
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/equipe')} className="border-white text-white hover:bg-white/10 text-lg px-8">
              <UserCheck className="w-5 h-5 mr-2" />
              Rejoindre un événement
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Calendar className="w-6 h-6 text-purple-400" />
              <span className="text-xl font-bold">Jour J</span>
            </div>
            <p className="text-gray-400">
              © 2025 Jour J. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

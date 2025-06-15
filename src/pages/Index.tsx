
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Calendar, 
  ArrowRight,
  Settings,
  UserCheck
} from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

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
              L'organisation d'événements,{' '}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                simplifiée
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Une plateforme unique pour créer votre événement et collaborer avec votre équipe. Simple, direct et efficace.
            </p>
            <div className="flex justify-center">
              <Button size="lg" onClick={() => navigate('/auth')} className="bg-gradient-to-r from-purple-600 to-pink-600 text-lg px-8">
                Commencer l'organisation
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Simplified Dual-Path Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Deux façons d'utiliser Jour J
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Que vous soyez l'organisateur ou un membre de l'équipe, l'accès est simple et direct.
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
                  Accédez directement à votre planning via un lien unique partagé par l'organisateur.
                </p>
                <div className="mt-4 p-4 bg-blue-50 rounded-md border border-blue-200">
                  <h4 className="font-semibold text-blue-800">Aucune inscription requise</h4>
                  <p className="text-sm text-blue-700">Utilisez simplement le lien fourni pour un accès instantané et sécurisé.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Prêt à lancer votre événement ?
          </h2>
          <Button size="lg" onClick={() => navigate('/auth')} className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8">
            Créer mon compte et mon événement
          </Button>
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

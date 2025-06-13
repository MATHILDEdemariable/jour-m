
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Users, ArrowLeft, Play, UserCheck } from 'lucide-react';

export const Demo = () => {
  const navigate = useNavigate();
  
  // ID d'un événement de démo par défaut
  const DEMO_EVENT_ID = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

  const handleAdminPortal = () => {
    navigate(`/admin/${DEMO_EVENT_ID}`);
  };

  const handleEventPortal = () => {
    navigate(`/event/${DEMO_EVENT_ID}`);
  };

  const handleTeamAccess = () => {
    navigate(`/equipe?event=${DEMO_EVENT_ID}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button variant="ghost" onClick={() => navigate('/')} className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Jour J - Mode Démo
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Découvrez les portails de gestion d'événement
          </h2>
          <p className="text-lg text-gray-600">
            Explorez les fonctionnalités sans créer de compte
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Portail Admin */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Settings className="w-8 h-8 text-purple-600" />
              </div>
              <CardTitle className="text-xl">Portail Administrateur</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">
                Gérez tous les aspects de votre événement : tâches, timeline, équipe, prestataires et documents.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Gestion des tâches et timeline</li>
                <li>• Organisation de l'équipe</li>
                <li>• Suivi des prestataires</li>
                <li>• Gestion documentaire</li>
              </ul>
              <Button 
                onClick={handleAdminPortal}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
              >
                <Play className="w-4 h-4 mr-2" />
                Portail Admin
              </Button>
            </CardContent>
          </Card>

          {/* Accès Équipe */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <UserCheck className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Accès Équipe</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">
                Interface simplifiée pour que les invités et prestataires accèdent facilement à leurs informations.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Accès sans inscription</li>
                <li>• Sélection simple</li>
                <li>• Planning personnel</li>
                <li>• Contact de l'équipe</li>
              </ul>
              <Button 
                onClick={handleTeamAccess}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600"
              >
                <UserCheck className="w-4 h-4 mr-2" />
                Accès Équipe
              </Button>
            </CardContent>
          </Card>

          {/* Portail Événement */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-xl">Portail Direct</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">
                Accès direct au portail participant (pour test ou lien direct).
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Accès immédiat</li>
                <li>• Vue complète</li>
                <li>• Toutes fonctionnalités</li>
                <li>• Mode test</li>
              </ul>
              <Button 
                onClick={handleEventPortal}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600"
              >
                <Play className="w-4 h-4 mr-2" />
                Portail Direct
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-gray-50 to-gray-100">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-2">Mode démo</h3>
              <p className="text-gray-600 mb-4">
                Ces portails utilisent des données de démonstration. Pour créer votre propre événement, 
                inscrivez-vous et accédez au tableau de bord principal.
              </p>
              <Button 
                variant="outline" 
                onClick={() => navigate('/auth')}
                className="mr-4"
              >
                S'inscrire
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/dashboard')}
              >
                Tableau de bord
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Demo;

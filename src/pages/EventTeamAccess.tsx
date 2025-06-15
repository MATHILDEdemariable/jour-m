
import React from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const EventTeamAccess = () => {
  const { eventSlug } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
         <div className="mb-4">
            <Button variant="ghost" asChild>
                <RouterLink to="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Retour à l'accueil
                </RouterLink>
            </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Accès Équipe</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">Vous êtes sur le point d'accéder au portail de l'événement :</p>
            <p className="font-bold text-lg text-purple-600 mb-6">{eventSlug}</p>
            <p className="text-gray-600">Cette section est en cours de développement pour vous donner accès au planning et aux informations clés.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EventTeamAccess;

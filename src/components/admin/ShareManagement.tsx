
import React, { useState, useEffect } from 'react';
import { useEventData } from '@/contexts/EventDataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Copy, Share2, RefreshCw, Users, Eye } from 'lucide-react';
import { QRCodeCanvas as QRCode } from 'qrcode.react';
import { useToast } from '@/components/ui/use-toast';
import { useShareToken } from '@/hooks/useShareToken';

export const ShareManagement = () => {
  const { currentEvent } = useEventData();
  const [guestShareLink, setGuestShareLink] = useState('');
  const [teamShareLink, setTeamShareLink] = useState('');
  const { toast } = useToast();
  const { regenerateShareToken, regenerating } = useShareToken();

  useEffect(() => {
    if (currentEvent?.slug) {
      // Lien existant pour l'accès invité V2
      const guestLink = `${window.location.origin}/guest-dashboard?event_slug=${currentEvent.slug}`;
      setGuestShareLink(guestLink);
      
      // Nouveau lien pour l'accès équipe public
      if (currentEvent.share_token) {
        const teamLink = `${window.location.origin}/team/${currentEvent.id}/${currentEvent.share_token}`;
        setTeamShareLink(teamLink);
      }
    }
  }, [currentEvent]);

  const handleCopy = (link: string, type: string) => {
    if (!link) return;
    navigator.clipboard.writeText(link);
    toast({
      title: 'Copié !',
      description: `Le lien ${type} a été copié dans le presse-papiers.`,
    });
  };

  const handleRegenerateToken = async () => {
    if (!currentEvent?.id) return;
    
    const newToken = await regenerateShareToken(currentEvent.id);
    if (newToken) {
      const newTeamLink = `${window.location.origin}/team/${currentEvent.id}/${newToken}`;
      setTeamShareLink(newTeamLink);
    }
  };

  const handlePreview = (link: string) => {
    window.open(link, '_blank');
  };

  if (!currentEvent) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Partage</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Veuillez d'abord sélectionner un événement.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Accès Invité (existant) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="w-6 h-6 text-purple-600" />
            Partager l'accès invité
          </CardTitle>
          <CardDescription>
            Envoyez ce lien à vos invités pour qu'ils puissent accéder rapidement à leur planning sans compte.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="guest-share-link" className="text-sm font-medium">Lien de partage invité</label>
            <div className="flex gap-2 mt-1">
              <Input id="guest-share-link" type="text" value={guestShareLink} readOnly />
              <Button variant="outline" size="icon" onClick={() => handleCopy(guestShareLink, 'invité')} disabled={!guestShareLink}>
                <Copy className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => handlePreview(guestShareLink)} disabled={!guestShareLink}>
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium">Instructions invités</h3>
            <p className="text-sm text-muted-foreground mt-1">
              1. Cliquez sur le lien et sélectionnez votre équipe.<br />
              2. Choisissez votre nom ou prestataire pour accéder à votre planning personnalisé du jour J.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Nouveau: Accès Équipe Public */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            Accès Équipe Public
          </CardTitle>
          <CardDescription>
            Lien sécurisé pour que votre équipe accède directement aux informations sans authentification.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="team-share-link" className="text-sm font-medium">Lien de partage équipe</label>
            <div className="flex gap-2 mt-1">
              <Input id="team-share-link" type="text" value={teamShareLink} readOnly />
              <Button variant="outline" size="icon" onClick={() => handleCopy(teamShareLink, 'équipe')} disabled={!teamShareLink}>
                <Copy className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => handlePreview(teamShareLink)} disabled={!teamShareLink}>
                <Eye className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleRegenerateToken}
                disabled={regenerating || !currentEvent?.id}
                title="Régénérer le token (invalide l'ancien lien)"
              >
                <RefreshCw className={`w-4 h-4 ${regenerating ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium">Instructions équipe</h3>
            <p className="text-sm text-muted-foreground mt-1">
              • Accès direct sans connexion requise<br />
              • Vue en lecture seule du planning, contacts et documents<br />
              • Possibilité de filtrer par personne pour voir ses assignations<br />
              • Interface optimisée mobile et desktop
            </p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-sm text-amber-800">
              <strong>Sécurité:</strong> Ce lien contient un token unique. En cas de compromission, 
              utilisez le bouton de régénération pour invalider l'ancien lien.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* QR Codes */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="flex flex-col items-center justify-center p-6">
          <h3 className="text-lg font-semibold mb-4">QR Code - Accès Invité</h3>
          <div className="bg-white p-4 rounded-lg shadow-md">
            {guestShareLink ? (
              <QRCode value={guestShareLink} size={192} />
            ) : (
              <div className="w-48 h-48 bg-gray-200 animate-pulse rounded-lg" />
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-4 text-center">
            Scannez pour accéder à la sélection d'équipe
          </p>
        </Card>

        <Card className="flex flex-col items-center justify-center p-6">
          <h3 className="text-lg font-semibold mb-4">QR Code - Accès Équipe</h3>
          <div className="bg-white p-4 rounded-lg shadow-md">
            {teamShareLink ? (
              <QRCode value={teamShareLink} size={192} />
            ) : (
              <div className="w-48 h-48 bg-gray-200 animate-pulse rounded-lg" />
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-4 text-center">
            Scannez pour accéder directement aux informations équipe
          </p>
        </Card>
      </div>
    </div>
  );
};

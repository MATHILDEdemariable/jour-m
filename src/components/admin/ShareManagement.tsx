
import React, { useState, useEffect } from 'react';
import { useEventData } from '@/contexts/EventDataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Copy, Users, RefreshCw, Eye } from 'lucide-react';
import { QRCodeCanvas as QRCode } from 'qrcode.react';
import { useToast } from '@/components/ui/use-toast';
import { useShareToken } from '@/hooks/useShareToken';

export const ShareManagement = () => {
  const { currentEvent } = useEventData();
  const [teamShareLink, setTeamShareLink] = useState('');
  const { toast } = useToast();
  const { regenerateShareToken, regenerating } = useShareToken();

  useEffect(() => {
    if (currentEvent?.id && currentEvent?.share_token) {
      const teamLink = `${window.location.origin}/team/${currentEvent.id}/${currentEvent.share_token}`;
      setTeamShareLink(teamLink);
    }
  }, [currentEvent]);

  const handleCopy = (link: string) => {
    if (!link) return;
    navigator.clipboard.writeText(link);
    toast({
      title: 'Copié !',
      description: 'Le lien équipe a été copié dans le presse-papiers.',
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
          <CardTitle>Partage Équipe</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Veuillez d'abord sélectionner un événement.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Accès Équipe Public Unifié */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-600" />
            Partage Équipe
          </CardTitle>
          <CardDescription>
            Partagez ce lien sécurisé avec votre équipe pour qu'ils accèdent directement à leur planning personnalisé sans authentification.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="team-share-link" className="text-sm font-medium">Lien d'accès équipe</label>
            <div className="flex gap-2 mt-1">
              <Input id="team-share-link" type="text" value={teamShareLink} readOnly />
              <Button variant="outline" size="icon" onClick={() => handleCopy(teamShareLink)} disabled={!teamShareLink}>
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

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium mb-2">Mode d'emploi</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Partagez ce lien avec votre équipe</li>
                <li>• Chaque membre sélectionne son profil</li>
                <li>• Accès à son planning personnalisé</li>
                <li>• Vue des contacts et documents</li>
                <li>• Synchronisation en temps réel</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Fonctionnalités</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Accès sans mot de passe requis</li>
                <li>• Interface mobile et desktop</li>
                <li>• Mode lecture seule sécurisé</li>
                <li>• Données synchronisées avec l'admin</li>
                <li>• Token révocable à tout moment</li>
              </ul>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-sm text-amber-800">
              <strong>Sécurité:</strong> Ce lien contient un token unique. En cas de compromission, 
              utilisez le bouton de régénération pour invalider l'ancien lien et créer un nouveau token.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* QR Code Unifié */}
      <Card className="flex flex-col items-center justify-center p-6">
        <h3 className="text-lg font-semibold mb-4">QR Code - Accès Équipe</h3>
        <div className="bg-white p-4 rounded-lg shadow-md">
          {teamShareLink ? (
            <QRCode value={teamShareLink} size={192} />
          ) : (
            <div className="w-48 h-48 bg-gray-200 animate-pulse rounded-lg" />
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-4 text-center max-w-md">
          Scannez ce QR code avec votre téléphone pour accéder directement à la sélection d'équipe et votre planning personnalisé
        </p>
        <div className="mt-3 text-xs text-gray-500 text-center">
          Compatible avec tous les lecteurs QR code standards
        </div>
      </Card>
    </div>
  );
};

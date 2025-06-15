import React, { useState, useEffect } from 'react';
import { useEventData } from '@/contexts/EventDataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Copy, Share2 } from 'lucide-react';
import { QRCodeCanvas as QRCode } from 'qrcode.react';
import { useToast } from '@/components/ui/use-toast';

export const ShareManagement = () => {
  const { currentEvent } = useEventData();
  const [shareLink, setShareLink] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (currentEvent?.slug) {
      // Nouvelle url vers accès invité V2 :
      const link = `${window.location.origin}/guest-dashboard?event_slug=${currentEvent.slug}`;
      setShareLink(link);
    }
  }, [currentEvent]);

  const handleCopy = () => {
    if (!shareLink) return;
    navigator.clipboard.writeText(shareLink);
    toast({
      title: 'Copié !',
      description: 'Le lien de partage a été copié dans le presse-papiers.',
    });
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
    <div className="grid gap-6 md:grid-cols-2">
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
            <label htmlFor="share-link" className="text-sm font-medium">Lien de partage invité</label>
            <div className="flex gap-2 mt-1">
              <Input id="share-link" type="text" value={shareLink} readOnly />
              <Button variant="outline" size="icon" onClick={handleCopy} disabled={!shareLink}>
                <Copy className="w-4 h-4" />
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
      <Card className="flex flex-col items-center justify-center p-6">
        <h3 className="text-lg font-semibold mb-4">QR Code d'accès</h3>
        <div className="bg-white p-4 rounded-lg shadow-md">
          {shareLink ? (
            <QRCode value={shareLink} size={192} />
          ) : (
            <div className="w-48 h-48 bg-gray-200 animate-pulse rounded-lg" />
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-4 text-center">
          Scannez ce code avec un téléphone pour accéder directement à la sélection d'accès Jour J.
        </p>
      </Card>
    </div>
  );
};

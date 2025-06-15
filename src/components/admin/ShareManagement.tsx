
import React, { useState, useEffect } from 'react';
import { useEventData } from '@/contexts/EventDataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Copy, Share2 } from 'lucide-react';
import QRCode from 'qrcode.react';
import { useToast } from '@/components/ui/use-toast';

export const ShareManagement = () => {
  const { currentEvent } = useEventData();
  const [shareLink, setShareLink] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (currentEvent?.slug) {
      const link = `${window.location.origin}/?event=${currentEvent.slug}&invite=true`;
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
            Partager l'accès à l'événement
          </CardTitle>
          <CardDescription>
            Partagez ce lien avec votre équipe, vos prestataires ou vos invités pour leur donner accès au portail de l'événement.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="share-link" className="text-sm font-medium">Lien de partage unique</label>
            <div className="flex gap-2 mt-1">
              <Input id="share-link" type="text" value={shareLink} readOnly />
              <Button variant="outline" size="icon" onClick={handleCopy} disabled={!shareLink}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium">Instructions pour vos invités</h3>
            <p className="text-sm text-muted-foreground mt-1">
              1. Cliquez sur le lien ou scannez le QR code.
              <br />
              2. Sur la page d'accès, entrez votre nom.
              <br />
              3. Vous aurez alors accès aux informations de l'événement qui vous concernent.
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
          Scannez ce code avec un téléphone pour accéder directement au portail de l'événement.
        </p>
      </Card>
    </div>
  );
};

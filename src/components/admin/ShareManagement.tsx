
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { 
  Copy, 
  QrCode, 
  Users, 
  Eye
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const ShareManagement = () => {
  const { toast } = useToast();

  const equipeUrl = `${window.location.origin}/equipe`;

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: 'Lien copié',
        description: `${label} a été copié dans le presse-papiers.`,
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de copier le lien.',
        variant: 'destructive',
      });
    }
  };

  const openPreview = () => {
    window.open(equipeUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Partage Équipe</h2>
        <p className="text-gray-600">
          Partagez toutes les informations de votre événement avec votre équipe via un lien simple.
        </p>
      </div>

      {/* Page équipe */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            Page Équipe Complète
          </CardTitle>
          <CardDescription>
            Vue miroir de l'admin avec tous les onglets : Configuration, Équipe, Prestataires, Planning et Documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* URL */}
            <div className="flex items-center gap-2">
              <Input value={equipeUrl} readOnly className="flex-1" />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(equipeUrl, 'Le lien équipe')}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={openPreview}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Voir aperçu équipe
              </Button>

              <Button
                onClick={() => copyToClipboard(equipeUrl, 'Le lien équipe')}
                variant="outline"
                className="border-purple-200 text-purple-700 hover:bg-purple-50 flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Copier le lien
              </Button>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <QrCode className="w-4 h-4" />
                    QR Code
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-sm">
                  <DialogHeader>
                    <DialogTitle>QR Code - Page Équipe</DialogTitle>
                    <DialogDescription>
                      Scannez ce code pour accéder directement à la page équipe
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex justify-center p-4">
                    <QRCodeSVG value={equipeUrl} size={200} />
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Informations */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-medium text-purple-900 mb-2">Cette page équipe affiche :</h4>
              <ul className="text-sm text-purple-800 space-y-1">
                <li>• <strong>Configuration :</strong> Informations générales de l'événement</li>
                <li>• <strong>Équipe :</strong> Liste complète des membres avec contacts</li>
                <li>• <strong>Prestataires :</strong> Tous les prestataires et leurs informations</li>
                <li>• <strong>Planning :</strong> Timeline du Jour-J avec filtres par personne</li>
                <li>• <strong>Documents :</strong> Accès à tous les documents partagés</li>
                <li>• Interface en lecture seule (consultation uniquement)</li>
                <li>• Synchronisation temps réel avec vos modifications admin</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conseils d'utilisation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">💡 Conseils d'utilisation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-gray-600">
          <p>
            <strong>Partage simple :</strong> Envoyez directement l'URL par message, email ou réseaux sociaux
          </p>
          <p>
            <strong>QR Code :</strong> Idéal pour l'affichage physique (invitations, panneau d'accueil, etc.)
          </p>
          <p>
            <strong>Aperçu :</strong> Testez l'affichage avant de partager avec votre équipe
          </p>
          <p>
            <strong>Mise à jour temps réel :</strong> Toutes vos modifications sont immédiatement visibles sur la page équipe
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

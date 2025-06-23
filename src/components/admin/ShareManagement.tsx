
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useShareToken, ShareToken } from '@/hooks/useShareToken';
import { useLocalEventData } from '@/contexts/LocalEventDataContext';
import { 
  Copy, 
  QrCode, 
  Eye,
  RefreshCw,
  Trash2,
  Plus,
  Clock,
  Share
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
import { Badge } from '@/components/ui/badge';

export const ShareManagement = () => {
  const { toast } = useToast();
  const { 
    generateShareToken, 
    regenerateShareToken, 
    getActiveTokens, 
    revokeToken,
    generating,
    regenerating 
  } = useShareToken();
  
  const [activeTokens, setActiveTokens] = useState<ShareToken[]>([]);
  const [currentShareUrl, setCurrentShareUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Utiliser le contexte des données d'événement local
  const { currentEvent } = useLocalEventData();
  const currentEventId = currentEvent?.id;

  const loadActiveTokens = async () => {
    if (!currentEventId) return;
    
    setLoading(true);
    try {
      const tokens = await getActiveTokens(currentEventId);
      setActiveTokens(tokens);
      
      // Set the current share URL to the most recent token
      if (tokens.length > 0) {
        const latestToken = tokens[0];
        setCurrentShareUrl(`${window.location.origin}/share/${latestToken.token}`);
      }
    } catch (error) {
      console.error('Error loading tokens:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentEventId) {
      loadActiveTokens();
    }
  }, [currentEventId]);

  const handleGenerateToken = async () => {
    if (!currentEventId) {
      toast({
        title: 'Erreur',
        description: 'Aucun événement sélectionné',
        variant: 'destructive',
      });
      return;
    }

    const token = await generateShareToken(currentEventId);
    if (token) {
      const shareUrl = `${window.location.origin}/share/${token}`;
      setCurrentShareUrl(shareUrl);
      await loadActiveTokens();
    }
  };

  const handleRegenerateToken = async () => {
    if (!currentEventId) return;

    const token = await regenerateShareToken(currentEventId);
    if (token) {
      const shareUrl = `${window.location.origin}/share/${token}`;
      setCurrentShareUrl(shareUrl);
      await loadActiveTokens();
    }
  };

  const handleRevokeToken = async (tokenId: string) => {
    const success = await revokeToken(tokenId);
    if (success) {
      await loadActiveTokens();
      // If we revoked the current token, clear the URL
      const revokedToken = activeTokens.find(t => t.id === tokenId);
      if (revokedToken && currentShareUrl.includes(revokedToken.token)) {
        setCurrentShareUrl('');
      }
    }
  };

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
    if (currentShareUrl) {
      window.open(currentShareUrl, '_blank');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDaysUntilExpiry = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Si aucun événement n'est sélectionné, afficher un message d'information
  if (!currentEventId) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Partage Public Sécurisé</h2>
          <p className="text-gray-600">
            Générez des liens sécurisés avec expiration pour partager votre événement avec votre équipe.
          </p>
        </div>

        <Card>
          <CardContent className="p-12 text-center">
            <Share className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Aucun événement sélectionné</h3>
            <p className="text-gray-500 mb-4">
              Veuillez sélectionner un événement pour générer des liens de partage.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Partage Public Sécurisé</h2>
        <p className="text-gray-600">
          Générez des liens sécurisés avec expiration pour partager votre événement avec votre équipe.
        </p>
      </div>

      {/* Génération de token */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share className="w-5 h-5 text-blue-600" />
            Lien de Partage Actuel
          </CardTitle>
          <CardDescription>
            Créez ou gérez le lien de partage principal pour votre événement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentShareUrl ? (
              <>
                {/* URL */}
                <div className="flex items-center gap-2">
                  <Input value={currentShareUrl} readOnly className="flex-1" />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(currentShareUrl, 'Le lien de partage')}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={openPreview}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Voir l'aperçu
                  </Button>

                  <Button
                    onClick={() => copyToClipboard(currentShareUrl, 'Le lien de partage')}
                    variant="outline"
                    className="border-blue-200 text-blue-700 hover:bg-blue-50 flex items-center gap-2"
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
                        <DialogTitle>QR Code - Partage Événement</DialogTitle>
                        <DialogDescription>
                          Scannez ce code pour accéder directement à l'événement
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex justify-center p-4">
                        <QRCodeSVG value={currentShareUrl} size={200} />
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button
                    onClick={handleRegenerateToken}
                    disabled={regenerating}
                    variant="outline"
                    className="border-orange-200 text-orange-700 hover:bg-orange-50 flex items-center gap-2"
                  >
                    <RefreshCw className={`w-4 h-4 ${regenerating ? 'animate-spin' : ''}`} />
                    Régénérer
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <Share className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500 mb-4">Aucun lien de partage actif</p>
                <Button
                  onClick={handleGenerateToken}
                  disabled={generating}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white flex items-center gap-2"
                >
                  <Plus className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
                  Créer un lien de partage
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Gestion des tokens actifs */}
      {activeTokens.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-green-600" />
              Tokens Actifs ({activeTokens.length})
            </CardTitle>
            <CardDescription>
              Gérez tous les liens de partage actifs pour cet événement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeTokens.map((token) => {
                const daysLeft = getDaysUntilExpiry(token.expires_at);
                const isExpiringSoon = daysLeft <= 7;
                
                return (
                  <div key={token.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <code className="text-sm bg-white px-2 py-1 rounded border">
                          ...{token.token.slice(-8)}
                        </code>
                        <Badge 
                          variant={isExpiringSoon ? "destructive" : "secondary"}
                          className="text-xs"
                        >
                          {daysLeft > 0 ? `${daysLeft} jours restants` : 'Expiré'}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        Créé le {formatDate(token.created_at)} • 
                        Expire le {formatDate(token.expires_at)}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(
                          `${window.location.origin}/share/${token.token}`,
                          'Le lien'
                        )}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRevokeToken(token.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Informations sur la sécurité */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">🔒 Sécurité et Confidentialité</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-gray-600">
          <p>
            <strong>Liens temporaires :</strong> Tous les liens expirent automatiquement après 30 jours
          </p>
          <p>
            <strong>Accès lecture seule :</strong> Les utilisateurs externes peuvent uniquement consulter les informations
          </p>
          <p>
            <strong>Révocation :</strong> Vous pouvez désactiver un lien à tout moment
          </p>
          <p>
            <strong>Régénération :</strong> Créer un nouveau lien rend l'ancien inutilisable
          </p>
          <p>
            <strong>Pas d'authentification :</strong> Aucun compte requis pour accéder aux liens partagés
          </p>
        </CardContent>
      </Card>
    </div>
  );
};


import React, { useState } from 'react';
import { useLocalEventData } from '@/contexts/LocalEventDataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  Copy, 
  QrCode, 
  RefreshCw, 
  Users, 
  Building2, 
  Shield, 
  ExternalLink,
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
  const { currentEvent, people, vendors } = useLocalEventData();
  const { toast } = useToast();
  const [tokens, setTokens] = useState<{[key: string]: string}>({});
  const [showQR, setShowQR] = useState<string | null>(null);

  const generateToken = (userId: string) => {
    if (!tokens[userId]) {
      const newToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      setTokens(prev => ({ ...prev, [userId]: newToken }));
      return newToken;
    }
    return tokens[userId];
  };

  const regenerateToken = (userId: string) => {
    const newToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setTokens(prev => ({ ...prev, [userId]: newToken }));
    toast({
      title: 'Token régénéré',
      description: 'Un nouveau lien de sécurité a été généré.',
    });
  };

  const generateShareLink = (userId: string, userType: 'person' | 'vendor', withToken = true) => {
    const baseUrl = window.location.origin;
    const token = withToken ? generateToken(userId) : '';
    const tokenParam = withToken ? `&token=${token}` : '';
    return `${baseUrl}/portal?user_id=${userId}&user_type=${userType}&auto_login=true${tokenParam}`;
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: 'Lien copié',
        description: `Le lien pour ${label} a été copié dans le presse-papiers.`,
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de copier le lien.',
        variant: 'destructive',
      });
    }
  };

  const adminLink = `${window.location.origin}/portal`;

  const filteredPeople = people.filter(person => 
    person.event_id === (currentEvent?.id || 'default-event')
  );
  
  const filteredVendors = vendors.filter(vendor => 
    vendor.event_id === (currentEvent?.id || 'default-event')
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Partage et Accès</h2>
        <p className="text-gray-600">
          Générez des liens personnalisés pour donner accès à votre équipe et prestataires.
        </p>
      </div>

      {/* Lien Admin */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-600" />
            Accès Administrateur
          </CardTitle>
          <CardDescription>
            Lien direct pour l'administration complète (nécessite une authentification)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Input value={adminLink} readOnly className="flex-1" />
            <Button
              variant="outline"
              size="icon"
              onClick={() => copyToClipboard(adminLink, 'admin')}
            >
              <Copy className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => window.open(adminLink, '_blank')}
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Équipe */}
      {filteredPeople.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              Équipe Jour-J ({filteredPeople.length})
            </CardTitle>
            <CardDescription>
              Liens personnalisés pour chaque membre de l'équipe
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredPeople.map((person) => {
              const shareLink = generateShareLink(person.id, 'person');
              return (
                <div key={person.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{person.name}</h4>
                      <p className="text-sm text-gray-500">{person.role || 'Membre de l\'équipe'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-purple-50 text-purple-700">
                        <Eye className="w-3 h-3 mr-1" />
                        Vue personnelle
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Input value={shareLink} readOnly className="flex-1 text-xs" />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(shareLink, person.name)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <QrCode className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-sm">
                        <DialogHeader>
                          <DialogTitle>QR Code - {person.name}</DialogTitle>
                          <DialogDescription>
                            Scannez ce code pour accéder directement au planning
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-center p-4">
                          <QRCodeSVG value={shareLink} size={200} />
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => regenerateToken(person.id)}
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Prestataires */}
      {filteredVendors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              Prestataires ({filteredVendors.length})
            </CardTitle>
            <CardDescription>
              Liens personnalisés pour chaque prestataire
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredVendors.map((vendor) => {
              const shareLink = generateShareLink(vendor.id, 'vendor');
              return (
                <div key={vendor.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{vendor.name}</h4>
                      <p className="text-sm text-gray-500">{vendor.service_type || 'Prestataire'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        <Eye className="w-3 h-3 mr-1" />
                        Vue prestataire
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Input value={shareLink} readOnly className="flex-1 text-xs" />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(shareLink, vendor.name)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <QrCode className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-sm">
                        <DialogHeader>
                          <DialogTitle>QR Code - {vendor.name}</DialogTitle>
                          <DialogDescription>
                            Scannez ce code pour accéder directement au planning
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-center p-4">
                          <QRCodeSVG value={shareLink} size={200} />
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => regenerateToken(vendor.id)}
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {filteredPeople.length === 0 && filteredVendors.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune personne ajoutée</h3>
            <p className="text-gray-500 mb-4">
              Ajoutez des membres d'équipe et des prestataires pour générer leurs liens d'accès.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

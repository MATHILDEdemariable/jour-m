
import React, { useState, useEffect } from 'react';
import { useEventData } from '@/contexts/EventDataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Copy, Users, RefreshCw, Eye, AlertCircle, KeyRound } from 'lucide-react';
import { QRCodeCanvas as QRCode } from 'qrcode.react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const ShareManagement = () => {
  const { currentEvent } = useEventData();
  const [magicAccessLink, setMagicAccessLink] = useState('');
  const [generating, setGenerating] = useState(false);
  const { toast } = useToast();

  const generateMagicWord = () => {
    const charset = "ABCDEFGHJKLMNPQRSTUVWXYZ123456789";
    let word = "";
    for (let i = 0; i < 8; i++) {
      word += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return word;
  };

  const updateMagicWord = async (newMagicWord: string) => {
    if (!currentEvent?.id) return;
    
    setGenerating(true);
    try {
      const { error } = await supabase
        .from('events')
        .update({ magic_word: newMagicWord })
        .eq('id', currentEvent.id);

      if (error) throw error;

      toast({
        title: 'Code mis à jour',
        description: 'Le nouveau code d\'accès a été généré avec succès',
      });

      // Mettre à jour le lien
      const newLink = `${window.location.origin}/magic-access?magic=${newMagicWord}`;
      setMagicAccessLink(newLink);
    } catch (error) {
      console.error('Error updating magic word:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour le code d\'accès',
        variant: 'destructive',
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleRegenerateMagicWord = async () => {
    const newMagicWord = generateMagicWord();
    await updateMagicWord(newMagicWord);
  };

  useEffect(() => {
    const initializeMagicLink = async () => {
      if (currentEvent?.id) {
        let magicWord = currentEvent.magic_word;
        
        // Générer un magic word s'il n'existe pas
        if (!magicWord) {
          magicWord = generateMagicWord();
          await updateMagicWord(magicWord);
        } else {
          const magicLink = `${window.location.origin}/magic-access?magic=${magicWord}`;
          setMagicAccessLink(magicLink);
        }
      }
    };

    initializeMagicLink();
  }, [currentEvent]);

  const handleCopy = (link: string) => {
    if (!link) return;
    navigator.clipboard.writeText(link);
    toast({
      title: 'Copié !',
      description: 'Le lien d\'accès équipe a été copié dans le presse-papiers.',
    });
  };

  const handleCopyCode = () => {
    if (!currentEvent?.magic_word) return;
    navigator.clipboard.writeText(currentEvent.magic_word);
    toast({
      title: 'Code copié !',
      description: 'Le code d\'accès a été copié dans le presse-papiers.',
    });
  };

  const handlePreview = (link: string) => {
    if (!link) {
      toast({
        title: 'Erreur',
        description: 'Le lien n\'est pas encore prêt',
        variant: 'destructive',
      });
      return;
    }
    window.open(link, '_blank');
  };

  if (!currentEvent) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Accès Équipe</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-amber-600">
            <AlertCircle className="w-4 h-4" />
            <p>Veuillez d'abord sélectionner un événement.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Accès par Code d'Accès */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="w-6 h-6 text-purple-600" />
            Mot de Passe d'Accès Équipe
          </CardTitle>
          <CardDescription>
            Générez un mot de passe d'accès simple pour votre équipe. Ils pourront accéder directement à leur planning sans créer de compte utilisateur.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Code d'accès */}
          <div>
            <label htmlFor="magic-code" className="text-sm font-medium">Mot de passe d'accès actuel</label>
            <div className="flex gap-2 mt-1">
              <Input 
                id="magic-code" 
                type="text" 
                value={currentEvent.magic_word || 'Génération...'}
                readOnly 
                className="font-mono text-lg tracking-wider text-center bg-gray-50"
              />
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleCopyCode} 
                disabled={!currentEvent.magic_word}
                title="Copier le mot de passe"
              >
                <Copy className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleRegenerateMagicWord}
                disabled={generating}
                title="Générer un nouveau mot de passe"
              >
                <RefreshCw className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>

          {/* Lien d'accès direct */}
          <div>
            <label htmlFor="magic-access-link" className="text-sm font-medium">Lien d'accès direct</label>
            <div className="flex gap-2 mt-1">
              <Input 
                id="magic-access-link" 
                type="text" 
                value={magicAccessLink || 'Génération du lien...'}
                readOnly 
                placeholder="Génération du lien..."
              />
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => handleCopy(magicAccessLink)} 
                disabled={!magicAccessLink}
              >
                <Copy className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => handlePreview(magicAccessLink)} 
                disabled={!magicAccessLink}
              >
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium mb-2">Mode d'emploi</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Partagez le mot de passe ou le lien avec votre équipe</li>
                <li>• L'équipe accède via "Rejoindre équipe"</li>
                <li>• Saisie du mot de passe → dashboard → équipe</li>
                <li>• Sélection du profil → planning personnalisé</li>
                <li>• Synchronisation en temps réel</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Avantages</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Accès rapide sans compte utilisateur</li>
                <li>• Mot de passe simple à partager</li>
                <li>• Interface mobile et desktop optimisée</li>
                <li>• Régénération possible si compromis</li>
                <li>• Accès révocable instantanément</li>
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Instructions pour l'équipe:</strong> Rendez-vous sur votre site → "Rejoindre équipe" → saisissez le mot de passe <span className="font-mono bg-blue-100 px-1 rounded">{currentEvent.magic_word}</span> → Accédez au dashboard → Cliquez sur "Accéder à l'équipe"
            </p>
          </div>
        </CardContent>
      </Card>

      {/* QR Code */}
      <Card className="flex flex-col items-center justify-center p-6">
        <h3 className="text-lg font-semibold mb-4">QR Code - Accès Équipe</h3>
        <div className="bg-white p-4 rounded-lg shadow-md">
          {magicAccessLink ? (
            <QRCode value={magicAccessLink} size={192} />
          ) : (
            <div className="w-48 h-48 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
              <span className="text-gray-500 text-sm">Génération...</span>
            </div>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-4 text-center max-w-md">
          Scannez ce QR code pour accéder directement à la page d'accès équipe avec le mot de passe pré-rempli
        </p>
        <div className="mt-3 text-xs text-gray-500 text-center">
          Compatible avec tous les lecteurs QR code standards
        </div>
      </Card>
    </div>
  );
};


import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Cloud, RefreshCw, Link, CheckCircle, AlertCircle } from 'lucide-react';
import { useDocuments } from '@/hooks/useDocuments';

export const GoogleDriveIntegration: React.FC = () => {
  const { googleDriveConfig, syncing, connectGoogleDrive, syncGoogleDrive } = useDocuments();
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [folderUrl, setFolderUrl] = useState('');

  const handleConnect = async () => {
    if (!folderUrl) return;

    try {
      // Extraire l'ID du dossier depuis l'URL
      const urlMatch = folderUrl.match(/\/folders\/([a-zA-Z0-9-_]+)/);
      if (!urlMatch) {
        throw new Error('URL de dossier Google Drive invalide');
      }

      const folderId = urlMatch[1];
      await connectGoogleDrive(folderId, folderUrl);
      setIsConnectModalOpen(false);
      setFolderUrl('');
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
    }
  };

  const isConnected = googleDriveConfig?.is_connected;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cloud className="w-5 h-5 text-blue-600" />
            <CardTitle>Intégration Google Drive</CardTitle>
          </div>
          {isConnected && (
            <Badge className="bg-green-100 text-green-800">
              <CheckCircle className="w-3 h-3 mr-1" />
              Connecté
            </Badge>
          )}
        </div>
        <CardDescription>
          Synchronisez automatiquement vos documents depuis Google Drive
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isConnected ? (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-green-900">Google Drive connecté</h4>
                  <p className="text-sm text-green-700 mt-1">
                    Dossier synchronisé avec succès
                  </p>
                  {googleDriveConfig.folder_url && (
                    <a 
                      href={googleDriveConfig.folder_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 mt-2"
                    >
                      <Link className="w-3 h-3" />
                      Voir le dossier Drive
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={syncGoogleDrive}
                disabled={syncing}
                variant="outline"
                className="flex-1"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
                {syncing ? 'Synchronisation...' : 'Synchroniser'}
              </Button>
            </div>

            {googleDriveConfig.last_sync_at && (
              <p className="text-xs text-gray-500">
                Dernière synchronisation : {new Date(googleDriveConfig.last_sync_at).toLocaleString('fr-FR')}
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-900">Google Drive non connecté</h4>
                  <p className="text-sm text-amber-700 mt-1">
                    Connectez votre dossier Google Drive pour synchroniser automatiquement vos documents
                  </p>
                </div>
              </div>
            </div>

            <Dialog open={isConnectModalOpen} onOpenChange={setIsConnectModalOpen}>
              <DialogTrigger asChild>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Cloud className="w-4 h-4 mr-2" />
                  Connecter Google Drive
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Connecter Google Drive</DialogTitle>
                  <DialogDescription>
                    Collez l'URL de votre dossier Google Drive pour commencer la synchronisation
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="folder-url">URL du dossier Google Drive</Label>
                    <Input
                      id="folder-url"
                      placeholder="https://drive.google.com/drive/folders/..."
                      value={folderUrl}
                      onChange={(e) => setFolderUrl(e.target.value)}
                    />
                    <p className="text-xs text-gray-500">
                      Exemple : https://drive.google.com/drive/folders/1xsSA1XEwGWu3rdnh7RfU9ZPdwmC9CLeF
                    </p>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsConnectModalOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleConnect} disabled={!folderUrl}>
                    Connecter
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
};


import React, { useEffect, useState } from 'react';
import { useEventStore } from '@/stores/eventStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WifiOff, Wifi, Download, Upload, HardDrive } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const OfflineManager = () => {
  const { 
    isOffline, 
    lastSyncAt, 
    exportData, 
    createBackup, 
    getStorageSize 
  } = useEventStore();
  const { toast } = useToast();
  const [storageSize, setStorageSize] = useState(0);

  useEffect(() => {
    setStorageSize(getStorageSize());
  }, [getStorageSize]);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleCreateBackup = () => {
    try {
      const backup = createBackup();
      const blob = new Blob([backup], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `jourm-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: 'Sauvegarde créée',
        description: 'La sauvegarde a été téléchargée avec succès.',
      });
    } catch (error) {
      toast({
        title: 'Erreur de sauvegarde',
        description: 'Impossible de créer la sauvegarde.',
        variant: 'destructive',
      });
    }
  };

  const handleExportData = () => {
    try {
      const data = exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `jourm-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: 'Export réussi',
        description: 'Les données ont été exportées.',
      });
    } catch (error) {
      toast({
        title: 'Erreur d\'export',
        description: 'Impossible d\'exporter les données.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isOffline ? (
            <>
              <WifiOff className="w-5 h-5 text-red-500" />
              Mode Hors-ligne
            </>
          ) : (
            <>
              <Wifi className="w-5 h-5 text-green-500" />
              En ligne
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Statut:</span>
          <Badge variant={isOffline ? "destructive" : "default"}>
            {isOffline ? 'Hors-ligne' : 'En ligne'}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Dernière sync:</span>
          <span className="text-sm">
            {lastSyncAt ? new Date(lastSyncAt).toLocaleString() : 'Jamais'}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Taille des données:</span>
          <div className="flex items-center gap-1">
            <HardDrive className="w-4 h-4" />
            <span className="text-sm">{formatBytes(storageSize)}</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={handleCreateBackup}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <Download className="w-4 h-4 mr-2" />
            Sauvegarde
          </Button>
          
          <Button
            onClick={handleExportData}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <Upload className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
        
        {isOffline && (
          <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
            Mode hors-ligne actif. Toutes les modifications sont sauvegardées localement.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

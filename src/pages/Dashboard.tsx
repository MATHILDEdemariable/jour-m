
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Eye, Settings, LogIn, LogOut, Download, Upload, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast"
import { useAuth } from '@/contexts/AuthContext';
import { EventPortalSelectionModal } from '@/components/event/EventPortalSelectionModal';
import { useLocalCurrentEvent } from '@/contexts/LocalCurrentEventContext';
import { useEventStore } from '@/stores/eventStore';
import { OfflineManager } from '@/components/OfflineManager';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const { currentEventId } = useLocalCurrentEvent();
  const { 
    resetAllData, 
    exportData, 
    importData, 
    createBackup, 
    restoreFromBackup,
    getStorageSize 
  } = useEventStore();
  const [showEventPortalSelection, setShowEventPortalSelection] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [resetConfirmText, setResetConfirmText] = useState('');
  const [importText, setImportText] = useState('');
  const [restoreText, setRestoreText] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  const handleAdminAccess = () => {
    navigate('/admin');
  };

  const handleEventPortalAccess = () => {
    setShowEventPortalSelection(true);
  };

  const handleConfirmReset = async () => {
    if (resetConfirmText !== 'RESET') {
      toast({
        title: 'Erreur de confirmation',
        description: "Veuillez taper 'RESET' pour confirmer.",
        variant: 'destructive',
      });
      return;
    }

    setIsResetting(true);
    try {
      resetAllData();
      toast({
        title: 'Succès',
        description: "Les données ont été réinitialisées.",
      });
      setResetConfirmText('');
      setShowResetDialog(false);
    } catch (error) {
      console.error('Failed to reset data:', error);
      toast({
        title: 'Erreur',
        description: "Impossible de réinitialiser les données.",
        variant: 'destructive',
      });
    } finally {
      setIsResetting(false);
    }
  };

  const handleExport = () => {
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

  const handleImport = () => {
    try {
      importData(importText);
      toast({
        title: 'Import réussi',
        description: 'Les données ont été importées.',
      });
      setImportText('');
      setShowImportDialog(false);
    } catch (error) {
      toast({
        title: 'Erreur d\'import',
        description: 'Impossible d\'importer les données. Vérifiez le format JSON.',
        variant: 'destructive',
      });
    }
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
        description: 'La sauvegarde complète a été téléchargée.',
      });
    } catch (error) {
      toast({
        title: 'Erreur de sauvegarde',
        description: 'Impossible de créer la sauvegarde.',
        variant: 'destructive',
      });
    }
  };

  const handleRestore = () => {
    try {
      const success = restoreFromBackup(restoreText);
      if (success) {
        toast({
          title: 'Restauration réussie',
          description: 'Les données ont été restaurées.',
        });
        setRestoreText('');
        setShowRestoreDialog(false);
      } else {
        throw new Error('Invalid backup format');
      }
    } catch (error) {
      toast({
        title: 'Erreur de restauration',
        description: 'Impossible de restaurer les données. Vérifiez le format de sauvegarde.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-yellow-50 flex flex-col">
      {/* Hero Section */}
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-extrabold text-stone-800 mb-4 tracking-tight">
            JOURM - <span className="text-purple-600">par Mariable</span>
          </h1>
          <p className="text-stone-500 text-lg mb-8">
            Une appli autonome, une équipe, une journée parfaite.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Navigation principale */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-stone-700">Navigation</h3>
              <div className="flex flex-col gap-2">
                <Button
                  onClick={handleEventPortalAccess}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white flex items-center gap-2"
                >
                  <Eye className="w-5 h-5" />
                  Équipe
                </Button>
                
                <Button
                  onClick={handleAdminAccess}
                  variant="outline"
                  className="border-purple-200 text-purple-700 hover:bg-purple-50 flex items-center gap-2"
                >
                  <Settings className="w-5 h-5" />
                  Admin
                </Button>
              </div>
            </div>

            {/* Gestion des données */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-stone-700">Données</h3>
              <div className="flex flex-col gap-2">
                <Button
                  onClick={handleExport}
                  variant="outline"
                  size="sm"
                  className="text-gray-600 border-gray-200"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exporter JSON
                </Button>
                
                <Button
                  onClick={() => setShowImportDialog(true)}
                  variant="outline"
                  size="sm"
                  className="text-gray-600 border-gray-200"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Importer JSON
                </Button>

                <Button
                  onClick={handleCreateBackup}
                  variant="outline"
                  size="sm"
                  className="text-blue-600 border-blue-200"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Sauvegarde complète
                </Button>

                <Button
                  onClick={() => setShowRestoreDialog(true)}
                  variant="outline"
                  size="sm"
                  className="text-blue-600 border-blue-200"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Restaurer sauvegarde
                </Button>
              </div>
            </div>

            {/* Gestionnaire hors-ligne */}
            <div className="flex justify-center">
              <OfflineManager />
            </div>
          </div>

          {/* Section utilisateur */}
          {user ? (
            <div className="mt-4 flex flex-col items-center gap-2">
              <p className="text-sm text-gray-600">Connecté en tant que: {user.email}</p>
              <Button
                onClick={signOut}
                variant="ghost"
                className="text-stone-500 hover:text-stone-700"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Se déconnecter
              </Button>
            </div>
          ) : (
             <div className="mt-6">
              <Button onClick={() => navigate('/auth')} size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <LogIn className="w-5 h-5 mr-2" />
                Connexion / Inscription
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Custom Footer */}
      <footer className="bg-gradient-to-r from-purple-600 to-pink-600 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/69f2f20b-c47f-4c2c-8609-7e9151e83a4f.png" 
              alt="Mariable Logo" 
              className="h-12 w-12 object-contain"
            />
          </div>
          <div className="flex items-center gap-4 text-white text-sm">
            <span>
              © 2025 - Powered by <a href="https://mariable.fr" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">mariable.fr</a>
            </span>
            <Button
              onClick={() => setShowResetDialog(true)}
              variant="link"
              className="text-white h-auto p-0 text-xs opacity-70 hover:opacity-100"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Réinitialiser
            </Button>
          </div>
        </div>
      </footer>

      {/* Reset Dialog */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Êtes-vous absolument sûr ?</DialogTitle>
            <DialogDescription>
              Cette action est irréversible. Toutes les données (tâches, planning, équipe, prestataires, documents, etc.) seront définitivement supprimées. Pour confirmer, veuillez taper <span className="font-bold text-red-600">RESET</span> dans le champ ci-dessous.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={resetConfirmText}
              onChange={(e) => setResetConfirmText(e.target.value)}
              placeholder='Tapez "RESET" pour confirmer'
              className="border-red-500 focus-visible:ring-red-500"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResetDialog(false)}>Annuler</Button>
            <Button
              variant="destructive"
              disabled={resetConfirmText !== 'RESET' || isResetting}
              onClick={handleConfirmReset}
            >
              {isResetting ? 'Réinitialisation en cours...' : 'Je comprends, tout supprimer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Importer des données</DialogTitle>
            <DialogDescription>
              Collez ici le contenu JSON exporté précédemment pour restaurer vos données.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder='Collez le JSON ici...'
              className="w-full h-32 p-2 border rounded-md resize-none font-mono text-xs"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowImportDialog(false)}>Annuler</Button>
            <Button
              disabled={!importText.trim()}
              onClick={handleImport}
            >
              Importer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Restore Dialog */}
      <Dialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restaurer une sauvegarde</DialogTitle>
            <DialogDescription>
              Collez ici le contenu d'une sauvegarde complète pour restaurer toutes vos données.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <textarea
              value={restoreText}
              onChange={(e) => setRestoreText(e.target.value)}
              placeholder='Collez la sauvegarde ici...'
              className="w-full h-32 p-2 border rounded-md resize-none font-mono text-xs"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRestoreDialog(false)}>Annuler</Button>
            <Button
              disabled={!restoreText.trim()}
              onClick={handleRestore}
            >
              Restaurer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Event Portal Selection Modal */}
      <EventPortalSelectionModal
        open={showEventPortalSelection}
        onOpenChange={setShowEventPortalSelection}
      />
    </div>
  );
};

export default Dashboard;

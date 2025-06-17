
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Eye, Settings, LogIn, LogOut, Download, Upload } from 'lucide-react';
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

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const { currentEventId } = useLocalCurrentEvent();
  const { resetAllData, exportData, importData } = useEventStore();
  const [showEventPortalSelection, setShowEventPortalSelection] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [resetConfirmText, setResetConfirmText] = useState('');
  const [importText, setImportText] = useState('');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-yellow-50 flex flex-col">
      {/* Hero Section */}
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-stone-800 mb-4 tracking-tight">
            JOURM - <span className="text-purple-600">par Mariable</span>
          </h1>
          <p className="text-stone-500 text-lg mb-8">
            Une appli, une équipe, une journée parfaite.
          </p>

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Button
              onClick={handleEventPortalAccess}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white flex items-center gap-2"
              size="lg"
            >
              <Eye className="w-5 h-5" />
              Equipe
            </Button>
            
            <Button
              onClick={handleAdminAccess}
              variant="outline"
              className="border-purple-200 text-purple-700 hover:bg-purple-50 flex items-center gap-2"
              size="lg"
            >
              <Settings className="w-5 h-5" />
              Admin
            </Button>
          </div>

          {/* Boutons d'export/import */}
          <div className="flex flex-col sm:flex-row gap-2 justify-center max-w-md mx-auto mt-4">
            <Button
              onClick={handleExport}
              variant="outline"
              size="sm"
              className="text-gray-600 border-gray-200"
            >
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>
            
            <Button
              onClick={() => setShowImportDialog(true)}
              variant="outline"
              size="sm"
              className="text-gray-600 border-gray-200"
            >
              <Upload className="w-4 h-4 mr-2" />
              Importer
            </Button>
          </div>

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
              Réinitialiser les données
            </Button>
          </div>
        </div>
      </footer>

      {/* Reset Confirmation Dialog */}
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

      {/* Event Portal Selection Modal */}
      <EventPortalSelectionModal
        open={showEventPortalSelection}
        onOpenChange={setShowEventPortalSelection}
      />
    </div>
  );
};

export default Home;

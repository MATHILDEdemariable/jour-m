
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Eye, Settings, LogIn, UserPlus, LogOut } from 'lucide-react';
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
import { useCurrentEvent } from '@/contexts/CurrentEventContext';
import { supabase } from '@/integrations/supabase/client';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const { currentEventId } = useCurrentEvent();
  const [showEventPortalSelection, setShowEventPortalSelection] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [resetConfirmText, setResetConfirmText] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  const handleAdminAccess = () => {
    navigate('/admin');
  };

  const handleEventPortalAccess = () => {
    setShowEventPortalSelection(true);
  };

  const handleConfirmReset = async () => {
    if (resetConfirmText !== 'RESET' || !currentEventId) {
      toast({
        title: 'Erreur de confirmation',
        description: "Veuillez sélectionner un événement et taper 'RESET' pour confirmer.",
        variant: 'destructive',
      });
      return;
    }

    setIsResetting(true);
    try {
      const { error } = await supabase.functions.invoke('reset-event-data', {
        body: { eventId: currentEventId },
      });

      if (error) {
        throw error;
      }

      toast({
        title: 'Succès',
        description: "Les données de l'événement ont été réinitialisées. La page va se rafraîchir.",
      });

      setTimeout(() => window.location.reload(), 2000);

    } catch (error) {
      console.error('Failed to reset event data:', error);
      toast({
        title: 'Erreur',
        description: "Impossible de réinitialiser les données de l'événement.",
        variant: 'destructive',
      });
    } finally {
      setIsResetting(false);
      setResetConfirmText('');
      setShowResetDialog(false);
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

          {user ? (
            <div className="mt-4 flex flex-col items-center gap-2">
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
            {user && (
              <Button
                onClick={() => setShowResetDialog(true)}
                variant="link"
                className="text-white h-auto p-0 text-xs opacity-70 hover:opacity-100"
              >
                Réinitialiser les données
              </Button>
            )}
          </div>
        </div>
      </footer>

      {/* Reset Confirmation Dialog */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Êtes-vous absolument sûr ?</DialogTitle>
            <DialogDescription>
              Cette action est irréversible. Toutes les données (tâches, planning, équipe, prestataires, documents, etc.) de l'événement actuel seront définitivement supprimées. Pour confirmer, veuillez taper <span className="font-bold text-red-600">RESET</span> dans le champ ci-dessous.
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

      {/* Event Portal Selection Modal */}
      <EventPortalSelectionModal
        open={showEventPortalSelection}
        onOpenChange={setShowEventPortalSelection}
      />
    </div>
  );
};

export default Home;

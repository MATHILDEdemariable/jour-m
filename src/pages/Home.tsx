
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, Eye, Settings } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { AdminLoginForm } from '@/components/admin/AdminLoginForm';
import { Footer } from '@/components/Footer';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, login, logout } = useAdminAuth();
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const handleLogin = async (password: string) => {
    const success = await login(password);
    if (success) {
      toast({
        title: "Connexion réussie",
        description: "Vous êtes connecté en tant qu'administrateur.",
      });
      setShowAdminLogin(false);
      navigate('/admin');
    } else {
      toast({
        title: "Erreur de connexion",
        description: "Mot de passe incorrect.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Déconnexion réussie",
      description: "Vous êtes déconnecté de l'administration.",
    });
  };

  const handleAdminAccess = () => {
    if (isAuthenticated) {
      navigate('/admin');
    } else {
      setShowAdminLogin(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-yellow-50 flex flex-col">
      {/* Hero Section */}
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-stone-800 mb-4 tracking-tight">
            Organisez votre événement <span className="text-sage-600">sans stress</span>
          </h1>
          <p className="text-stone-500 text-lg mb-8">
            Planifiez chaque détail, de la liste des invités à la coordination des prestataires.
          </p>

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Button
              onClick={() => navigate('/event')}
              className="bg-white text-purple-600 border-2 border-purple-200 hover:bg-purple-50 hover:border-purple-300 flex items-center gap-2"
              size="lg"
            >
              <Calendar className="w-5 h-5" />
              Timeline Invités
            </Button>
            
            <Button
              onClick={() => navigate('/event-portal')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white flex items-center gap-2"
              size="lg"
            >
              <Eye className="w-5 h-5" />
              Event Portal
            </Button>
            
            <Button
              onClick={handleAdminAccess}
              variant="outline"
              className="border-purple-200 text-purple-700 hover:bg-purple-50 flex items-center gap-2"
              size="lg"
            >
              <Settings className="w-5 h-5" />
              {isAuthenticated ? 'Admin Portal' : 'Admin'}
            </Button>
          </div>

          {isAuthenticated && (
            <div className="mt-4">
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="text-stone-500 hover:text-stone-700"
              >
                Se déconnecter
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <Footer />

      {/* Admin Login Modal */}
      <Dialog open={showAdminLogin} onOpenChange={setShowAdminLogin}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Connexion Administrateur</DialogTitle>
            <DialogDescription>
              Entrez le mot de passe pour accéder à l'interface d'administration.
            </DialogDescription>
          </DialogHeader>
          <AdminLoginForm onSubmit={handleLogin} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Home;

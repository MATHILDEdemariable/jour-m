
import React from 'react';
import { HeroSection } from '@/components/marketing/HeroSection';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Users, LogIn } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleAdminClick = () => {
    navigate('/portal');
  };

  const handleEventClick = () => {
    navigate('/portal');
  };

  return (
    <div className="bg-white text-stone-800">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b">
        <div className="container mx-auto flex justify-between items-center p-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            JOURM
          </h1>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline"
              onClick={() => navigate('/magic-access')}
              className="border-green-200 text-green-700 hover:bg-green-50 flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              Rejoindre Équipe
            </Button>
            <Button onClick={() => navigate('/auth')} className="flex items-center gap-2">
              <LogIn className="w-4 h-4" />
              Connexion / Inscription
            </Button>
          </div>
        </div>
      </header>
      <main>
        <HeroSection 
          onAdminClick={handleAdminClick}
          onEventClick={handleEventClick}
        />
      </main>
      <footer className="bg-stone-100 border-t">
        <div className="container mx-auto p-8 text-center text-stone-500">
          <p>© 2025 JOURM par Mariable. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

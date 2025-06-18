
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { HeroSection } from '@/components/marketing/HeroSection';
import { Footer } from '@/components/Footer';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handlePortalAccess = () => {
    navigate('/portal');
  };

  const handleMagicAccess = () => {
    // Pour l'accès via mot magique (à implémenter plus tard)
    navigate('/magic-access');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <HeroSection 
        onAdminClick={handlePortalAccess}
        onEventClick={handleMagicAccess}
      />
      <Footer />
    </div>
  );
};

export default Index;

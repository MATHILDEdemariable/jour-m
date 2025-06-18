
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroSection } from '@/components/marketing/HeroSection';
import { Footer } from '@/components/Footer';

const Index = () => {
  const navigate = useNavigate();

  const handleCreateEvent = () => {
    navigate('/portal');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <HeroSection 
        onAdminClick={handleCreateEvent}
        onEventClick={handleCreateEvent}
      />
      <Footer />
    </div>
  );
};

export default Index;

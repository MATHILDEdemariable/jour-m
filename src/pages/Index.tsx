
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { HeroSection } from '@/components/marketing/HeroSection';
import { Footer } from '@/components/Footer';
import { EventPortalSelectionModal } from '@/components/event/EventPortalSelectionModal';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showEventModal, setShowEventModal] = useState(false);

  const handleAdminAccess = () => {
    if (user) {
      navigate('/portal');
    } else {
      navigate('/portal'); // Will redirect to login if needed
    }
  };

  const handleEventAccess = () => {
    setShowEventModal(true);
  };

  const handleUserSelection = (userId: string, userType: 'person' | 'vendor') => {
    const url = `/portal?user_id=${userId}&user_type=${userType}&auto_login=true`;
    navigate(url);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <HeroSection 
        onAdminClick={handleAdminAccess}
        onEventClick={handleEventAccess}
      />
      <Footer />
      
      <EventPortalSelectionModal
        open={showEventModal}
        onOpenChange={setShowEventModal}
        onUserSelect={handleUserSelection}
      />
    </div>
  );
};

export default Index;

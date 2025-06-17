
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSharedEventData } from '@/hooks/useSharedEventData';
import { PersonLogin } from '@/components/event/PersonLogin';
import { BottomNavigation } from '@/components/BottomNavigation';
import { useIsMobile } from '@/hooks/use-mobile';
import { useCurrentEvent } from '@/contexts/CurrentEventContext';
import { usePeople } from '@/hooks/usePeople';
import { useVendors } from '@/hooks/useVendors';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { GuestEvent, LoggedUser } from '@/types/event';
import { GuestEventView } from '@/components/event/GuestEventView';
import { EventPortalHeader } from '@/components/event/EventPortalHeader';
import { EventPortalContent } from '@/components/event/EventPortalContent';
import { EventPortalLoading } from '@/components/event/EventPortalLoading';
import { EventPortalSelectionModal } from '@/components/event/EventPortalSelectionModal';

const EventPortal = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isMobile = useIsMobile();
  const { loading, refreshData, getDaysUntilEvent } = useSharedEventData();
  const { currentEventId, setCurrentEventId } = useCurrentEvent();
  const { people, loadPeople, loading: peopleLoading } = usePeople();
  const { vendors, loadVendors, loading: vendorsLoading } = useVendors();
  const { toast } = useToast();
  const [loggedInUser, setLoggedInUser] = useState<LoggedUser | null>(null);
  const [activeTab, setActiveTab] = useState('planning');
  const [viewMode, setViewMode] = useState<'personal' | 'global'>('personal');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [guestEvent, setGuestEvent] = useState<GuestEvent | null>(null);
  const [guestLoading, setGuestLoading] = useState(true);
  const [hasInitialRefreshed, setHasInitialRefreshed] = useState(false);
  const [isMagicAccess, setIsMagicAccess] = useState(false);
  const [showSelectionModal, setShowSelectionModal] = useState(false);
  
  const daysUntilEvent = getDaysUntilEvent();

  useEffect(() => {
    // Vérifier l'accès par code magique
    const magicAccess = searchParams.get('magic_access') === 'true';
    const eventIdParam = searchParams.get('event_id');
    
    if (magicAccess && eventIdParam) {
      console.log('EventPortal - Magic access detected for event:', eventIdParam);
      setIsMagicAccess(true);
      setCurrentEventId(eventIdParam);
      
      // Charger les informations de l'événement et forcer le refresh des données
      const fetchEventForMagic = async () => {
        setGuestLoading(true);
        const { data, error } = await supabase
          .from('events')
          .select('id, name, event_date, event_type')
          .eq('id', eventIdParam)
          .single();
          
        if (error || !data) {
          console.error('Error fetching magic event:', error);
          navigate('/magic-access', { replace: true });
          return;
        }
        
        setGuestEvent(data);
        setGuestLoading(false);
        
        // Forcer le chargement des données après avoir défini l'event
        console.log('EventPortal - Forcing data refresh for magic access');
        await handleFullDataRefresh();
      };
      
      fetchEventForMagic();
    } else {
      // Code existant pour event_slug
      const eventSlug = searchParams.get('event_slug');
      if (eventSlug) {
        setIsGuestMode(true);
        const fetchGuestEvent = async () => {
          setGuestLoading(true);
          const { data, error } = await supabase
            .from('events')
            .select('id, name, event_date, event_type')
            .eq('slug', eventSlug)
            .single();
          if (error || !data) {
            console.error('Error fetching guest event:', error);
            navigate('/not-found', { replace: true });
            return;
          }
          setGuestEvent(data);
          setCurrentEventId(data.id);
          setGuestLoading(false);
        };
        fetchGuestEvent();
      } else {
        setGuestLoading(false);
      }
    }
  }, [searchParams, setCurrentEventId, navigate]);

  useEffect(() => {
    if (currentEventId && !hasInitialRefreshed && !isMagicAccess) {
      handleFullDataRefresh();
      setHasInitialRefreshed(true);
    }
  }, [currentEventId, hasInitialRefreshed, isMagicAccess]);

  useEffect(() => {
    const userType = searchParams.get('user_type') as 'person' | 'vendor' | null;
    const userId = searchParams.get('user_id');
    const autoLogin = searchParams.get('auto_login') === 'true';

    if (autoLogin && userType && userId) {
      let userData: LoggedUser | null = null;

      if (userType === 'person') {
        let fromStorage = null;
        try {
          fromStorage = JSON.parse(localStorage.getItem('eventPortalUser')||"null");
        } catch {}
        if (fromStorage && fromStorage.id === userId && fromStorage.type === "person") {
          userData = fromStorage;
        } else {
          const person = people.find(p => p.id === userId);
          if (person) {
            userData = { id: person.id, name: person.name, type: 'person' };
          }
        }
      } else if (userType === 'vendor') {
        let fromStorage = null;
        try {
          fromStorage = JSON.parse(localStorage.getItem('eventPortalUser')||"null");
        } catch {}
        if (fromStorage && fromStorage.id === userId && fromStorage.type === "vendor") {
          userData = fromStorage;
        } else {
          const vendor = vendors.find(v => v.id === userId);
          if (vendor) {
            userData = { id: vendor.id, name: vendor.name, type: 'vendor' };
          }
        }
      }

      if (userData) {
        setLoggedInUser(userData);
        localStorage.setItem('eventPortalUser', JSON.stringify(userData));
        return;
      }
    }

    if (userType && userId && (people.length > 0 || vendors.length > 0)) {
      let userData: LoggedUser | null = null;

      if (userType === 'person') {
        const person = people.find(p => p.id === userId);
        if (person) {
          userData = { id: person.id, name: person.name, type: 'person' };
        }
      } else if (userType === 'vendor') {
        const vendor = vendors.find(v => v.id === userId);
        if (vendor) {
          userData = { id: vendor.id, name: vendor.name, type: 'vendor' };
        }
      }

      if (userData) {
        setLoggedInUser(userData);
        localStorage.setItem('eventPortalUser', JSON.stringify(userData));
      }
    } else if (!userType && !userId) {
      const savedUser = localStorage.getItem('eventPortalUser');
      if (savedUser) {
        try {
          setLoggedInUser(JSON.parse(savedUser));
        } catch (error) {
          localStorage.removeItem('eventPortalUser');
        }
      }
    }
  }, [searchParams, people, vendors, isGuestMode]);

  const handleFullDataRefresh = async () => {
    if (!currentEventId) {
      console.log('EventPortal - No current event ID, skipping refresh');
      return;
    }
    
    console.log('EventPortal - Starting full data refresh for event:', currentEventId);
    setIsRefreshing(true);
    try {
      await Promise.all([
        refreshData(),
        loadPeople(),
        loadVendors()
      ]);
      console.log('EventPortal - Data refresh completed successfully');
      toast({
        title: 'Synchronisation terminée',
        description: 'Toutes les données ont été actualisées',
      });
    } catch (error) {
      if (!isRefreshing) {
        console.error('Error during data refresh:', error);
        toast({
          title: 'Erreur de synchronisation',
          description: 'Impossible de synchroniser les données',
          variant: 'destructive',
        });
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleLogin = (userId: string, userName: string, userType: 'person' | 'vendor') => {
    const user = { id: userId, name: userName, type: userType };
    setLoggedInUser(user);
    localStorage.setItem('eventPortalUser', JSON.stringify(user));
    handleFullDataRefresh();
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    localStorage.removeItem('eventPortalUser');
    localStorage.removeItem('eventPortalMagicLogin');
    navigate('/', { replace: true });
  };

  // Gestion spéciale pour magic access
  const handleMagicAccessUserSelect = (userId: string, userType: 'person' | 'vendor', userName: string) => {
    console.log('EventPortal - Magic access user selected:', { userId, userType, userName });
    const user = { id: userId, name: userName, type: userType };
    setLoggedInUser(user);
    localStorage.setItem('eventPortalUser', JSON.stringify(user));
    setShowSelectionModal(false);
  };

  const isDataLoading = loading || peopleLoading || vendorsLoading || isRefreshing;

  if (guestLoading) {
    return <EventPortalLoading fullScreen message="Chargement de l'événement..." details={null} />;
  }

  // Gestion spéciale pour l'accès magic
  if (isMagicAccess && guestEvent) {
    if (!loggedInUser) {
      // Afficher la modal de sélection d'équipe pour magic access
      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
          <PersonLogin onLogin={handleLogin} />
          <EventPortalSelectionModal
            open={showSelectionModal}
            onOpenChange={setShowSelectionModal}
          />
        </div>
      );
    } else {
      // Utilisateur connecté via magic access, afficher l'interface normale
      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
          <EventPortalHeader
            userName={loggedInUser.name}
            daysUntilEvent={daysUntilEvent}
            isDataLoading={isDataLoading}
            isRefreshing={isRefreshing}
            isMobile={isMobile}
            onBack={() => navigate('/')}
            onRefresh={handleFullDataRefresh}
            onLogout={handleLogout}
            onAdmin={() => navigate('/admin')}
          />

          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 lg:py-8 pb-20 lg:pb-8">
            {isDataLoading ? (
              <EventPortalLoading isRefreshing={isRefreshing} />
            ) : (
              <EventPortalContent
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isMobile={isMobile}
                loggedInUser={loggedInUser}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />
            )}
          </div>

          {isMobile && (
            <BottomNavigation 
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          )}
        </div>
      );
    }
  }

  // Code existant pour les autres modes
  if ((isGuestMode && guestEvent)) {
    return <GuestEventView event={guestEvent} />;
  }
  
  if (!loggedInUser) {
    return <PersonLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <EventPortalHeader
        userName={loggedInUser.name}
        daysUntilEvent={daysUntilEvent}
        isDataLoading={isDataLoading}
        isRefreshing={isRefreshing}
        isMobile={isMobile}
        onBack={() => navigate('/')}
        onRefresh={handleFullDataRefresh}
        onLogout={handleLogout}
        onAdmin={() => navigate('/admin')}
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 lg:py-8 pb-20 lg:pb-8">
        {isDataLoading ? (
          <EventPortalLoading isRefreshing={isRefreshing} />
        ) : (
          <EventPortalContent
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isMobile={isMobile}
            loggedInUser={loggedInUser}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        )}
      </div>

      {isMobile && (
        <BottomNavigation 
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      )}
    </div>
  );
};

export default EventPortal;

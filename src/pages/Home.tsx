
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useSearchParams } from 'react-router-dom';
import LandingPage from './LandingPage';
import { RefreshCw } from 'lucide-react';

const Home = () => {
  const { user, isLoading } = useAuth();
  const [searchParams] = useSearchParams();
  const eventSlug = searchParams.get('event');
  const isInvite = searchParams.get('invite');

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-sage-50 to-yellow-50">
        <RefreshCw className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (isInvite === 'true' && eventSlug) {
    return <Navigate to={`/event-portal?event_slug=${eventSlug}`} replace />;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <LandingPage />;
};

export default Home;

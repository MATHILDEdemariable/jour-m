
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEventStore } from "@/stores/eventStore";

export function useMagicWordAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { events, setCurrentEventId } = useEventStore();

  const loginWithMagicWord = async (magic: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Check for event with this magic_word in local storage
      const event = events.find(e => e.magic_word === magic);

      if (!event) {
        setError("Code d'accès invalide.");
        setLoading(false);
        return false;
      }

      // Store context for magic login
      localStorage.setItem("eventPortalMagicLogin", JSON.stringify({
        eventId: event.id,
        eventName: event.name,
        magicWord: magic
      }));

      // Set current event
      setCurrentEventId(event.id);

      // Redirect to team dashboard with magic access flag
      navigate(`/team-dashboard?magic_access=true&event_id=${event.id}`, { replace: true });
      setLoading(false);
      return true;
    } catch (error) {
      console.error('Magic word auth error:', error);
      setError("Erreur de connexion.");
      setLoading(false);
      return false;
    }
  };

  const clearMagicLogin = () => {
    localStorage.removeItem("eventPortalMagicLogin");
  };

  return { loading, error, loginWithMagicWord, clearMagicLogin };
}


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export function useMagicWordAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const loginWithMagicWord = async (magic: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Check for event with this magic_word
      const { data, error: err } = await supabase
        .from("events")
        .select("*")
        .eq("magic_word", magic)
        .maybeSingle();

      if (err) {
        setError("Erreur lors de la vérification.");
        setLoading(false);
        return false;
      }

      if (!data) {
        setError("Code d'accès invalide.");
        setLoading(false);
        return false;
      }

      // Store context for magic login
      localStorage.setItem("eventPortalMagicLogin", JSON.stringify({
        eventId: data.id,
        tenantId: data.tenant_id,
        eventName: data.name,
        magicWord: magic
      }));

      // Redirect to event-portal with magic access flag
      navigate(`/event-portal?magic_access=true&event_id=${data.id}`, { replace: true });
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

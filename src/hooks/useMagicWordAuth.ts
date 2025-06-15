
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
      setError("Mot magique invalide.");
      setLoading(false);
      return false;
    }
    // Structure: store minimal context for guest access
    localStorage.setItem("eventPortalMagicLogin", JSON.stringify({
      eventId: data.id,
      tenantId: data.tenant_id,
      eventName: data.name,
    }));
    // Redirect to dashboard for this event (or tenant dashboard)
    navigate(`/dashboard?magic=${encodeURIComponent(magic)}`, {replace: true});
    setLoading(false);
    return true;
  };

  const clearMagicLogin = () => {
    localStorage.removeItem("eventPortalMagicLogin");
  };

  return { loading, error, loginWithMagicWord, clearMagicLogin };
}

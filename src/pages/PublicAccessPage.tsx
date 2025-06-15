
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface PublicEventData {
  name: string;
  event_date: string;
}

const PublicAccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const eventSlug = searchParams.get("event_slug") || "";
  const [eventData, setEventData] = useState<PublicEventData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!eventSlug) return;
    const fetchEvent = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("events")
        .select("name, event_date")
        .eq("slug", eventSlug)
        .maybeSingle();

      if (!data || error) {
        setEventData(null);
      } else {
        setEventData(data);
      }
      setLoading(false);
    };
    fetchEvent();
  }, [eventSlug]);

  const handleEquipe = () => {
    // Redirige simplement vers le sélecteur d'utilisateur existant (EventPortal)
    navigate(`/event-portal?event_slug=${encodeURIComponent(eventSlug)}`);
  };

  // Version ultra simple,
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center">
      <Card className="w-full max-w-md bg-white/95 shadow-lg">
        <CardHeader>
          <CardTitle className="flex gap-2 items-center text-lg">
            <Users className="w-6 h-6 text-purple-600" />
            Accès invité à l'événement
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6 items-center">
          {loading ? (
            <span className="text-stone-500">Chargement...</span>
          ) : eventData ? (
            <>
              <div className="text-center">
                <div className="font-bold text-2xl">{eventData.name}</div>
                <div className="text-stone-500 mt-1">
                  {new Date(eventData.event_date).toLocaleDateString("fr-FR")}
                </div>
              </div>
              <Button
                onClick={handleEquipe}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded shadow w-full py-3"
                size="lg"
              >
                Voir mon équipe & planning jour J
              </Button>
            </>
          ) : (
            <div className="text-destructive">
              Événement introuvable ou inaccessible.
            </div>
          )}
          <div className="text-xs text-center text-muted-foreground mt-6">
            Seul le bouton "Équipe" donne accès à la sélection du planning personnalisé jour J.<br />
            <Button
              variant="link"
              className="mt-2 p-0 text-purple-700"
              onClick={() => navigate("/auth")}
            >
              Accès administration
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PublicAccessPage;

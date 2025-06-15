import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Building2, ArrowRight } from "lucide-react";
import { usePeople } from "@/hooks/usePeople";
import { useVendors } from "@/hooks/useVendors";
import { useCurrentEvent } from "@/contexts/CurrentEventContext";
import { LanguageToggle } from "@/components/LanguageToggle";
import { EventPortalLoading } from "@/components/event/EventPortalLoading";

const GuestDashboard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const eventSlug = searchParams.get("event_slug");
  const [teamType, setTeamType] = useState<"personal" | "professional" | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [eventId, setEventId] = useState<string | null>(null);

  const { people, loadPeople, loading: peopleLoading } = usePeople();
  const { vendors, loadVendors, loading: vendorsLoading } = useVendors();
  const { setCurrentEventId } = useCurrentEvent();

  const [loadingEvent, setLoadingEvent] = useState(true);

  useEffect(() => {
    const fetchEventId = async () => {
      setLoadingEvent(true);
      if (eventSlug) {
        const { supabase } = await import("@/integrations/supabase/client");
        const { data, error } = await supabase
          .from("events")
          .select("id")
          .eq("slug", eventSlug)
          .single();
        if (error || !data) {
          setLoadingEvent(false);
          navigate("/not-found", { replace: true });
          return;
        }
        setEventId(data.id);
        setCurrentEventId(data.id);
        await loadPeople();
        await loadVendors();
      }
      setLoadingEvent(false);
    };
    fetchEventId();
    // eslint-disable-next-line
  }, [eventSlug]);

  const handleTeamTypeSelect = (type: "personal" | "professional") => {
    setTeamType(type);
    setSelectedUserId("");
  };

  const handleContinue = () => {
    if (!selectedUserId || !teamType || !eventId) return;
    const userType = teamType === "personal" ? "person" : "vendor";
    let name = "";
    if (userType === "person") {
      const person = people.find((p) => p.id === selectedUserId);
      name = person?.name || "";
    } else {
      const vendor = vendors.find((v) => v.id === selectedUserId);
      name = vendor?.name || "";
    }

    // On stocke le user directement dans localStorage (pour auto-login)
    const userData = { id: selectedUserId, name, type: userType };
    localStorage.setItem("eventPortalUser", JSON.stringify(userData));

    // Redirige vers event-portal avec auto_login
    // Doit contenir tous les params nécessaires
    let url = `/event-portal?user_type=${userType}&user_id=${selectedUserId}&event_slug=${eventSlug}&auto_login=true`;

    navigate(url);
  };

  const handleBack = () => {
    setTeamType(null);
    setSelectedUserId("");
  };

  const filteredPeople = people.filter((p) => p.event_id === eventId);
  const filteredVendors = vendors.filter((v) => v.event_id === eventId);

  if (loadingEvent || peopleLoading || vendorsLoading) {
    return <EventPortalLoading fullScreen message="Chargement de l'événement..." details={null} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <LanguageToggle />
      </div>

      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Users className="w-6 h-6 text-purple-600" />
            Accès Jour J
          </CardTitle>
          <CardDescription>
            Sélectionnez votre équipe et votre nom pour accéder à votre planning personnalisé. Ce lien est public : seul le nom/la personne permet d’accéder au bon planning.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 py-2">
          {!teamType ? (
            <div className="space-y-4">
              <Button
                variant="outline"
                onClick={() => handleTeamTypeSelect("personal")}
                className="w-full flex items-center gap-3 border-purple-200 hover:bg-purple-50"
              >
                <Users className="w-5 h-5 text-purple-600" />
                Équipe personnelle
              </Button>
              <Button
                variant="outline"
                onClick={() => handleTeamTypeSelect("professional")}
                className="w-full flex items-center gap-3 border-purple-200 hover:bg-purple-50"
              >
                <Building2 className="w-5 h-5 text-purple-600" />
                Équipe professionnelle
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Button variant="ghost" size="sm" onClick={handleBack} className="text-purple-600 hover:text-purple-700 px-0">
                ← Retour
              </Button>
              <label className="text-sm font-medium">
                {teamType === "personal" ? "Sélectionnez votre nom :" : "Sélectionnez votre prestataire :"}
              </label>
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={teamType === "personal"
                      ? "Choisir une personne..."
                      : "Choisir un prestataire..."}
                  />
                </SelectTrigger>
                <SelectContent>
                  {teamType === "personal"
                    ? filteredPeople.length > 0
                      ? filteredPeople.map((person) => (
                          <SelectItem key={person.id} value={person.id}>
                            {person.name}
                            {person.role ? (
                              <span className="ml-2 text-xs text-gray-500">{person.role}</span>
                            ) : null}
                          </SelectItem>
                        ))
                      : <SelectItem value="no-people" disabled>Aucune personne disponible</SelectItem>
                    : filteredVendors.length > 0
                    ? filteredVendors.map((vendor) => (
                        <SelectItem key={vendor.id} value={vendor.id}>
                          {vendor.name}
                          {vendor.service_type ? (
                            <span className="ml-2 text-xs text-gray-500">{vendor.service_type}</span>
                          ) : null}
                        </SelectItem>
                      ))
                    : <SelectItem value="no-vendors" disabled>Aucun prestataire disponible</SelectItem>
                  }
                </SelectContent>
              </Select>
              <Button
                onClick={handleContinue}
                disabled={!selectedUserId || selectedUserId === "no-people" || selectedUserId === "no-vendors"}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Accéder à mon planning du jour J
              </Button>
            </div>
          )}
          <div className="text-xs text-center text-gray-500 space-y-1 pt-5">
            <p>Ce lien public ne nécessite pas de mot de passe.</p>
            <p>Accès direct et personnalisé selon la sélection.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GuestDashboard;

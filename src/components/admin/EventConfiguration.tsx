
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, MapPin, Users, Settings } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const EventConfiguration = () => {
  const [eventDate, setEventDate] = useState<Date>();
  const [settings, setSettings] = useState({
    notifications: true,
    realTimeSync: true,
    guestAccess: false,
    autoBackup: true
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Configuration Événement</h2>
        <p className="text-gray-600">Paramétrez votre événement et ses options</p>
      </div>

      {/* Event Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Détails de l'Événement
          </CardTitle>
          <CardDescription>Informations principales de votre événement</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="event-name">Nom de l'événement</Label>
              <Input id="event-name" placeholder="Mariage Sarah & James" defaultValue="Mariage Sarah & James" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="event-type">Type d'événement</Label>
              <Select defaultValue="wedding">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wedding">Mariage</SelectItem>
                  <SelectItem value="birthday">Anniversaire</SelectItem>
                  <SelectItem value="corporate">Événement Corporate</SelectItem>
                  <SelectItem value="private">Événement Privé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date de l'événement</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {eventDate ? format(eventDate, "PPP", { locale: fr }) : "Sélectionner une date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={eventDate}
                    onSelect={setEventDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="event-time">Heure de début</Label>
              <Input id="event-time" type="time" defaultValue="14:00" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="event-location">Lieu de l'événement</Label>
            <div className="flex gap-2">
              <Input 
                id="event-location" 
                placeholder="Château de Malmaison, 92500 Rueil-Malmaison" 
                defaultValue="Château de Malmaison, 92500 Rueil-Malmaison"
                className="flex-1"
              />
              <Button variant="outline">
                <MapPin className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="event-description">Description</Label>
            <Textarea 
              id="event-description" 
              placeholder="Description de votre événement"
              defaultValue="Célébration du mariage de Sarah et James avec leurs proches dans un cadre exceptionnel."
            />
          </div>
        </CardContent>
      </Card>

      {/* Role Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Configuration des Rôles
          </CardTitle>
          <CardDescription>Personnalisez les rôles disponibles pour votre événement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-sm font-medium text-gray-700 mb-3">Rôles actifs :</div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                'Mariée', 'Marié', 'Témoin', 'Demoiselle d\'honneur',
                'Wedding Planner', 'Photographe', 'Traiteur', 'Invité'
              ].map((role) => (
                <div key={role} className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm">{role}</span>
                  <Switch defaultChecked />
                </div>
              ))}
            </div>
            
            <Button variant="outline" className="w-full mt-4">
              <Users className="w-4 h-4 mr-2" />
              Ajouter un rôle personnalisé
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* System Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Paramètres Système
          </CardTitle>
          <CardDescription>Options de fonctionnement de l'application</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Notifications en temps réel</div>
              <div className="text-sm text-gray-600">Recevoir des alertes instantanées</div>
            </div>
            <Switch 
              checked={settings.notifications}
              onCheckedChange={(checked) => setSettings({...settings, notifications: checked})}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Synchronisation temps réel</div>
              <div className="text-sm text-gray-600">Mise à jour automatique des données</div>
            </div>
            <Switch 
              checked={settings.realTimeSync}
              onCheckedChange={(checked) => setSettings({...settings, realTimeSync: checked})}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Accès invités</div>
              <div className="text-sm text-gray-600">Permettre aux invités de voir certaines informations</div>
            </div>
            <Switch 
              checked={settings.guestAccess}
              onCheckedChange={(checked) => setSettings({...settings, guestAccess: checked})}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Sauvegarde automatique</div>
              <div className="text-sm text-gray-600">Backup quotidien des données</div>
            </div>
            <Switch 
              checked={settings.autoBackup}
              onCheckedChange={(checked) => setSettings({...settings, autoBackup: checked})}
            />
          </div>
        </CardContent>
      </Card>

      {/* Branding */}
      <Card>
        <CardHeader>
          <CardTitle>Personnalisation</CardTitle>
          <CardDescription>Thème et branding de votre événement</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Couleur principale</Label>
            <div className="flex gap-2">
              <div className="w-10 h-10 bg-purple-500 rounded-lg border-2 border-purple-600"></div>
              <div className="w-10 h-10 bg-pink-500 rounded-lg border"></div>
              <div className="w-10 h-10 bg-blue-500 rounded-lg border"></div>
              <div className="w-10 h-10 bg-green-500 rounded-lg border"></div>
              <div className="w-10 h-10 bg-amber-500 rounded-lg border"></div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo">Logo de l'événement</Label>
            <Input id="logo" type="file" accept="image/*" />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
          Sauvegarder la Configuration
        </Button>
      </div>
    </div>
  );
};

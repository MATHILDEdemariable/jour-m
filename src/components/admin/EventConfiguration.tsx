
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, MapPin, Users, Settings, Save, Plus, X } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useEventConfiguration } from '@/hooks/useEventConfiguration';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const EventConfiguration = () => {
  const [eventDate, setEventDate] = useState<Date>();
  const [eventData, setEventData] = useState({
    name: 'Mariage Sarah & James',
    event_type: 'wedding',
    location: 'Château de Malmaison, 92500 Rueil-Malmaison',
    description: 'Célébration du mariage de Sarah et James avec leurs proches dans un cadre exceptionnel.',
    start_time: '14:00'
  });
  const [loading, setLoading] = useState(false);
  const [eventId] = useState('default-event-id'); // In a real app, this would come from context or props
  const [newRoleName, setNewRoleName] = useState('');
  const [isAddingRole, setIsAddingRole] = useState(false);
  
  const { configuration, roles, saveConfiguration, updateRole, addRole } = useEventConfiguration(eventId);
  const { toast } = useToast();

  // Auto-save function with debounce
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleAutoSave = (field: string, value: any) => {
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
    }
    
    const timeout = setTimeout(() => {
      handleSaveEvent(true);
    }, 1000); // Auto-save après 1 seconde d'inactivité
    
    setAutoSaveTimeout(timeout);
  };

  const handleEventDataChange = (field: string, value: string) => {
    setEventData(prev => ({ ...prev, [field]: value }));
    handleAutoSave(field, value);
  };

  const handleSaveEvent = async (isAutoSave = false) => {
    setLoading(true);
    try {
      // Save event details
      const { error: eventError } = await supabase
        .from('events')
        .upsert({
          id: eventId,
          name: eventData.name,
          event_type: eventData.event_type,
          event_date: eventDate?.toISOString().split('T')[0] || '2024-06-15',
          start_time: eventData.start_time,
          location: eventData.location,
          description: eventData.description,
          status: 'planning'
        });

      if (eventError) throw eventError;

      // Save configuration
      if (configuration) {
        await saveConfiguration(configuration);
      }

      if (!isAutoSave) {
        toast({
          title: "Configuration sauvegardée",
          description: "Tous les paramètres ont été enregistrés avec succès",
        });
      }
    } catch (error) {
      console.error('Error saving:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la configuration",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleToggle = (roleId: string, isActive: boolean) => {
    updateRole(roleId, { is_active: isActive });
  };

  const handleAddCustomRole = async () => {
    if (newRoleName.trim()) {
      await addRole(newRoleName.trim());
      setNewRoleName('');
      setIsAddingRole(false);
    }
  };

  const eventTypes = [
    { value: 'wedding', label: 'Mariage' },
    { value: 'pacs', label: 'PACS' },
    { value: 'birthday', label: 'Anniversaire' },
    { value: 'corporate', label: 'Événement Corporate' },
    { value: 'other', label: 'Autres' }
  ];

  const themeColors = [
    { color: '#9333ea', name: 'Violet' },
    { color: '#ec4899', name: 'Rose' },
    { color: '#3b82f6', name: 'Bleu' },
    { color: '#10b981', name: 'Vert' },
    { color: '#f59e0b', name: 'Orange' }
  ];

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
            <CalendarIcon className="w-5 h-5" />
            Détails de l'Événement
          </CardTitle>
          <CardDescription>Informations principales de votre événement</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="event-name">Nom de l'événement</Label>
              <Input 
                id="event-name" 
                value={eventData.name}
                onChange={(e) => handleEventDataChange('name', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="event-type">Type d'événement</Label>
              <Select 
                value={eventData.event_type} 
                onValueChange={(value) => handleEventDataChange('event_type', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date de l'événement</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !eventDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {eventDate ? format(eventDate, "PPP", { locale: fr }) : "Sélectionner une date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={eventDate}
                    onSelect={(date) => {
                      setEventDate(date);
                      if (date) handleAutoSave('event_date', date);
                    }}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="event-time">Heure de début</Label>
              <Input 
                id="event-time" 
                type="time" 
                value={eventData.start_time}
                onChange={(e) => handleEventDataChange('start_time', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="event-location">Lieu de l'événement</Label>
            <div className="flex gap-2">
              <Input 
                id="event-location" 
                value={eventData.location}
                onChange={(e) => handleEventDataChange('location', e.target.value)}
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
              value={eventData.description}
              onChange={(e) => handleEventDataChange('description', e.target.value)}
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
              {roles.map((role) => (
                <div key={role.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm capitalize">{role.role_name.replace('-', ' ')}</span>
                  <Switch 
                    checked={role.is_active}
                    onCheckedChange={(checked) => role.id && handleRoleToggle(role.id, checked)}
                  />
                </div>
              ))}
            </div>
            
            {/* Add Custom Role */}
            {isAddingRole ? (
              <div className="flex gap-2 items-center">
                <Input
                  placeholder="Nom du rôle personnalisé"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleAddCustomRole} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setIsAddingRole(false);
                    setNewRoleName('');
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline" 
                className="w-full mt-4" 
                onClick={() => setIsAddingRole(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un rôle personnalisé
              </Button>
            )}
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
          {configuration && (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Notifications en temps réel</div>
                  <div className="text-sm text-gray-600">Recevoir des alertes instantanées</div>
                </div>
                <Switch 
                  checked={configuration.notifications_enabled}
                  onCheckedChange={(checked) => saveConfiguration({notifications_enabled: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Synchronisation temps réel</div>
                  <div className="text-sm text-gray-600">Mise à jour automatique des données</div>
                </div>
                <Switch 
                  checked={configuration.realtime_sync_enabled}
                  onCheckedChange={(checked) => saveConfiguration({realtime_sync_enabled: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Accès invités</div>
                  <div className="text-sm text-gray-600">Permettre aux invités de voir certaines informations</div>
                </div>
                <Switch 
                  checked={configuration.guest_access_enabled}
                  onCheckedChange={(checked) => saveConfiguration({guest_access_enabled: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Sauvegarde automatique</div>
                  <div className="text-sm text-gray-600">Backup quotidien des données</div>
                </div>
                <Switch 
                  checked={configuration.auto_backup_enabled}
                  onCheckedChange={(checked) => saveConfiguration({auto_backup_enabled: checked})}
                />
              </div>
            </>
          )}
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
              {themeColors.map((theme) => (
                <button
                  key={theme.color}
                  className={cn(
                    "w-10 h-10 rounded-lg border-2 transition-all",
                    configuration?.theme_color === theme.color 
                      ? "border-gray-800 scale-110" 
                      : "border-gray-300 hover:scale-105"
                  )}
                  style={{ backgroundColor: theme.color }}
                  onClick={() => saveConfiguration({ theme_color: theme.color })}
                  title={theme.name}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo">Logo de l'événement</Label>
            <Input id="logo" type="file" accept="image/*" />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Sauvegarde automatique activée
        </div>
        <Button 
          onClick={() => handleSaveEvent(false)}
          disabled={loading}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Sauvegarde...' : 'Sauvegarder Maintenant'}
        </Button>
      </div>
    </div>
  );
};

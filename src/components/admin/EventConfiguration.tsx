
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Settings, Palette, Bell, Shield, Database, Plus, X } from 'lucide-react';
import { useLocalEventData } from '@/contexts/LocalEventDataContext';
import { useToast } from '@/hooks/use-toast';

export const EventConfiguration = () => {
  const { currentEvent, updateEvent } = useLocalEventData();
  const { toast } = useToast();
  const [customRoles, setCustomRoles] = useState<string[]>([]);
  const [newRole, setNewRole] = useState('');

  // Configuration par défaut
  const [config, setConfig] = useState({
    theme_color: currentEvent?.theme_color || '#9333ea',
    notifications_enabled: true,
    realtime_sync_enabled: true,
    guest_access_enabled: false,
    auto_backup_enabled: true,
  });

  const handleSaveConfiguration = async () => {
    try {
      if (currentEvent) {
        await updateEvent(currentEvent.id, {
          theme_color: config.theme_color,
        });
      }

      toast({
        title: "Configuration sauvegardée",
        description: "Les paramètres ont été mis à jour avec succès",
      });
    } catch (error) {
      console.error('Error saving configuration:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la configuration",
        variant: "destructive",
      });
    }
  };

  const addCustomRole = () => {
    if (newRole.trim() && !customRoles.includes(newRole.trim())) {
      setCustomRoles([...customRoles, newRole.trim()]);
      setNewRole('');
    }
  };

  const removeCustomRole = (role: string) => {
    setCustomRoles(customRoles.filter(r => r !== role));
  };

  const defaultRoles = [
    { id: 'bride', label: 'Mariée', active: true },
    { id: 'groom', label: 'Marié', active: true },
    { id: 'best-man', label: 'Témoin', active: true },
    { id: 'maid-of-honor', label: 'Demoiselle d\'honneur', active: true },
    { id: 'wedding-planner', label: 'Wedding Planner', active: true },
    { id: 'photographer', label: 'Photographe', active: true },
    { id: 'family', label: 'Famille', active: true },
    { id: 'guest', label: 'Invité', active: true },
  ];

  if (!currentEvent) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Configuration de l'Événement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Veuillez d'abord sélectionner un événement.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">⚙️ Configuration de l'Événement</h2>
        <p className="text-sm text-gray-600">Configurez les paramètres de votre événement</p>
      </div>

      {/* Informations de base */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            Informations de base
          </CardTitle>
          <CardDescription>
            Informations principales de votre événement
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="event-name">Nom de l'événement</Label>
              <Input 
                id="event-name" 
                value={currentEvent.name} 
                onChange={(e) => updateEvent(currentEvent.id, { name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="event-type">Type d'événement</Label>
              <Select 
                value={currentEvent.event_type} 
                onValueChange={(value) => updateEvent(currentEvent.id, { event_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mariage">Mariage</SelectItem>
                  <SelectItem value="anniversaire">Anniversaire</SelectItem>
                  <SelectItem value="entreprise">Événement d'entreprise</SelectItem>
                  <SelectItem value="bapteme">Baptême</SelectItem>
                  <SelectItem value="autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="event-date">Date de l'événement</Label>
              <Input 
                id="event-date" 
                type="date" 
                value={currentEvent.event_date?.split('T')[0]} 
                onChange={(e) => updateEvent(currentEvent.id, { event_date: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="location">Lieu</Label>
              <Input 
                id="location" 
                value={currentEvent.location || ''} 
                onChange={(e) => updateEvent(currentEvent.id, { location: e.target.value })}
                placeholder="Lieu de l'événement"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              value={currentEvent.description || ''} 
              onChange={(e) => updateEvent(currentEvent.id, { description: e.target.value })}
              placeholder="Description de l'événement"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Apparence */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-purple-600" />
            Apparence et thème
          </CardTitle>
          <CardDescription>
            Personnalisez l'apparence de votre interface
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="theme-color">Couleur principale</Label>
            <div className="flex items-center gap-3 mt-2">
              <Input 
                id="theme-color" 
                type="color" 
                value={config.theme_color}
                onChange={(e) => setConfig(prev => ({ ...prev, theme_color: e.target.value }))}
                className="w-20 h-10"
              />
              <span className="text-sm text-gray-600">{config.theme_color}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rôles disponibles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            Rôles disponibles
          </CardTitle>
          <CardDescription>
            Gérez les rôles disponibles pour les membres de votre équipe
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-3">Rôles par défaut</h4>
            <div className="flex flex-wrap gap-2 mb-4">
              {defaultRoles.map((role) => (
                <Badge key={role.id} variant="secondary" className="px-3 py-1">
                  {role.label}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">Rôles personnalisés</h4>
            <div className="flex gap-2 mb-3">
              <Input 
                placeholder="Nouveau rôle..."
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCustomRole()}
              />
              <Button onClick={addCustomRole} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            {customRoles.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {customRoles.map((role) => (
                  <Badge key={role} variant="outline" className="px-3 py-1 gap-2">
                    {role}
                    <X 
                      className="w-3 h-3 cursor-pointer hover:text-red-500" 
                      onClick={() => removeCustomRole(role)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Paramètres avancés */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-purple-600" />
            Paramètres avancés
          </CardTitle>
          <CardDescription>
            Options de configuration avancées
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-gray-500" />
                <Label>Notifications en temps réel</Label>
              </div>
              <p className="text-sm text-gray-500">
                Recevoir des notifications pour les mises à jour importantes
              </p>
            </div>
            <Switch 
              checked={config.notifications_enabled}
              onCheckedChange={(checked) => setConfig(prev => ({ ...prev, notifications_enabled: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-gray-500" />
                <Label>Synchronisation temps réel</Label>
              </div>
              <p className="text-sm text-gray-500">
                Synchroniser automatiquement les données entre appareils
              </p>
            </div>
            <Switch 
              checked={config.realtime_sync_enabled}
              onCheckedChange={(checked) => setConfig(prev => ({ ...prev, realtime_sync_enabled: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-gray-500" />
                <Label>Accès invités</Label>
              </div>
              <p className="text-sm text-gray-500">
                Permettre aux invités d'accéder à certaines informations
              </p>
            </div>
            <Switch 
              checked={config.guest_access_enabled}
              onCheckedChange={(checked) => setConfig(prev => ({ ...prev, guest_access_enabled: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-gray-500" />
                <Label>Sauvegarde automatique</Label>
              </div>
              <p className="text-sm text-gray-500">
                Sauvegarder automatiquement les données régulièrement
              </p>
            </div>
            <Switch 
              checked={config.auto_backup_enabled}
              onCheckedChange={(checked) => setConfig(prev => ({ ...prev, auto_backup_enabled: checked }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSaveConfiguration}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          Sauvegarder la configuration
        </Button>
      </div>
    </div>
  );
};

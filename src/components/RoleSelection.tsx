
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LanguageToggle } from '@/components/LanguageToggle';
import { useSharedEventData } from '@/hooks/useSharedEventData';

interface RoleSelectionProps {
  onRoleSelect: (role: string, name: string) => void;
}

const ROLES = [
  { id: 'bride', color: 'bg-pink-100 text-pink-800' },
  { id: 'groom', color: 'bg-blue-100 text-blue-800' },
  { id: 'wedding-planner', color: 'bg-purple-100 text-purple-800' },
  { id: 'best-man', color: 'bg-emerald-100 text-emerald-800' },
  { id: 'maid-of-honor', color: 'bg-rose-100 text-rose-800' },
  { id: 'photographer', color: 'bg-amber-100 text-amber-800' },
  { id: 'caterer', color: 'bg-orange-100 text-orange-800' },
  { id: 'guest', color: 'bg-gray-100 text-gray-800' },
  { id: 'family', color: 'bg-green-100 text-green-800' },
];

export const RoleSelection: React.FC<RoleSelectionProps> = ({ onRoleSelect }) => {
  const { t } = useTranslation();
  const { people, loading } = useSharedEventData();
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedName, setSelectedName] = useState<string>('');

  const handleRoleChange = (roleId: string) => {
    setSelectedRole(roleId);
    setSelectedName('');
  };

  const handleSubmit = () => {
    if (selectedRole && selectedName) {
      onRoleSelect(selectedRole, selectedName);
    }
  };

  // Filtrer les personnes par rôle sélectionné
  const peopleForRole = selectedRole 
    ? people.filter(person => person.role === selectedRole)
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center p-4">
      {/* Language Toggle */}
      <div className="absolute top-4 right-4">
        <LanguageToggle />
      </div>

      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-2">
          <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Jour J
          </div>
          <CardTitle className="text-xl">{t('welcome_to_event')}</CardTitle>
          <CardDescription>
            {t('select_role_subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-medium">{t('i_am')}</label>
            <Select value={selectedRole} onValueChange={handleRoleChange} disabled={loading}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t('select_your_role')} />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    <div className="flex items-center gap-2">
                      <Badge className={role.color} variant="secondary">
                        {t(role.id)}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedRole && (
            <div className="space-y-3 animate-fade-in">
              <label className="text-sm font-medium">{t('my_name_is')}</label>
              <Select value={selectedName} onValueChange={setSelectedName} disabled={loading}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t('select_your_name')} />
                </SelectTrigger>
                <SelectContent>
                  {peopleForRole.length > 0 ? (
                    peopleForRole.map((person) => (
                      <SelectItem key={person.id} value={person.name}>
                        {person.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-sm text-gray-500 text-center">
                      {t('no_people_for_role')}
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          <Button 
            onClick={handleSubmit}
            disabled={!selectedRole || !selectedName || loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {t('enter_jour_j')}
          </Button>

          <div className="text-xs text-center text-gray-500 space-y-1">
            <p>{t('secure_simple')}</p>
            <p>{t('personalized_experience')}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

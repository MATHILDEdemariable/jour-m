
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface RoleSelectionProps {
  onRoleSelect: (role: string, name: string) => void;
}

const ROLES = [
  { id: 'bride', label: 'Bride', color: 'bg-rose-100 text-rose-800' },
  { id: 'groom', label: 'Groom', color: 'bg-blue-100 text-blue-800' },
  { id: 'wedding-planner', label: 'Wedding Planner', color: 'bg-emerald-100 text-emerald-800' },
  { id: 'best-man', label: 'Best Man', color: 'bg-emerald-100 text-emerald-800' },
  { id: 'maid-of-honor', label: 'Maid of Honor', color: 'bg-rose-100 text-rose-800' },
  { id: 'photographer', label: 'Photographer', color: 'bg-amber-100 text-amber-800' },
  { id: 'caterer', label: 'Caterer', color: 'bg-orange-100 text-orange-800' },
  { id: 'guest', label: 'Guest', color: 'bg-stone-100 text-stone-800' },
];

const NAMES_BY_ROLE = {
  'bride': ['Sarah', 'Emma', 'Sophie', 'Marie'],
  'groom': ['James', 'Michael', 'David', 'Thomas'],
  'wedding-planner': ['Patricia Wilson', 'Jennifer Events', 'Perfect Day Co.'],
  'best-man': ['Alex', 'Ryan', 'Chris', 'Mark'],
  'maid-of-honor': ['Jessica', 'Amanda', 'Lisa', 'Rachel'],
  'photographer': ['Studio Light', 'Moments Captured', 'Creative Lens'],
  'caterer': ['Gourmet Catering', 'Delicious Events', 'Fine Dining Co.'],
  'guest': ['Family Member', 'Friend', 'Plus One'],
};

export const RoleSelection: React.FC<RoleSelectionProps> = ({ onRoleSelect }) => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-stone-100 to-emerald-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg bg-stone-50 border-emerald-200">
        <CardHeader className="text-center space-y-2">
          <div className="text-4xl font-bold bg-gradient-to-r from-stone-800 via-emerald-800 to-stone-900 bg-clip-text text-transparent">
            Jour M
          </div>
          <CardTitle className="text-xl text-stone-900">Welcome to your event!</CardTitle>
          <CardDescription className="text-stone-600">
            Select your role to get started with personalized access
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-medium text-stone-800">I am the...</label>
            <Select value={selectedRole} onValueChange={handleRoleChange}>
              <SelectTrigger className="w-full bg-stone-100 border-stone-300">
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent className="bg-stone-50 border-emerald-200">
                {ROLES.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    <div className="flex items-center gap-2">
                      <Badge className={role.color} variant="secondary">
                        {role.label}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedRole && (
            <div className="space-y-3 animate-fade-in">
              <label className="text-sm font-medium text-stone-800">My name is...</label>
              <Select value={selectedName} onValueChange={setSelectedName}>
                <SelectTrigger className="w-full bg-stone-100 border-stone-300">
                  <SelectValue placeholder="Select your name" />
                </SelectTrigger>
                <SelectContent className="bg-stone-50 border-emerald-200">
                  {(NAMES_BY_ROLE[selectedRole as keyof typeof NAMES_BY_ROLE] || []).map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Button 
            onClick={handleSubmit}
            disabled={!selectedRole || !selectedName}
            className="w-full bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900 text-stone-100"
          >
            Enter Jour M
          </Button>

          <div className="text-xs text-center text-stone-500 space-y-1">
            <p>🔒 Secure & Simple - No passwords required</p>
            <p>✨ Personalized experience for your role</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

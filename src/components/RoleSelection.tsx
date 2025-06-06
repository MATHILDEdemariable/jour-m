
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface RoleSelectionProps {
  onRoleSelect: (role: string, name: string) => void;
}

const ROLES = [
  { id: 'bride', label: 'Bride', color: 'bg-pink-100 text-pink-800' },
  { id: 'groom', label: 'Groom', color: 'bg-blue-100 text-blue-800' },
  { id: 'wedding-planner', label: 'Wedding Planner', color: 'bg-purple-100 text-purple-800' },
  { id: 'best-man', label: 'Best Man', color: 'bg-emerald-100 text-emerald-800' },
  { id: 'maid-of-honor', label: 'Maid of Honor', color: 'bg-rose-100 text-rose-800' },
  { id: 'photographer', label: 'Photographer', color: 'bg-amber-100 text-amber-800' },
  { id: 'caterer', label: 'Caterer', color: 'bg-orange-100 text-orange-800' },
  { id: 'guest', label: 'Guest', color: 'bg-gray-100 text-gray-800' },
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-2">
          <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Jour J
          </div>
          <CardTitle className="text-xl">Welcome to your event!</CardTitle>
          <CardDescription>
            Select your role to get started with personalized access
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-medium">I am the...</label>
            <Select value={selectedRole} onValueChange={handleRoleChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
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
              <label className="text-sm font-medium">My name is...</label>
              <Select value={selectedName} onValueChange={setSelectedName}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select your name" />
                </SelectTrigger>
                <SelectContent>
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
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            Enter Jour J
          </Button>

          <div className="text-xs text-center text-gray-500 space-y-1">
            <p>🔒 Secure & Simple - No passwords required</p>
            <p>✨ Personalized experience for your role</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail } from 'lucide-react';
import { useSharedEventData } from '@/hooks/useSharedEventData';

interface PersonLoginProps {
  onLogin: (personId: string, personName: string) => void;
}

export const PersonLogin: React.FC<PersonLoginProps> = ({ onLogin }) => {
  const [selectedMethod, setSelectedMethod] = useState<'name' | 'email'>('name');
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  const { people, loading } = useSharedEventData();

  const handleLogin = () => {
    if (!inputValue.trim()) {
      setError('Veuillez entrer votre nom ou email');
      return;
    }

    const person = people.find(p => {
      if (selectedMethod === 'email') {
        return p.email.toLowerCase() === inputValue.toLowerCase();
      } else {
        return p.name.toLowerCase().includes(inputValue.toLowerCase());
      }
    });

    if (person) {
      onLogin(person.id, person.name);
      setError('');
    } else {
      setError(`Aucune personne trouvée avec ce ${selectedMethod === 'email' ? 'email' : 'nom'}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Connexion Event Portal
          </CardTitle>
          <p className="text-gray-600">Identifiez-vous pour accéder à votre planning personnel</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Method Selection */}
          <div className="flex gap-2">
            <Button
              variant={selectedMethod === 'name' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedMethod('name')}
              className={`flex-1 ${selectedMethod === 'name' ? 'bg-gradient-to-r from-purple-600 to-pink-600' : ''}`}
            >
              <User className="w-4 h-4 mr-2" />
              Par nom
            </Button>
            <Button
              variant={selectedMethod === 'email' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedMethod('email')}
              className={`flex-1 ${selectedMethod === 'email' ? 'bg-gradient-to-r from-purple-600 to-pink-600' : ''}`}
            >
              <Mail className="w-4 h-4 mr-2" />
              Par email
            </Button>
          </div>

          {/* Input */}
          <div className="space-y-2">
            <Label htmlFor="login-input">
              {selectedMethod === 'email' ? 'Votre email' : 'Votre nom'}
            </Label>
            <Input
              id="login-input"
              type={selectedMethod === 'email' ? 'email' : 'text'}
              placeholder={selectedMethod === 'email' ? 'exemple@email.com' : 'Entrez votre nom'}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              className="border-purple-200 focus:border-purple-500"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          {/* Login Button */}
          <Button
            onClick={handleLogin}
            disabled={loading || !inputValue.trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {loading ? 'Chargement...' : 'Se connecter'}
          </Button>

          {/* Available People Preview */}
          {people.length > 0 && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Personnes disponibles :</h4>
              <div className="space-y-1">
                {people.slice(0, 5).map(person => (
                  <div key={person.id} className="text-xs text-gray-600">
                    {person.name} {person.email && `(${person.email})`}
                  </div>
                ))}
                {people.length > 5 && (
                  <div className="text-xs text-gray-500">+{people.length - 5} autres...</div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

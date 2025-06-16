
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useMagicWordAuth } from '@/hooks/useMagicWordAuth';
import { KeyRound, Users, ArrowLeft } from 'lucide-react';

const MagicAccess = () => {
  const [magicWord, setMagicWord] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { loading, error, loginWithMagicWord } = useMagicWordAuth();

  useEffect(() => {
    // Pré-remplir si le code est dans l'URL
    const prefilledMagic = searchParams.get('magic');
    if (prefilledMagic) {
      setMagicWord(prefilledMagic.toUpperCase());
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!magicWord.trim()) {
      toast({
        title: 'Code manquant',
        description: 'Veuillez saisir un code d\'accès',
        variant: 'destructive',
      });
      return;
    }

    const success = await loginWithMagicWord(magicWord.toUpperCase());
    if (success) {
      toast({
        title: 'Accès autorisé',
        description: 'Redirection vers l\'équipe...',
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().slice(0, 20);
    setMagicWord(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-full">
              <Users className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Rejoindre l'Équipe
          </h1>
          <p className="text-gray-600">
            Saisissez votre code d'accès pour accéder au planning de l'événement
          </p>
        </div>

        {/* Formulaire */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <KeyRound className="w-5 h-5 text-purple-500" />
              Code d'Accès
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="magic-word">Code d'accès</Label>
                <Input
                  id="magic-word"
                  type="text"
                  value={magicWord}
                  onChange={handleInputChange}
                  placeholder="Ex: MARIAGE2025"
                  className="text-center font-mono text-lg tracking-wider uppercase"
                  maxLength={20}
                  autoComplete="off"
                  autoFocus
                />
                <p className="text-xs text-gray-500">
                  Saisissez le code fourni par l'organisateur
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading || !magicWord.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {loading ? 'Vérification...' : 'Accéder à l\'Équipe'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Retour */}
        <div className="text-center mt-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à l'accueil
          </Button>
        </div>

        {/* Info */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            Vous n'avez pas de code ? Contactez l'organisateur de l'événement
          </p>
        </div>
      </div>
    </div>
  );
};

export default MagicAccess;

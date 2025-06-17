
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useMagicWordAuth } from '@/hooks/useMagicWordAuth';

const AuthPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("signin");
  const [magicInput, setMagicInput] = useState('');
  const { loading: magicLoading, error: magicError, loginWithMagicWord } = useMagicWordAuth();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signUp(email, password, fullName);

    if (error) {
      toast({ title: 'Erreur d\'inscription', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Inscription réussie!', description: 'Compte créé avec succès.' });
      navigate('/dashboard');
    }
    setLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);

    if (error) {
      toast({ title: 'Erreur de connexion', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Connexion réussie!', description: 'Redirection...' });
      navigate('/dashboard');
    }
    setLoading(false);
  };

  const handleQuickAccess = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-yellow-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm shadow-xl border-0">
        <CardHeader className="text-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Bienvenue sur JOURM
          </h1>
          <CardDescription>Connectez-vous, créez un compte ou accédez directement !</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="signin">Se connecter</TabsTrigger>
              <TabsTrigger value="signup">S'inscrire</TabsTrigger>
              <TabsTrigger value="magic">Accès rapide</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="email-signin">Email</Label>
                  <Input id="email-signin" type="email" placeholder="m@exemple.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-signin">Mot de passe</Label>
                  <Input id="password-signin" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600" disabled={loading}>
                  {loading ? 'Connexion...' : 'Se connecter'}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4 pt-4">
                 <div className="space-y-2">
                  <Label htmlFor="fullname-signup">Nom complet</Label>
                  <Input id="fullname-signup" type="text" placeholder="John Doe" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-signup">Email</Label>
                  <Input id="email-signup" type="email" placeholder="m@exemple.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-signup">Mot de passe</Label>
                  <Input id="password-signup" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600" disabled={loading}>
                  {loading ? 'Création du compte...' : 'S\'inscrire'}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="magic">
              <div className="space-y-4 pt-8">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-4">Accédez directement à l'application sans inscription</p>
                  <Button 
                    onClick={handleQuickAccess}
                    className="w-full bg-gradient-to-r from-purple-700 to-pink-600"
                  >
                    Accès rapide
                  </Button>
                </div>
                
                <div className="text-center">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-muted-foreground">ou</span>
                    </div>
                  </div>
                </div>

                <form
                  className="space-y-4"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    await loginWithMagicWord(magicInput.trim().toUpperCase());
                  }}>
                  <div className="space-y-2">
                    <Label htmlFor="magic-input">Mot magique</Label>
                    <Input
                      id="magic-input"
                      value={magicInput}
                      onChange={e => setMagicInput(e.target.value)}
                      placeholder="Ex: MAGIC2025"
                      className="font-mono tracking-wider uppercase"
                    />
                  </div>
                  <Button type="submit"
                       disabled={magicInput.length < 3 || magicLoading}
                       className="w-full bg-gradient-to-r from-purple-700 to-pink-600"
                  >
                    {magicLoading ? "Connexion..." : "Accéder avec le mot magique"}
                  </Button>
                  {magicError &&
                    <p className="text-xs text-red-600">{magicError}</p>
                  }
                </form>
              </div>
              <div className="text-xs text-center mt-5 text-stone-500">
                Si vous avez reçu un "mot magique", entrez-le ici pour accéder à l'événement associé.
              </div>
            </TabsContent>
          </Tabs>
          <div className="mt-4 text-center">
            <Button variant="link" className="text-stone-600 font-normal" onClick={() => navigate('/')}>
              Retour à l'accueil
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;

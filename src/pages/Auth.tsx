import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useMagicWordAuth } from '@/hooks/useMagicWordAuth';

const AuthPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("signin"); // Track current tab
  const [magicInput, setMagicInput] = useState('');
  const { loading: magicLoading, error: magicError, loginWithMagicWord } = useMagicWordAuth();

  // Nouveau: état et logique pour reset password
  const [resetRequested, setResetRequested] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: `${window.location.origin}/`,
      },
    });

    if (error) {
      toast({ title: 'Erreur d\'inscription', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Inscription réussie!', description: 'Veuillez vérifier votre e-mail pour confirmer votre compte.' });
      // Clear fields
      setEmail('');
      setPassword('');
      setFullName('');
    }
    setLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({ title: 'Erreur de connexion', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Connexion réussie!', description: 'Redirection...' });
      navigate('/dashboard');
    }
    setLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail || email, {
      redirectTo: window.location.origin + '/auth'
    });
    if (error) {
      toast({ title: 'Échec', description: error.message, variant: 'destructive' });
    } else {
      setResetRequested(true);
      toast({ title: 'Lien envoyé', description: 'Un e-mail a été envoyé pour réinitialiser votre mot de passe.' });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-yellow-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm shadow-xl border-0">
        <CardHeader className="text-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Bienvenue sur JOURM
          </h1>
          <CardDescription>Connectez-vous, créez un compte ou utilisez un mot magique !</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Extensible tab navigation */}
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="signin">Se connecter</TabsTrigger>
              <TabsTrigger value="signup">S'inscrire</TabsTrigger>
              <TabsTrigger value="magic">Accès par mot magique</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              {resetRequested ? (
                <div className="py-8">
                  <p className="text-center text-green-700">Vérifiez votre boîte mail pour changer votre mot de passe.</p>
                </div>
              ) : (
                <form onSubmit={handleSignIn} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-signin">Email</Label>
                    <Input id="email-signin" type="email" placeholder="m@exemple.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-signin">Mot de passe</Label>
                    <Input id="password-signin" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600" disabled={loading}>
                      {loading ? 'Connexion...' : 'Se connecter'}
                    </Button>
                  </div>
                  <div className="text-xs text-right mt-2">
                    <button
                      type="button"
                      className="text-purple-600 hover:underline"
                      onClick={() => setResetRequested(true)}
                    >
                      Mot de passe oublié&nbsp;?
                    </button>
                  </div>
                </form>
              )}
              {resetRequested && (
                <form onSubmit={handleForgotPassword} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="forgot-email">Votre email</Label>
                    <Input
                      id="forgot-email"
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600" disabled={loading}>
                    Envoyer le lien de réinitialisation
                  </Button>
                  <div className="text-center">
                    <button type="button" className="text-stone-600 hover:underline text-xs mt-2" onClick={() => setResetRequested(false)}>
                      Retour à la connexion
                    </button>
                  </div>
                </form>
              )}
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
              <form
                className="space-y-4 pt-8"
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
                    autoFocus
                    required
                    placeholder="Ex: INVITEROSES24"
                    className="font-mono tracking-wider uppercase"
                  />
                </div>
                <Button type="submit"
                     disabled={magicInput.length < 3 || magicLoading}
                     className="w-full bg-gradient-to-r from-purple-700 to-pink-600"
                >
                  {magicLoading ? "Connexion..." : "Accéder"}
                </Button>
                {magicError &&
                  <p className="text-xs text-red-600">{magicError}</p>
                }
                <div className="text-center">
                  <Button type="button" variant="link" size="sm" onClick={() => setTab("signin")}>
                    Retour à la connexion classique
                  </Button>
                </div>
              </form>
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

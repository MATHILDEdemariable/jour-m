
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { Eye, EyeOff, ArrowLeft, CheckCircle, Sparkles } from 'lucide-react';

const AuthPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, signUp, isLoading, resendConfirmation } = useAuth();
  const { isAuthenticated, isLoading: authLoading } = useSupabaseAuth();
  const [searchParams] = useSearchParams();
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [tab, setTab] = useState("signin");
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [lastSigninError, setLastSigninError] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);

  // Check for creation intent
  const isCreationFlow = searchParams.get('action') === 'create' || localStorage.getItem('create_event_intent') === 'true';

  // Handle authentication state changes and redirections
  useEffect(() => {
    console.log('Auth page - Auth state:', { isAuthenticated, authLoading });
    
    if (!authLoading && isAuthenticated) {
      console.log('Auth page - User authenticated, initiating redirection');
      
      // Check if user came from creation flow
      const createEventIntent = localStorage.getItem('create_event_intent');
      if (createEventIntent === 'true') {
        console.log('Auth page - Creation intent detected, redirecting to portal with setup');
        navigate('/portal?setup=true&tab=config', { replace: true });
      } else {
        console.log('Auth page - Regular login, redirecting to portal');
        navigate('/portal', { replace: true });
      }
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    // If coming from creation flow, default to signup
    if (isCreationFlow) {
      setTab('signup');
    }
  }, [isCreationFlow]);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFullName('');
    setSignupSuccess(false);
    setLastSigninError(null);
  };

  const handleResendConfirmation = async () => {
    if (!email) {
      toast({
        title: 'Email requis',
        description: 'Veuillez saisir votre adresse email',
        variant: 'destructive'
      });
      return;
    }

    setIsResending(true);
    try {
      const { error } = await resendConfirmation(email);
      if (error) {
        toast({
          title: 'Erreur',
          description: error.message || 'Impossible de renvoyer l\'email',
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Email envoyé !',
          description: 'Vérifiez votre boîte de réception',
        });
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue',
        variant: 'destructive'
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Auth page - Starting signup process...');
    
    if (!fullName.trim()) {
      toast({
        title: 'Nom requis',
        description: 'Veuillez saisir votre nom complet',
        variant: 'destructive'
      });
      return;
    }

    const { error } = await signUp(email, password, fullName);

    if (error) {
      console.error('Auth page - Signup error:', error);
      let message = 'Une erreur est survenue lors de l\'inscription';
      if (error.message.includes('already registered')) {
        message = 'Un compte existe déjà avec cette adresse email';
      } else if (error.message.includes('Password')) {
        message = 'Le mot de passe doit contenir au moins 6 caractères';
      } else if (error.message.includes('Invalid email')) {
        message = 'Adresse email invalide';
      } else if (error.message.includes('signup_disabled')) {
        message = 'Les inscriptions sont temporairement désactivées';
      }
      
      toast({
        title: 'Erreur d\'inscription',
        description: message,
        variant: 'destructive'
      });
    } else {
      console.log('Auth page - Signup successful, showing success state');
      setSignupSuccess(true);
      toast({
        title: 'Inscription réussie !',
        description: 'Vérifiez votre email pour confirmer votre compte',
      });
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Auth page - Starting signin process...');
    setLastSigninError(null);
    
    const { error } = await signIn(email, password);

    if (error) {
      console.error('Auth page - Signin error:', error);
      let message = 'Email ou mot de passe incorrect';
      if (error.message.includes('Email not confirmed')) {
        message = 'Veuillez confirmer votre email avant de vous connecter';
        setLastSigninError('email_not_confirmed');
      } else if (error.message.includes('Invalid login')) {
        message = 'Email ou mot de passe incorrect';
      } else if (error.message.includes('Too many requests')) {
        message = 'Trop de tentatives. Veuillez patienter avant de réessayer.';
      }
      
      toast({
        title: 'Erreur de connexion',
        description: message,
        variant: 'destructive'
      });
    } else {
      console.log('Auth page - Signin successful, auth state will handle redirection');
      toast({
        title: 'Connexion réussie !',
        description: 'Redirection vers votre tableau de bord...',
      });
      // Don't manually navigate here - let useSupabaseAuth handle it
    }
  };

  const handleTabChange = (newTab: string) => {
    setTab(newTab);
    resetForm();
  };

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  if (signupSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                <CheckCircle className="text-2xl text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-green-600">
                  Inscription réussie !
                </CardTitle>
                <CardDescription className="text-gray-600 mt-2">
                  Un email de confirmation a été envoyé à {email}
                </CardDescription>
              </div>
            </CardHeader>
            
            <CardContent className="text-center space-y-4">
              <p className="text-sm text-gray-600">
                Cliquez sur le lien dans l'email pour activer votre compte et {isCreationFlow ? 'commencer à créer votre événement' : 'accéder à votre espace JOURM'}.
              </p>
              
              <div className="space-y-2">
                <Button
                  onClick={() => setSignupSuccess(false)}
                  variant="outline"
                  className="w-full"
                >
                  Retour à la connexion
                </Button>
                
                <Button
                  onClick={() => navigate('/')}
                  variant="link"
                  className="text-gray-600 hover:text-gray-800"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour à l'accueil
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center">
              {isCreationFlow ? (
                <Sparkles className="text-2xl text-white" />
              ) : (
                <span className="text-2xl font-bold text-white">J</span>
              )}
            </div>
            <div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {isCreationFlow ? 'Créer votre Jour-J' : 'JOURM'}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {isCreationFlow 
                  ? 'Commencez l\'organisation de votre mariage parfait'
                  : 'Organisez vos événements en toute simplicité'
                }
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent>
            <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin">Se connecter</TabsTrigger>
                <TabsTrigger value="signup">
                  {isCreationFlow ? 'Créer mon compte' : 'S\'inscrire'}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-signin">Email</Label>
                    <Input
                      id="email-signin"
                      type="email"
                      placeholder="votre@email.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-11"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password-signin">Mot de passe</Label>
                    <div className="relative">
                      <Input
                        id="password-signin"
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-11 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  {lastSigninError === 'email_not_confirmed' && (
                    <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                      <p className="text-sm text-orange-800 mb-3">
                        Votre email n'est pas encore confirmé. Vérifiez votre boîte de réception ou demandez un nouvel email.
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full border-orange-300 text-orange-700 hover:bg-orange-100"
                        onClick={handleResendConfirmation}
                        disabled={isResending}
                      >
                        {isResending ? 'Envoi en cours...' : 'Renvoyer l\'email de confirmation'}
                      </Button>
                    </div>
                  )}
                  
                  <Button
                    type="submit"
                    className="w-full h-11 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Connexion...' : 'Se connecter'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullname-signup">Nom complet</Label>
                    <Input
                      id="fullname-signup"
                      type="text"
                      placeholder="Jean Dupont"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="h-11"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email-signup">Email</Label>
                    <Input
                      id="email-signup"
                      type="email"
                      placeholder="votre@email.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-11"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password-signup">Mot de passe</Label>
                    <div className="relative">
                      <Input
                        id="password-signup"
                        type={showPassword ? "text" : "password"}
                        required
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-11 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">
                      Minimum 6 caractères
                    </p>
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full h-11 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Création du compte...' : (isCreationFlow ? 'Créer mon Jour-J' : 'Créer mon compte')}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6 text-center">
              <Button
                variant="link"
                className="text-gray-600 hover:text-gray-800"
                onClick={() => navigate('/')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour à l'accueil
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;

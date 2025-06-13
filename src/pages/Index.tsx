
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Users, 
  CheckCircle, 
  Star, 
  Crown, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Calendar,
      title: 'Planning intelligent',
      description: 'Organisez votre événement avec notre timeline interactive et nos suggestions IA'
    },
    {
      icon: Users,
      title: 'Gestion des invités',
      description: 'Suivez les confirmations, gérez les rôles et les informations de contact'
    },
    {
      icon: CheckCircle,
      title: 'Suivi des tâches',
      description: 'Ne manquez aucune étape avec notre système de tâches et rappels'
    }
  ];

  const plans = [
    {
      name: 'Gratuit',
      price: '0€',
      period: '/mois',
      features: [
        '1 événement',
        'Planning de base',
        'Gestion des invités',
        '100MB de stockage'
      ],
      cta: 'Commencer gratuitement',
      variant: 'outline' as const
    },
    {
      name: 'Premium',
      price: '9€',
      period: '/mois',
      features: [
        'Événements illimités',
        'Suggestions IA',
        'Timeline avancée',
        '5GB de stockage',
        'Support prioritaire'
      ],
      cta: 'Essayer Premium',
      variant: 'default' as const,
      popular: true
    },
    {
      name: 'Pro',
      price: '29€',
      period: '/mois',
      features: [
        'Toutes les fonctionnalités Premium',
        'White-label',
        'API access',
        '50GB de stockage',
        'Intégrations personnalisées'
      ],
      cta: 'Contactez-nous',
      variant: 'outline' as const
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Calendar className="w-8 h-8 text-purple-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Jour J
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate('/auth')}>
                Connexion
              </Button>
              <Button onClick={() => navigate('/auth')} className="bg-gradient-to-r from-purple-600 to-pink-600">
                Commencer
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 to-pink-50 pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Organisez vos événements{' '}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                parfaitement
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              La plateforme tout-en-un pour planifier, organiser et gérer vos événements avec une précision d'expert.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate('/auth')} className="bg-gradient-to-r from-purple-600 to-pink-600 text-lg px-8">
                Essayez gratuitement
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8">
                Voir la démo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tout ce dont vous avez besoin pour réussir
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Des outils puissants et intuitifs pour transformer votre vision en réalité
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 mx-auto bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Un plan pour chaque besoin
            </h2>
            <p className="text-xl text-gray-600">
              Commencez gratuitement, évoluez quand vous en avez besoin
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'ring-2 ring-purple-600 shadow-lg' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                      <Crown className="w-3 h-3 mr-1" />
                      Le plus populaire
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={plan.popular ? "w-full bg-gradient-to-r from-purple-600 to-pink-600" : "w-full"}
                    variant={plan.variant}
                    onClick={() => navigate('/auth')}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Prêt à organiser votre prochain événement ?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Rejoignez des milliers d'organisateurs qui font confiance à Jour J
          </p>
          <Button size="lg" onClick={() => navigate('/auth')} className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8">
            <Sparkles className="w-5 h-5 mr-2" />
            Commencer maintenant
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Calendar className="w-6 h-6 text-purple-400" />
              <span className="text-xl font-bold">Jour J</span>
            </div>
            <p className="text-gray-400">
              © 2025 Jour J. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;


import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const plans = [
  {
    name: 'Formule Libre',
    price: '49€',
    description: 'Pour les couples qui veulent garder le contrôle.',
    features: [
      'Application personnalisée à votre nom',
      'Checklists et planning 100% modifiables',
      'Gestion des invités et prestataires',
      'Suivi du budget',
    ],
    cta: 'Choisir Libre',
  },
  {
    name: 'Formule Sereine',
    price: '149€',
    description: 'L\'équilibre parfait entre autonomie et sérénité.',
    features: [
      'Tout de la formule Libre',
      'Notifications en temps réel pour l\'équipe',
      'Planning intelligent avec suggestions IA',
      'Support client par email & chat (+50€ en option)',
    ],
    cta: 'Choisir Sereine',
    highlighted: true,
  },
  {
    name: 'Formule Privilège',
    price: '799€',
    description: 'L\'expérience VIP pour une tranquillité absolue.',
    features: [
      'Tout de la formule Sereine',
      'Coordination avec vos prestataires',
      'Présence physique d\'un coordinateur le jour J',
      'Support client prioritaire inclus',
    ],
    cta: 'Choisir Privilège',
  },
];

const PricingSection = () => {
  const navigate = useNavigate();

  return (
    <section id="pricing" className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h3 className="text-3xl md:text-4xl font-bold text-stone-800">Une formule pour chaque couple</h3>
          <p className="text-stone-600 mt-4">
            Choisissez le plan qui correspond à vos besoins et à votre budget. Simple, transparent et sans engagement.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card key={plan.name} className={`flex flex-col ${plan.highlighted ? 'border-purple-500 shadow-lg' : ''}`}>
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="pt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-stone-500"> / événement</span>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-2 shrink-0 mt-1" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className={`w-full ${plan.highlighted ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : ''}`} variant={plan.highlighted ? 'default' : 'outline'} onClick={() => navigate('/auth')}>
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;

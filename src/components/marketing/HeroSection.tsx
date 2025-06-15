
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 md:py-32 bg-gradient-to-br from-sage-50 to-yellow-50">
      <div className="container mx-auto text-center px-4">
        <h2 className="text-4xl md:text-6xl font-extrabold text-stone-800 mb-4 tracking-tight">
          Votre mariage, parfaitement orchestré.
        </h2>
        <p className="text-lg md:text-xl text-stone-600 max-w-3xl mx-auto mb-8">
          De la checklist au jour J, JOURM est l'application qui centralise toute l'organisation de votre mariage pour une journée sans stress.
        </p>
        <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white" onClick={() => navigate('/auth')}>
          Commencez gratuitement
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;

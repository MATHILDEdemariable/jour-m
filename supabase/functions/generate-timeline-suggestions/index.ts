
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Generating timeline suggestions with OpenAI...');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Tu es un expert wedding planner et événementiel. Tu suggères des étapes du déroulé d\'une journée de mariage à la fois pour les mariés, invités et les professionnels qui organisent - le nom de cette étape ainsi que sa durée estimative et son assignation doit être suggérée.'
          },
          {
            role: 'user',
            content: 'Génère 5 nouvelles étapes créatives et détaillées pour un mariage qui ne sont pas déjà communes. Réponds uniquement avec un JSON array contenant des objets avec les propriétés: title (string), description (string), duration (number en minutes), category (string parmi: Préparation, Logistique, Cérémonie, Photos, Réception), priority (string: high, medium, low), assigned_role (string ou null), notes (string). Sois créatif et propose des étapes originales et professionnelles.'
          }
        ],
        temperature: 0.8,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenAI response received');
    
    const content = data.choices[0].message.content;
    
    // Parse the JSON response
    let suggestions;
    try {
      suggestions = JSON.parse(content);
    } catch (parseError) {
      console.log('Trying to extract JSON from response...');
      // If JSON parsing fails, try to extract JSON from the response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        suggestions = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Format de réponse invalide');
      }
    }

    console.log(`Successfully generated ${suggestions.length} suggestions`);

    return new Response(JSON.stringify({ suggestions }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-timeline-suggestions function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Erreur lors de la génération des suggestions' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});


import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { eventId } = await req.json();

    if (!eventId) {
      throw new Error('Un ID d\'événement est requis.');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error('Les variables d\'environnement Supabase ne sont pas configurées.');
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    console.log(`Réinitialisation des données pour l'événement ID: ${eventId}`);

    const tablesToClear = [
      'tasks', 'timeline_items', 'people', 'vendors',
      'event_configurations', 'event_roles', 'event_documents'
    ];

    for (const table of tablesToClear) {
      const { error: deleteError } = await supabaseAdmin
        .from(table)
        .delete()
        .eq('event_id', eventId);

      if (deleteError) {
        console.error(`Erreur lors de la suppression de ${table}:`, deleteError);
        throw new Error(`Échec de la suppression des données de ${table}: ${deleteError.message}`);
      }
    }
    
    console.log(`Suppression des documents du stockage pour l'événement: ${eventId}...`);
    const { data: files, error: listError } = await supabaseAdmin
      .storage
      .from('documents')
      .list(`events/${eventId}/documents`, { limit: 1000 });

    if (listError) {
      console.error('Erreur lors du listage des documents:', listError);
    }
    
    if (files && files.length > 0) {
      const filePaths = files.map(file => `events/${eventId}/documents/${file.name}`);
      const { error: removeError } = await supabaseAdmin
        .storage
        .from('documents')
        .remove(filePaths);

      if (removeError) {
        console.error('Erreur lors de la suppression des documents du stockage:', removeError);
      }
    }

    console.log(`Données réinitialisées avec succès pour l'événement ID: ${eventId}`);

    return new Response(JSON.stringify({ message: 'Les données de l\'événement ont été réinitialisées avec succès.' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Erreur dans la fonction reset-event-data:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

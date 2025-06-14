// Questo codice va in un file chiamato: /netlify/functions/generate-content-plan.js

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

exports.handler = async function (event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { prompt } = JSON.parse(event.body);
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      throw new Error("La chiave API di OpenAI non è stata impostata.");
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo', // Usiamo un modello più avanzato per risposte strutturate
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        // Chiediamo all'AI di rispondere in formato JSON
        response_format: { type: "json_object" }, 
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Errore da OpenAI:', errorData);
      return { 
        statusCode: response.status, 
        body: JSON.stringify({ error: 'Errore durante la chiamata a OpenAI.' }) 
      };
    }

    const data = await response.json();
    // La risposta JSON è direttamente dentro 'content', ma per sicurezza la parsifichiamo
    const contentPlan = JSON.parse(data.choices[0].message.content);

    // OpenAI potrebbe restituire un oggetto con una chiave (es. "idee"). Lo standardizziamo.
    const ideasArray = Array.isArray(contentPlan) ? contentPlan : (contentPlan.ideas || contentPlan.clusters || []);
    
    return {
      statusCode: 200,
      // Invia direttamente l'array di oggetti JSON al frontend
      body: JSON.stringify(ideasArray),
    };

  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Errore interno del server o nel parsing della risposta AI.' }),
    };
  }
};

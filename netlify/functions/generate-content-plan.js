// Questo è il nuovo codice per: /netlify/functions/generate-content-plan.js

exports.handler = async function (event, context) {
  // Controlla che la richiesta sia un POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { prompt } = JSON.parse(event.body);
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      throw new Error("La chiave API di OpenAI non è stata impostata nelle variabili d'ambiente.");
    }

    // Usa la funzione fetch integrata (non serve più 'node-fetch')
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
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
    const contentPlan = JSON.parse(data.choices[0].message.content);

    const ideasArray = Array.isArray(contentPlan) ? contentPlan : (contentPlan.ideas || contentPlan.clusters || []);
    
    return {
      statusCode: 200,
      body: JSON.stringify(ideasArray),
    };

  } catch (error) {
    console.error("Errore nella funzione:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Errore interno del server o nel parsing della risposta AI.' }),
    };
  }
};

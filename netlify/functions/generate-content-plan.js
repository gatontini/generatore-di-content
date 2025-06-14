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

    // Usa la funzione fetch integrata
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
    const rawContent = data.choices[0].message.content;
    console.log("RISPOSTA DA OPENAI (RAW):", rawContent);

    const contentPlan = JSON.parse(rawContent);

    // Rendiamo più robusta l'estrazione dell'array
    let ideasArray = [];
    if (Array.isArray(contentPlan)) {
        // Caso ideale: l'AI ha risposto con un array
        ideasArray = contentPlan;
    } else if (typeof contentPlan === 'object' && contentPlan !== null) {
        // Cerca la prima chiave che contiene un array (es. {"ideas": [...]})
        const keyWithArray = Object.keys(contentPlan).find(k => Array.isArray(contentPlan[k]));
        if (keyWithArray) {
            ideasArray = contentPlan[keyWithArray];
        } else if (contentPlan.titolo) {
            // Caso di fallback: l'AI ha risposto con un singolo oggetto. Lo trasformiamo in un array.
            ideasArray = [contentPlan];
        }
    }
    
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

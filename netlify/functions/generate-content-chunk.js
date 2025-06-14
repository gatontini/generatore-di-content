// Questo è il nuovo codice per: /netlify/functions/generate-content-chunk.js

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
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
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
    
    // --- AGGIUNTA DI DEBUG ---
    // Scriviamo nel log la risposta esatta che riceviamo da OpenAI
    console.log("RISPOSTA DA OPENAI (RAW CHUNK):", JSON.stringify(data, null, 2));
    // --- FINE DEBUG ---

    const rawContent = data.choices[0].message.content;
    
    // --- CORREZIONE CHIAVE ---
    // Trasformiamo la stringa di testo dell'AI in un vero array di dati
    const chunk = JSON.parse(rawContent);
    
    return {
      statusCode: 200,
      body: JSON.stringify({ chunk }), // Ora 'chunk' è un vero array
    };

  } catch (error) {
    console.error("Errore nella funzione:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Errore interno del server.' }),
    };
  }
};

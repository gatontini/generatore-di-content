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
    console.log("RISPOSTA DA OPENAI (RAW CHUNK):", JSON.stringify(data, null, 2));
    // --- FINE DEBUG ---

    let rawContent = data.choices[0].message.content;
    
    // Pulisce la risposta dell'AI da eventuali blocchi di codice Markdown
    if (rawContent.startsWith("```json")) {
        rawContent = rawContent.substring(7, rawContent.length - 3).trim();
    } else if (rawContent.startsWith("```")) {
        rawContent = rawContent.substring(3, rawContent.length - 3).trim();
    }

    // --- CORREZIONE DEFINITIVA ---
    // Prova a interpretare la risposta come JSON. Se fallisce, la tratta come testo semplice (HTML).
    let chunk;
    try {
        chunk = JSON.parse(rawContent);
    } catch (e) {
        chunk = rawContent; // È testo semplice o HTML, lo usiamo così com'è.
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({ chunk }),
    };

  } catch (error) {
    console.error("Errore nella funzione:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Errore interno del server.' }),
    };
  }
};

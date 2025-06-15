// Questo è il nuovo codice per: /netlify/functions/enrich-keywords.js

exports.handler = async function (event, context) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  try {
    console.log("FUNZIONE 'enrich-keywords' INVOCATA");
    
    const { keywords, userProfile } = JSON.parse(event.body);
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      console.error("ERRORE: API Key non trovata.");
      throw new Error("API Key non trovata.");
    }
    if (!keywords || keywords.length === 0) {
      console.error("ERRORE: Nessuna keyword fornita.");
      return { statusCode: 400, body: JSON.stringify({ error: "Nessuna keyword fornita."}) };
    }

    console.log("Keyword ricevute:", keywords.join(', '));

    const prompt = `Sei un esperto SEO per il settore edile. Un utente (${userProfile.professione} a ${userProfile.citta}) ha fornito questo elenco di keyword:\n- ${keywords.join('\n- ')}\nPer ogni keyword, crea un oggetto JSON con "titolo" (un titolo di articolo SEO-friendly che includa la città di ${userProfile.citta}), "keyword" (la keyword originale), "tipo" ('Approfondimento'), e "sinossi" (una frase descrittiva di 15-20 parole). Rispondi solo con un array JSON di questi oggetti, contenuto dentro una chiave "ideas". Assicurati che il JSON sia valido.`;

    console.log("PROMPT INVIATO A OPENAI:", prompt);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'user', content: prompt }], temperature: 0.5, response_format: { type: "json_object" } }),
    });
    
    if (!response.ok) {
        const errorBody = await response.text();
        console.error("ERRORE da OpenAI:", errorBody);
        throw new Error('Errore chiamata OpenAI.');
    }
    
    const data = await response.json();
    const rawContent = data.choices[0].message.content;
    
    console.log("RISPOSTA RAW DA OPENAI:", rawContent);
    
    const result = JSON.parse(rawContent);

    // --- CORREZIONE DEFINITIVA ---
    // Rende il codice flessibile: cerca la prima chiave che contiene un array
    let ideasArray = [];
    if (Array.isArray(result)) {
        ideasArray = result;
    } else if (typeof result === 'object' && result !== null) {
        const keyWithArray = Object.keys(result).find(k => Array.isArray(result[k]));
        if (keyWithArray) {
            ideasArray = result[keyWithArray];
        }
    }
    
    console.log("Idee parsate correttamente:", ideasArray.length);
    
    return { statusCode: 200, body: JSON.stringify(ideasArray) };
  } catch (error) { 
      console.error("ERRORE CATTURATO NEL BLOCCO CATCH:", error.message);
      return { statusCode: 500, body: JSON.stringify({ error: error.message }) }; 
  }
};

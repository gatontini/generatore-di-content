// Questo è il nuovo codice per: /netlify/functions/generate-content-plan.js

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
    
    // MODIFICATO: Il prompt ora contiene la tua strategia esperta.
    const expertPrompt = `Sei un esperto SEO e Content Strategist per il settore edile in Italia. Il tuo compito è espandere un piano editoriale esistente seguendo una logica a "Topic Cluster".

${prompt}

Istruzioni Obbligatorie:
1.  **Analisi dei Servizi:** Per ogni servizio principale fornito nel profilo, genera 2-3 varianti di keyword (una transazionale come "costo [servizio]" e una informativa come "guida a [servizio]").
2.  **Espansione Tecnica:** Se nei servizi o nei titoli esistenti trovi termini come "pratiche edilizie", "pratiche catastali" o simili, DEVI generare contenuti specifici per le pratiche più comuni in Italia (es: CILA, SCIA, Permesso di Costruire, Cambio Destinazione d'Uso), sempre localizzati con la città.
3.  **Controllo Duplicati:** NON generare idee che siano semplici variazioni di titoli già presenti nel piano.
4.  **Pertinenza:** Ogni suggerimento deve essere una keyword che un potenziale cliente cercherebbe realmente su Google. Evita neologismi tecnici o argomenti fuori target (come la sostenibilità, a meno che non sia un servizio esplicito).
5.  **Formato:** Fornisci il risultato come un array JSON valido, con gli oggetti contenenti "titolo", "keyword", "tipo", e "sinossi".
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o', // Usiamo il modello più potente per eseguire questa strategia complessa
        messages: [{ role: 'user', content: expertPrompt }],
        temperature: 0.5, // Meno creativo, più esecutivo
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
    let rawContent = data.choices[0].message.content;
    
    // Pulizia della risposta
    if (rawContent.startsWith("```json")) {
        rawContent = rawContent.substring(7, rawContent.length - 3).trim();
    } else if (rawContent.startsWith("```")) {
        rawContent = rawContent.substring(3, rawContent.length - 3).trim();
    }

    const contentPlan = JSON.parse(rawContent);
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

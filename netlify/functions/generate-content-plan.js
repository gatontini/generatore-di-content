// Questo è il nuovo codice per: /netlify/functions/generate-content-plan.js

exports.handler = async function (event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { prompt } = JSON.parse(event.body);
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("La chiave API di OpenAI non è stata impostata.");
    
    // MODIFICATO: Il prompt ora chiede una sola idea, seguendo la logica esperta.
    const expertPrompt = `Sei un esperto SEO e Content Strategist per il settore edile in Italia. Il tuo compito è espandere un piano editoriale esistente suggerendo UNA SOLA idea per un nuovo contenuto, seguendo una logica a "Topic Cluster".

${prompt}

Istruzioni Obbligatorie:
1. **Analisi:** Analizza il profilo e i contenuti esistenti.
2. **Suggerimento Unico:** Genera UNA SOLA nuova idea per un articolo cluster che sia logicamente correlata ma NON una semplice variazione di un titolo esistente.
3. **Pertinenza:** Il suggerimento deve essere pertinente ai servizi offerti e una keyword che un potenziale cliente cercherebbe realmente. Evita argomenti fuori target.
4. **Formato:** Fornisci il risultato come un singolo oggetto JSON, con le chiavi "titolo", "keyword", "tipo", e "sinossi".
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: expertPrompt }],
        temperature: 0.7, // Un po' più creativo per trovare un'idea nuova
        response_format: { type: "json_object" }, 
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
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

    const contentIdea = JSON.parse(rawContent);
    
    return {
      statusCode: 200,
      body: JSON.stringify(contentIdea),
    };

  } catch (error) {
    console.error("Errore nella funzione:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Errore interno del server o nel parsing della risposta AI.' }),
    };
  }
};

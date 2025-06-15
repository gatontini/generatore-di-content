// Questo è il nuovo codice per: /netlify/functions/generate-seo-meta.js

exports.handler = async function (event, context) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  try {
    // MODIFICATO: Ora riceviamo anche il profilo dell'utente per dare più contesto all'AI
    const { contentItem, userProfile } = JSON.parse(event.body);
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("API Key non trovata.");

    // --- Logica per distinguere l'intento ---
    const informationalKeywords = ['guida', 'come', 'costo', 'prezzo', 'quanto', 'differenze', 'cosa', 'quando'];
    const isInformational = informationalKeywords.some(k => contentItem.keyword.toLowerCase().includes(k));

    let prompt;

    if (isInformational) {
      // Prompt specifico per contenuti informativi
      prompt = `Sei un esperto SEO per professionisti del settore edile. Il tuo obiettivo è scrivere per attrarre potenziali CLIENTI che cercano informazioni e soluzioni a un problema.
Dati:
- Professionista: "${userProfile.professione}"
- Titolo Articolo: "${contentItem.titolo}"
- Keyword: "${contentItem.keyword}"
Genera:
1. "titolo_seo": un titolo SEO (max 60 caratteri) che incuriosisca l'utente a trovare la risposta.
2. "meta_description": una meta description (max 155 caratteri) che anticipi la soluzione al problema del lettore e lo inviti a leggere la guida completa.
Rispondi solo con un oggetto JSON con le chiavi "titolo_seo" e "meta_description".`;
    } else {
      // Prompt specifico per contenuti transazionali (ricerca di un professionista)
      prompt = `Sei un esperto SEO per professionisti del settore edile. Il tuo obiettivo è scrivere per convincere un potenziale CLIENTE che ha trovato il professionista giusto.
Dati:
- Professionista: "${userProfile.professione}"
- Titolo Articolo: "${contentItem.titolo}"
- Keyword: "${contentItem.keyword}"
Genera:
1. "titolo_seo": un titolo SEO (max 60 caratteri) che metta in risalto il servizio professionale e la località.
2. "meta_description": una meta description (max 155 caratteri) che evidenzi l'affidabilità e si concluda con un invito diretto a contattare il professionista per una consulenza o un preventivo.
Rispondi solo con un oggetto JSON con le chiavi "titolo_seo" e "meta_description".`;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'user', content: prompt }], temperature: 0.7, response_format: { type: "json_object" } }),
    });
    if (!response.ok) throw new Error('Errore chiamata OpenAI.');
    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);
    return { statusCode: 200, body: JSON.stringify({ seoTitle: result.titolo_seo, metaDescription: result.meta_description }) };
  } catch (error) { return { statusCode: 500, body: JSON.stringify({ error: error.message }) }; }
};

// Questo codice va in un nuovo file: /netlify/functions/enrich-keywords.js

exports.handler = async function (event, context) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  try {
    const { keywords, userProfile } = JSON.parse(event.body);
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("API Key non trovata.");

    const prompt = `Sei un esperto SEO per il settore edile. Un utente (${userProfile.professione} a ${userProfile.citta}) ha fornito questo elenco di keyword:\n- ${keywords.join('\n- ')}\nPer ogni keyword, crea un oggetto JSON con "titolo" (un titolo di articolo SEO-friendly), "keyword" (la keyword originale localizzata con la città, se non lo è già), "tipo" ('Approfondimento'), e "sinossi" (una frase descrittiva). Rispondi solo con un array JSON di questi oggetti.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'user', content: prompt }], temperature: 0.5, response_format: { type: "json_object" } }),
    });
    if (!response.ok) throw new Error('Errore chiamata OpenAI.');
    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);
    // Assicuriamoci che l'AI restituisca un array
    const ideasArray = Array.isArray(result) ? result : (result.ideas || result.clusters || []);
    return { statusCode: 200, body: JSON.stringify(ideasArray) };
  } catch (error) { return { statusCode: 500, body: JSON.stringify({ error: error.message }) }; }
};

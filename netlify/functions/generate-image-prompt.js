exports.handler = async function (event, context) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  try {
    const { contentItem } = JSON.parse(event.body);
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("API Key non trovata.");

    const prompt = `Per un articolo di blog intitolato "${contentItem.titolo}", genera un array JSON contenente 3 prompt descrittivi (in inglese) per Midjourney, per creare un'immagine di copertina fotorealistica. Non includere comandi tecnici come /imagine o --ar. Rispondi solo con l'array JSON di stringhe.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'user', content: prompt }], temperature: 0.8, response_format: { type: "json_object" } }),
    });
    if (!response.ok) throw new Error('Errore chiamata OpenAI.');
    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);
    return { statusCode: 200, body: JSON.stringify({ prompts: result }) };
  } catch (error) { return { statusCode: 500, body: JSON.stringify({ error: error.message }) }; }
};

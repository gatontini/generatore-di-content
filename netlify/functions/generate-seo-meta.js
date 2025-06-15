exports.handler = async function (event, context) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  try {
    const { contentItem } = JSON.parse(event.body);
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("API Key non trovata.");

    const prompt = `Dato il titolo "${contentItem.titolo}" e la keyword "${contentItem.keyword}", genera un "titolo_seo" (max 60 caratteri) e una "meta_description" (max 155 caratteri, accattivante e con una call-to-action). Rispondi solo con un oggetto JSON.`;

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

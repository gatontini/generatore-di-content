// Questo è il nuovo codice per: /netlify/functions/generate-prompt.js

exports.handler = async function (event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { contentItem, nomeStudio, meccanismoUnico, sitemapUrls } = JSON.parse(event.body);
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      throw new Error("La chiave API di OpenAI non è stata impostata.");
    }

    const metaPrompt = `
Sei un esperto di Content Strategy e SEO per il settore edile in Italia. Il tuo compito è generare un prompt completo e dettagliato che un professionista potrà poi usare nella sua AI preferita (ChatGPT, Claude, Gemini) per scrivere un articolo di blog di alta qualità.

Il prompt che generi deve essere pronto per il copia-incolla e contenere TUTTI i seguenti punti, fornendo solo testo pulito, senza alcun tag HTML.

**1. Ruolo e Tono di Voce:**
Inizia il prompt con questa frase esatta: "Agisci come un copywriter SEO con 10 anni di esperienza nel settore edile italiano, specializzato nel creare contenuti che convertono per lo studio '${nomeStudio}'. L'approccio dello studio si basa su: '${meccanismoUnico}'. Il tuo tono di voce deve essere professionale, autorevole ma anche rassicurante e facile da capire per un pubblico di non addetti ai lavori."

**2. Istruzioni sul Contenuto:**
Includi una sezione chiara con i dati per l'articolo:
- Titolo (H1 OBBLIGATORIO): "${contentItem.titolo}"
- Keyword Principale: "${contentItem.keyword}"

**3. Suggerimenti SEO Aggiuntivi:**
Genera anche i seguenti elementi ottimizzati per la SEO:
- Titolo SEO (massimo 60 caratteri):
- Meta Description (massimo 155 caratteri, deve essere accattivante e contenere una call-to-action):

**4. Regole SEO Obbligatorie per l'Articolo:**
Specifica queste regole:
- La keyword principale deve apparire nel primo paragrafo (entro le prime 100 parole).
- La keyword principale deve essere presente in almeno un sottotitolo <h2>.
- La keyword principale deve essere ripetuta nel testo in modo naturale 2-3 volte.
- Includi 2-3 keyword correlate pertinenti (es. sinonimi o termini correlati).

**5. Struttura dell'Articolo:**
Richiedi una struttura precisa:
- Un'introduzione che catturi l'attenzione.
- Un corpo del testo diviso in 3-4 sezioni principali, ognuna introdotta da un sottotitolo <h2>.
- L'uso di elenchi puntati (bullet point) per migliorare la leggibilità, usando il trattino (-) per ogni punto.
- Una conclusione che riassuma i punti chiave.

**6. Strategia di Linking (Interno ed Esterno):**
Aggiungi queste istruzioni, che sono FONDAMENTALI:
- "Analizza la sitemap fornita e inserisci 2-3 link interni in modo naturale e contestuale. Per farlo, identifica le parole chiave nel testo (anchor text) più pertinenti e trasformale in un link. **Esempio: 'Una delle pratiche più comuni è la CILA (Comunicazione Inizio Lavori Asseverata), ideale per...'. In questo caso, trasforma la parola 'CILA' in un link che punta alla pagina appropriata.** Ecco le pagine disponibili dalla sitemap: \n${sitemapUrls}\n."
- "Inserisci 1-2 link esterni a fonti autorevoli e non concorrenti (es. Wikipedia, sito del Comune, normative ufficiali come il Testo Unico Edilizia) per aumentare l'affidabilità (E-A-T)."

**7. Tono e Vendita Elegante:**
Includi questa direttiva fondamentale:
- "Il contenuto deve essere informativo ed esaustivo. NON consigliare mai al lettore di 'cercare su Google', 'verificare online' o 'controllare le recensioni'. L'obiettivo è posizionare lo studio '${nomeStudio}' come la soluzione ideale e l'unica fonte di cui fidarsi. La conclusione deve avere una call-to-action chiara che inviti a contattare lo studio per una consulenza, sfruttando il suo approccio unico: '${meccanismoUnico}'."

**8. Prompt per l'Immagine di Copertina (3 Opzioni):**
Termina il prompt con una sezione per l'immagine, fornendo 3 alternative creative e descrittive (in inglese), senza comandi tecnici come /imagine o --ar:
- "Infine, genera 3 prompt alternativi per Midjourney per creare un'immagine di copertina fotorealistica per questo articolo. I prompt devono essere puramente descrittivi."
- Opzione 1:
- Opzione 2:
- Opzione 3:
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: metaPrompt }],
        temperature: 0.5,
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
    const prompt = data.choices[0].message.content;
    
    return {
      statusCode: 200,
      body: JSON.stringify({ prompt }),
    };

  } catch (error) {
    console.error("Errore nella funzione:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Errore interno del server.' }),
    };
  }
};

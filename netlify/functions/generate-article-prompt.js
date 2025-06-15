// Questo è il nuovo codice per: /netlify/functions/generate-article-prompt.js

exports.handler = async function (event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // Riceviamo i dati dal frontend
    const { contentItem, nomeStudio, meccanismoUnico, sitemapUrls } = JSON.parse(event.body);

    // COSTRUZIONE DIRETTA DEL PROMPT DI ALTA QUALITÀ
    // Questo metodo è istantaneo e non rischia timeout.
    // Usiamo il template fornito dall'utente come base.
    const prompt = `
Agisci come un copywriter SEO con 10 anni di esperienza nel settore edile italiano, specializzato nel creare contenuti che convertono per lo studio '${nomeStudio}'. L'approccio dello studio si basa su: '${meccanismoUnico}'. Il tuo tono di voce deve essere professionale, autorevole ma anche rassicurante e facile da capire per un pubblico di non addetti ai lavori. Chi scrive è il team dello studio.

**Titolo (H1 OBBLIGATORIO):** "${contentItem.titolo}"
**Keyword Principale:** "${contentItem.keyword}"

**Regole SEO Obbligatorie:**
- La keyword principale deve apparire nel primo paragrafo (entro le prime 100 parole).
- La keyword principale deve essere presente in almeno un sottotitolo <h2>.
- La keyword principale deve essere ripetuta nel testo in modo naturale 2-3 volte.
- Includi 2-3 keyword correlate pertinenti (es. sinonimi o termini correlati).

**Struttura dell'Articolo:**
- Un'introduzione che catturi l'attenzione.
- Un corpo del testo diviso in 3-4 sezioni principali, ognuna introdotta da un sottotitolo <h2>.
- L'uso di elenchi puntati (bullet point) per migliorare la leggibilità, usando il trattino (-) per ogni punto.
- Una conclusione che riassuma i punti chiave.

**Strategia di Linking (Interno ed Esterno):**
- Analizza la sitemap fornita e inserisci 2-3 link interni in modo naturale e contestuale. Per farlo, identifica le parole chiave nel testo (anchor text) più pertinenti e trasformale in un link. **Esempio: 'Una delle pratiche più comuni è la CILA (Comunicazione Inizio Lavori Asseverata), ideale per...'. In questo caso, trasforma la parola 'CILA' in un link che punta alla pagina appropriata.** Ecco le pagine disponibili dalla sitemap:
${sitemapUrls}
- Inserisci 1-2 link esterni a fonti autorevoli e non concorrenti (es. Wikipedia, sito del Comune, normative ufficiali come il Testo Unico Edilizia) per aumentare l'affidabilità (E-A-T).

**Tono e Vendita Elegante:**
Il contenuto deve essere informativo ed esaustivo. NON consigliare mai al lettore di 'cercare su Google', 'verificare online' o 'controllare le recensioni'. L'obiettivo è posizionare lo studio '${nomeStudio}' come la soluzione ideale e l'unica fonte di cui fidarsi. La conclusione deve riassumere i punti chiave dell'articolo e all'interno dell'articolo si deve accennare alla specializzazione dello studio: '${meccanismoUnico}'.
`;

    // Restituiamo il prompt costruito al frontend
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

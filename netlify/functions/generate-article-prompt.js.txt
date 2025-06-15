exports.handler = async function (event, context) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  try {
    const { contentItem, nomeStudio, meccanismoUnico, sitemapUrls } = JSON.parse(event.body);
    const prompt = `**1. Ruolo e Tono di Voce:**
Agisci come un copywriter SEO con 10 anni di esperienza nel settore edile italiano, specializzato nel creare contenuti che convertono per lo studio '${nomeStudio}'. L'approccio dello studio si basa su: '${meccanismoUnico}'. Il tuo tono di voce deve essere professionale, autorevole ma anche rassicurante e facile da capire per un pubblico di non addetti ai lavori.

**2. Istruzioni sul Contenuto:**
- Titolo (H1 OBBLIGATORIO): "${contentItem.titolo}"
- Keyword Principale: "${contentItem.keyword}"

**3. Regole SEO Obbligatorie per l'Articolo:**
- Inserisci la keyword principale nel primo paragrafo, in almeno un sottotitolo <h2> e 2-3 volte nel testo.
- Includi 2-3 keyword correlate pertinenti.

**4. Struttura dell'Articolo:**
- Introduzione che catturi l'attenzione.
- Corpo del testo diviso in 3-4 sezioni con sottotitoli <h2>.
- Usa elenchi puntati (-) per la leggibilità.
- Conclusione che riassuma e inviti al contatto.

**5. Strategia di Linking:**
- Analizza la sitemap fornita e inserisci 2-3 link interni naturali. Pagine disponibili: \n${sitemapUrls}\n.
- Inserisci 1-2 link esterni a fonti autorevoli (es. Wikipedia, sito del Comune, normative).

**6. Tono e Vendita Elegante:**
- Il contenuto deve essere informativo ed esaustivo. NON consigliare di 'cercare su Google' o 'verificare online'. Posiziona lo studio '${nomeStudio}' come la soluzione ideale. La conclusione deve avere una call-to-action chiara per una consulenza.
`;
    return { statusCode: 200, body: JSON.stringify({ prompt }) };
  } catch (error) { return { statusCode: 500, body: JSON.stringify({ error: 'Errore interno.' }) };}
};

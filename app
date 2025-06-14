<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generatore di Calendario Editoriale SEO</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
            scroll-behavior: smooth;
        }
        .gradient-bg {
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
        .card-enter, .plan-enter {
            animation: fadeIn 0.5s ease-in-out;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        /* Stile per la scrollbar */
        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }
        ::-webkit-scrollbar-track {
            background: #f1f1f1;
        }
        ::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #555;
        }
        /* Stile per checkbox personalizzate */
        .service-checkbox:checked + label {
            border-color: #3b82f6;
            background-color: #eff6ff;
            color: #1e40af;
            font-weight: 600;
        }
        .service-checkbox:disabled + label {
            cursor: not-allowed;
            background-color: #f3f4f6;
            border-color: #e5e7eb;
            color: #9ca3af;
        }

    </style>
</head>
<body class="gradient-bg min-h-screen">

    <div class="container mx-auto p-4 md:p-8">
        
        <header class="text-center mb-12 pt-8">
            <h1 class="text-3xl md:text-4xl font-bold text-gray-800">Generatore di Calendario Editoriale SEO</h1>
            <p class="text-gray-600 mt-2">Crea i tuoi contenuti strategici per attirare clienti a livello locale.</p>
        </header>

        <!-- FASE 1: WIZARD / INPUT -->
        <div id="wizard" class="bg-white p-6 md:p-8 rounded-2xl shadow-lg mb-8">
            <h2 class="text-2xl font-semibold text-gray-700 mb-6 border-b pb-3">1. Raccontaci di te</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Professione -->
                <div class="md:col-span-2">
                    <label for="professione" class="block text-sm font-medium text-gray-600 mb-2">Chi sei?</label>
                    <select id="professione" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
                        <option value="">Seleziona una professione...</option>
                        <option value="Architetto">Architetto</option>
                        <option value="Studio di Architettura">Studio di Architettura</option>
                        <option value="Interior Designer">Interior Designer</option>
                        <option value="Impresa Edile">Impresa Edile</option>
                        <option value="Geometra">Geometra</option>
                        <option value="altro">Altro (specifica)</option>
                    </select>
                    <input type="text" id="professione-altro" class="hidden mt-2 w-full p-3 border border-gray-300 rounded-lg" placeholder="Specifica la tua professione">
                </div>

                <!-- Città -->
                <div class="md:col-span-2">
                    <label for="citta" class="block text-sm font-medium text-gray-600 mb-2">Dove operi principalmente?</label>
                    <input type="text" id="citta" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" placeholder="Es: Firenze, Provincia di Bergamo...">
                </div>

                <!-- Servizi -->
                <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-gray-600 mb-2">Quali servizi offri? (Seleziona max 3)</label>
                    <div id="services-container" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        <!-- Checkbox generate da JS -->
                    </div>
                </div>

                <!-- Domanda Frequente -->
                <div class="md:col-span-2">
                    <label for="domanda_frequente" class="block text-sm font-medium text-gray-600 mb-2">Qual è una domanda frequente che ti fanno i clienti?</label>
                    <input type="text" id="domanda_frequente" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" placeholder="Es: Quanto costa ristrutturare casa, Quanto tempo ci vuole...">
                </div>

            </div>
            <div class="mt-8 text-center">
                <button id="generateBtn" class="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transform hover:scale-105 transition-transform duration-300">
                    Genera Idee per Contenuti
                </button>
            </div>
        </div>

        <!-- FASE 2: RISULTATI (CARD) -->
        <div id="results" class="hidden">
             <h2 class="text-2xl font-semibold text-gray-700 mb-6 border-b pb-3">2. Le Tue Idee per i Contenuti</h2>
             <div id="results-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>
             <div id="results-actions" class="text-center mt-8 space-x-4 hidden">
                <button id="createPlanBtn" class="bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 transform hover:scale-105 transition-transform duration-300">
                    Crea Piano Dettagliato
                </button>
                <button id="resetBtn" class="bg-gray-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-300 transition">
                    Modifica Dati
                </button>
             </div>
        </div>

        <!-- FASE 3: PIANO DETTAGLIATO (TABELLA) -->
        <div id="detailedPlan" class="hidden mt-12">
            <h2 class="text-2xl font-semibold text-gray-700 mb-6 border-b pb-3">3. Il Tuo Piano Editoriale Dettagliato</h2>
            <div class="overflow-x-auto bg-white rounded-2xl shadow-lg plan-enter">
                <table class="min-w-full">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Settimana</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Idea di Titolo</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keyword</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sinossi / Cosa Scrivere</th>
                        </tr>
                    </thead>
                    <tbody id="planTableBody" class="bg-white divide-y divide-gray-200"></tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Modale per messaggi di errore -->
    <div id="errorModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 hidden z-50">
        <div class="bg-white rounded-2xl p-8 shadow-2xl max-w-sm w-full text-center">
            <h3 class="text-xl font-bold text-red-600 mb-4">Attenzione!</h3>
            <p id="errorMessage" class="text-gray-700 mb-6">Per favore, compila tutti i campi richiesti.</p>
            <button id="closeModalBtn" class="bg-red-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-600 transition">Ho capito</button>
        </div>
    </div>


    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Elementi del DOM
            const generateBtn = document.getElementById('generateBtn');
            const createPlanBtn = document.getElementById('createPlanBtn');
            const resetBtn = document.getElementById('resetBtn');
            const wizardDiv = document.getElementById('wizard');
            const resultsDiv = document.getElementById('results');
            const resultsGrid = document.getElementById('results-grid');
            const resultsActions = document.getElementById('results-actions');
            const detailedPlanDiv = document.getElementById('detailedPlan');
            const planTableBody = document.getElementById('planTableBody');
            const errorModal = document.getElementById('errorModal');
            const closeModalBtn = document.getElementById('closeModalBtn');
            const errorMessage = document.getElementById('errorMessage');
            const professioneSelect = document.getElementById('professione');
            const professioneAltroInput = document.getElementById('professione-altro');
            const servicesContainer = document.getElementById('services-container');

            let generatedCalendar = [];
            let userInputs = {};
            
            const allServices = [
                'Ristrutturazione appartamenti', 'Ristrutturazione casa', 'Ristrutturazione negozio', 'Ristrutturazione ristorante',
                'Ristrutturazione hotel', 'Costruzione villa', 'Pratiche edilizie', 'Calcolo strutturale', 'Abuso edilizio', 'Sanatoria Edilizia'
            ];

            // Popola le checkbox dei servizi
            allServices.forEach(service => {
                const div = document.createElement('div');
                const id = `service-${service.toLowerCase().replace(/\s+/g, '-')}`;
                div.innerHTML = `
                    <input type="checkbox" id="${id}" name="servizio" value="${service}" class="hidden service-checkbox">
                    <label for="${id}" class="block text-center text-sm p-3 border border-gray-300 rounded-lg cursor-pointer transition-colors duration-200 ease-in-out hover:border-blue-400">
                        ${service}
                    </label>
                `;
                servicesContainer.appendChild(div);
            });
            
            // Gestione "Altro" professione
            professioneSelect.addEventListener('change', () => {
                professioneAltroInput.classList.toggle('hidden', professioneSelect.value !== 'altro');
            });
            
            // Gestione selezione max 3 servizi
            servicesContainer.addEventListener('change', (e) => {
                if (e.target.name === 'servizio') {
                    const checkedCheckboxes = servicesContainer.querySelectorAll('input[name="servizio"]:checked');
                    const allCheckboxes = servicesContainer.querySelectorAll('input[name="servizio"]');
                    if (checkedCheckboxes.length >= 3) {
                        allCheckboxes.forEach(checkbox => {
                            if (!checkbox.checked) {
                                checkbox.disabled = true;
                            }
                        });
                    } else {
                        allCheckboxes.forEach(checkbox => {
                            checkbox.disabled = false;
                        });
                    }
                }
            });

            const toggleModal = (show, message = "Compila tutti i campi per continuare.") => {
                errorMessage.textContent = message;
                errorModal.classList.toggle('hidden', !show);
            };
            closeModalBtn.addEventListener('click', () => toggleModal(false));
            
            const capitalizeFirstLetter = (string) => string ? string.charAt(0).toUpperCase() + string.slice(1) : '';

            generateBtn.addEventListener('click', () => {
                let professione = professioneSelect.value;
                if (professione === 'altro') {
                    professione = professioneAltroInput.value.trim();
                }

                const selectedServicesNodes = servicesContainer.querySelectorAll('input[name="servizio"]:checked');
                const servizi = Array.from(selectedServicesNodes).map(cb => cb.value);

                userInputs = {
                    professione: professione,
                    citta: document.getElementById('citta').value.trim(),
                    servizi: servizi,
                    domanda_frequente: document.getElementById('domanda_frequente').value.trim(),
                };

                if (!userInputs.professione || !userInputs.citta || userInputs.servizi.length === 0 || !userInputs.domanda_frequente) {
                    toggleModal(true, "Assicurati di aver selezionato una professione, inserito una città, scelto almeno un servizio e scritto una domanda frequente.");
                    return;
                }

                resultsGrid.innerHTML = '';
                detailedPlanDiv.classList.add('hidden');
                
                // Generazione dinamica del calendario con fallback
                const calendario = [];
                const s1 = userInputs.servizi[0];
                const s2 = userInputs.servizi[1];
                const s3 = userInputs.servizi[2];
                const prof = userInputs.professione;
                const city = userInputs.citta;
                const domanda = userInputs.domanda_frequente.replace(/\?$/, '');

                calendario.push({ tipo: 'Landing Page Locale', icon: '📍', titolo: `${capitalizeFirstLetter(prof)} a ${capitalizeFirstLetter(city)}`, keyword: `${prof.toLowerCase()} ${city.toLowerCase()}`, obiettivo: 'Intercettare clienti pronti ad assumere un professionista ORA.' });
                calendario.push({ tipo: 'Contenuto Pillar', icon: '📚', titolo: `Guida Completa a: ${capitalizeFirstLetter(s1)} a ${capitalizeFirstLetter(city)}`, keyword: `guida ${s1.toLowerCase()} ${city.toLowerCase()}`, obiettivo: `Diventare il punto di riferimento informativo per "${s1}".` });
                calendario.push({ tipo: 'Domanda Frequente', icon: '❓', titolo: `${capitalizeFirstLetter(domanda)} a ${capitalizeFirstLetter(city)}? La Risposta Definitiva`, keyword: `${domanda.toLowerCase()} ${city.toLowerCase()}`, obiettivo: `Rispondere a un dubbio chiave dei clienti per attrarre traffico qualificato.` });
                calendario.push({ tipo: 'Analisi Costi', icon: '💰', titolo: `Quanto Costa ${s1} a ${capitalizeFirstLetter(city)}? Analisi Dettagliata`, keyword: `costo ${s1.toLowerCase()} ${city.toLowerCase()}`, obiettivo: 'Generare fiducia tramite la trasparenza sui costi.' });
                
                if (s2) {
                    calendario.push({ tipo: 'Contenuto di Supporto', icon: '🔧', titolo: `Focus su: ${capitalizeFirstLetter(s2)} a ${capitalizeFirstLetter(city)}`, keyword: `${s2.toLowerCase()} ${city.toLowerCase()}`, obiettivo: `Approfondire il secondo servizio che offri per mostrare la tua specializzazione.` });
                } else {
                     calendario.push({ tipo: 'Contenuto di Supporto', icon: '📝', titolo: `Bonus Edilizi a ${capitalizeFirstLetter(city)}: Quali Sfruttare?`, keyword: `bonus edilizi ${city.toLowerCase()}`, obiettivo: `Informare su un argomento di grande interesse che porta a richieste di preventivo.` });
                }
                
                if (s3) {
                    calendario.push({ tipo: 'Contenuto di Supporto', icon: '🛠️', titolo: `${capitalizeFirstLetter(s3)} a ${capitalizeFirstLetter(city)}: Cosa Sapere`, keyword: `${s3.toLowerCase()} ${city.toLowerCase()}`, obiettivo: `Dimostrare competenza anche sul terzo servizio principale.` });
                } else {
                    calendario.push({ tipo: 'Contenuto di Supporto', icon: '🏆', titolo: `Come Scegliere il Miglior ${capitalizeFirstLetter(prof)} a ${capitalizeFirstLetter(city)}`, keyword: `scegliere ${prof.toLowerCase()} ${city.toLowerCase()}`, obiettivo: `Posizionarti come guida esperta che aiuta il cliente a fare la scelta giusta.` });
                }
                
                generatedCalendar = calendario;

                calendario.forEach(item => {
                    const card = document.createElement('div');
                    card.className = 'bg-white p-6 rounded-xl shadow-md flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 card-enter';
                    card.innerHTML = `<div class="flex items-center mb-3"><span class="text-2xl mr-3">${item.icon}</span><h3 class="text-sm font-semibold text-blue-600 uppercase tracking-wider">${item.tipo}</h3></div><h4 class="text-lg font-bold text-gray-800 mb-2 flex-grow">${item.titolo}</h4><div class="mt-auto"><p class="text-sm text-gray-500 mb-3"><strong class="text-gray-700">Keyword:</strong> <code>${item.keyword}</code></p><p class="text-sm text-gray-600 bg-gray-100 p-2 rounded-md"><strong class="text-gray-800">Obiettivo:</strong> ${item.obiettivo}</p></div>`;
                    resultsGrid.appendChild(card);
                });

                resultsDiv.classList.remove('hidden');
                resultsActions.classList.remove('hidden');
                resultsDiv.scrollIntoView();
            });

            createPlanBtn.addEventListener('click', () => {
                planTableBody.innerHTML = ''; 
                generatedCalendar.forEach((item, index) => {
                    const row = document.createElement('tr');
                    row.className = index % 2 === 0 ? 'bg-white' : 'bg-gray-50';
                    row.innerHTML = `<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Settimana ${index + 1}</td><td class="px-6 py-4 text-sm text-gray-800">${item.titolo}</td><td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><code>${item.keyword}</code></td><td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${getKeywordType(item)}</td><td class="px-6 py-4 text-sm text-gray-600" style="min-width: 300px;">${getSynopsis(item, userInputs)}</td>`;
                    planTableBody.appendChild(row);
                });
                detailedPlanDiv.classList.remove('hidden');
                detailedPlanDiv.scrollIntoView();
            });

            resetBtn.addEventListener('click', () => {
                resultsDiv.classList.add('hidden');
                detailedPlanDiv.classList.add('hidden');
                wizardDiv.scrollIntoView();
            });

            function getKeywordType(item) {
                const type = item.tipo;
                if (type === 'Landing Page Locale') return '<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Transazionale</span>';
                if (type === 'Analisi Costi') return '<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Informativa / Transazionale</span>';
                return '<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Informativa</span>';
            }

            function getSynopsis(item, inputs) {
                const city = capitalizeFirstLetter(inputs.citta);
                const prof = capitalizeFirstLetter(inputs.professione);
                const s1 = inputs.servizi[0];

                switch (item.tipo) {
                    case 'Landing Page Locale': return `Descrivi chi sei, i tuoi servizi con focus su "${s1}", mostra un portfolio e testimonianze. L'obiettivo è convertire: inserisci una CTA chiara come 'Richiedi un Preventivo Gratuito'.`;
                    case 'Contenuto Pillar': return `Crea una guida completa su "${s1}". Strutturala in capitoli: fasi del progetto, permessi a ${city}, stima dei costi, scelta materiali e bonus fiscali. Usa immagini, checklist e linka ai tuoi contenuti di supporto.`;
                    case 'Domanda Frequente': return `Prendi la domanda esatta del cliente. Rispondi in modo esaustivo, chiaro e diretto. Usa il primo paragrafo per dare la risposta breve, poi approfondisci. Dimostra di capire le loro preoccupazioni.`;
                    case 'Analisi Costi': return `Sii trasparente. Analizza le voci di costo per "${s1}" a ${city}. Fornisci range di prezzo (es. al mq) e spiega i fattori che influenzano il costo. Questo genera enorme fiducia.`;
                    default: return `Crea un articolo di approfondimento per il servizio o l'argomento in questione. Offri consigli pratici, spiega i benefici e mostra la tua esperienza specifica nel campo. Usa esempi concreti realizzati a ${city}.`;
                }
            }
        });
    </script>
</body>
</html>

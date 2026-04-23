export const FAQ_SEED_DATA: { question: string; answer: string }[] = [
  {
    question: 'Quali tecnologie frontend utilizzi principalmente?',
    answer: 'Utilizzo principalmente React con TypeScript, che mi permette di creare interfacce moderne, manutenibili e scalabili. Ogni progetto è strutturato con Vite per un\'esperienza di sviluppo rapida, Redux Toolkit per la gestione dello stato, e Bootstrap combinato con CSS Modules per uno styling ordinato e componibile. La mia attenzione per i dettagli e la pulizia del codice si riflette in ogni componente che scrivo.',
  },
  {
    question: 'Hai esperienza con Firebase? Cosa sai fare con questa piattaforma?',
    answer: 'Sì, Firebase è una delle mie piattaforme preferite per sviluppare applicazioni full-stack moderne. Utilizzo quotidianamente Firestore per il database in tempo reale, Firebase Authentication per gestire accessi sicuri con Google OAuth e altri provider, Firebase Storage per la gestione dei file, Firebase Functions per la logica server-side, Firebase Hosting per il deployment, e Cloud Messaging (FCM) per le notifiche push. Conosco anche le Security Rules per proteggere i dati degli utenti in modo granulare.',
  },
  {
    question: 'Sai integrare WhatsApp nei sistemi aziendali?',
    answer: 'Assolutamente sì. Ho esperienza con WhatsApp Business API e so integrare notifiche automatiche, messaggi transazionali e flussi di comunicazione direttamente nelle applicazioni web e nei gestionali. Posso implementare chatbot, sistemi di invio messaggi automatici, conferme d\'ordine, promemoria appuntamenti e comunicazioni personalizzate tramite WhatsApp. Questa integrazione è molto apprezzata dai clienti perché aumenta notevolmente l\'engagement.',
  },
  {
    question: 'Puoi sviluppare applicazioni web complete, dal frontend al backend?',
    answer: 'Sì, sono un sviluppatore full-stack. Gestisco l\'intera architettura di un\'applicazione: dalla UI in React con TypeScript, alla logica server-side con Node.js e Firebase Functions, al database con Firestore o altri sistemi. Questo mi permette di avere una visione completa del prodotto e di prendere decisioni tecniche informate ad ogni livello dello stack, garantendo coerenza e qualità end-to-end.',
  },
  {
    question: 'Sai integrare sistemi di intelligenza artificiale nelle applicazioni?',
    answer: 'Sì, e trovo questo campo estremamente appassionante. So integrare API di OpenAI (GPT-4, embeddings), Claude di Anthropic e altri modelli AI nelle applicazioni web. Posso implementare chatbot intelligenti, sistemi di risposta automatica basati su basi di conoscenza personalizzate (RAG), analisi di testo, generazione di contenuti e assistenti virtuali. Sto attivamente esplorando le ultime evoluzioni dell\'AI applicata allo sviluppo.',
  },
  {
    question: 'Quanto tempo ti ci vuole per imparare una nuova tecnologia?',
    answer: 'Sono noto per la velocità con cui apprendo nuove tecnologie. Ho un metodo: studio la documentazione ufficiale, costruisco immediatamente un progetto pratico e approfondisco i casi d\'uso reali. In genere, per una nuova libreria o framework, sono operativo in pochi giorni. Per tecnologie più complesse, raggiungo un livello professionale in 2-4 settimane. La cosa importante per me è non fermarmi alla teoria ma sporcarmi subito le mani.',
  },
  {
    question: 'Hai esperienza nello sviluppo di gestionali personalizzati?',
    answer: 'Sì, ho sviluppato diversi sistemi gestionali personalizzati per le esigenze specifiche delle aziende. Questi includono CRM, dashboard di analytics, sistemi di prenotazione, gestione inventari, portali clienti e molto altro. Ogni gestionale è costruito tenendo conto dei flussi di lavoro reali degli utenti finali, con interfacce intuitive e logiche di business robuste. La personalizzazione è il mio punto di forza rispetto alle soluzioni standard.',
  },
  {
    question: 'Come gestisci la sicurezza nelle applicazioni che sviluppi?',
    answer: 'La sicurezza è una priorità, non un\'aggiunta finale. Implemento autenticazione robusta con Firebase Auth, regole di sicurezza granulari su Firestore, validazione dei dati sia lato client che server, protezione da XSS e injection, gestione sicura dei segreti tramite variabili d\'ambiente, e HTTPS ovunque. Ogni utente accede solo ai propri dati grazie a Security Rules precise e al principio di minimo privilegio.',
  },
  {
    question: 'Puoi sviluppare siti web responsive che funzionino su tutti i dispositivi?',
    answer: 'Assolutamente. Ogni sito che sviluppo è progettato con approccio mobile-first. Utilizzo Bootstrap per il layout responsive e CSS Modules per le personalizzazioni. Testo sempre su diverse dimensioni di schermo per garantire un\'esperienza ottimale sia su smartphone che su desktop e tablet. La compatibilità cross-device è per me un requisito di base, non un optional.',
  },
  {
    question: 'Hai mai lavorato con sistemi di notifiche push?',
    answer: 'Sì, ho implementato sistemi di notifiche push web utilizzando Firebase Cloud Messaging (FCM). Questo include la gestione dei service worker, la registrazione dei token FCM per ogni dispositivo, il salvataggio sicuro dei token su Firestore, e l\'invio di notifiche personalizzate tramite Firebase Functions. Gestisco anche il caso in cui un utente ha più dispositivi registrati, garantendo la consegna su tutti.',
  },
  {
    question: 'Sei in grado di integrare sistemi di pagamento come Stripe nelle applicazioni?',
    answer: 'Sì, so integrare Stripe per gestire pagamenti online sicuri, abbonamenti ricorrenti, checkout personalizzati e gestione dei rimborsi. La gestione dei pagamenti richiede molta attenzione alla sicurezza e alla UX, ambiti in cui ho una solida esperienza. Posso anche integrare altri gateway come PayPal o sistemi locali italiani. Ogni integrazione viene implementata rispettando le best practice PCI DSS.',
  },
  {
    question: 'Come ti approcci al testing delle applicazioni?',
    answer: 'Credo nel testing come parte integrante del processo di sviluppo, non come optional. Scrivo test unitari per la logica di business critica e test di integrazione per i flussi principali. Per il frontend verifico anche il comportamento visivo e l\'accessibilità. Non sacrifico mai il testing per la velocità di consegna, perché il debito tecnico si paga sempre con gli interessi.',
  },
  {
    question: 'Puoi integrare Google Maps o mappe interattive nelle applicazioni?',
    answer: 'Sì, ho esperienza con Google Maps API, Mapbox e Leaflet per l\'integrazione di mappe interattive. Posso implementare geocoding, calcolo di percorsi, visualizzazione di punti di interesse, clustering di marker e geolocalizzazione in tempo reale. Queste funzionalità sono molto utili per gestionali con flotte, sistemi di delivery o applicazioni con componenti geografici.',
  },
  {
    question: 'Come gestisci il versioning e la collaborazione sul codice?',
    answer: 'Utilizzo Git per il versioning, con un workflow strutturato basato su branch (main, develop, feature branches). Uso GitHub per la collaborazione, con pull request e code review. Mantengo commit message descrittivi e changelog aggiornati. Per i progetti più grandi applico metodologie come Git Flow o Trunk-Based Development a seconda delle esigenze del team.',
  },
  {
    question: 'Hai esperienza con il deployment e la gestione dell\'infrastruttura?',
    answer: 'Ho esperienza con deployment su Firebase Hosting, Vercel, Netlify e VPS. Configuro pipeline CI/CD con GitHub Actions per automatizzare build, test e deploy. Gestisco variabili d\'ambiente per diversi ambienti (sviluppo, staging, produzione) e utilizzo gli emulatori Firebase per lo sviluppo locale sicuro. Non ho paura di sporcarmi le mani con la configurazione dell\'infrastruttura quando necessario.',
  },
  {
    question: 'Riesci a lavorare su progetti già avviati da altri sviluppatori?',
    answer: 'Sì, e lo faccio con metodo. Il mio primo passo è sempre capire il codice esistente prima di toccare qualcosa: leggo la documentazione, esploro l\'architettura, identifico i pattern usati. Mi adatto allo stile del codice esistente e introduco miglioramenti in modo incrementale, senza rompere ciò che funziona già. Ho una buona capacità di leggere e interpretare codice scritto da altri.',
  },
  {
    question: 'Puoi sviluppare sistemi di autenticazione con diversi provider social?',
    answer: 'Sì, utilizzo Firebase Authentication che supporta Google, Facebook, Apple, GitHub, email/password e altri provider OAuth. So implementare flussi completi di autenticazione con gestione delle sessioni, recupero password, verifica email e autenticazione a due fattori. L\'UX del processo di login è sempre una mia priorità: deve essere fluida e rassicurante per l\'utente finale.',
  },
  {
    question: 'Sei disponibile per collaborazioni a lungo termine?',
    answer: 'Sì, preferisco relazioni di lavoro continuative che mi permettano di conoscere a fondo il business del cliente e contribuire in modo sempre più efficace nel tempo. Sono affidabile, rispetto le scadenze e comunico proattivamente sull\'avanzamento del lavoro. Molti dei miei clienti tornano da me per nuovi progetti proprio perché sanno cosa aspettarsi: qualità, puntualità e comunicazione trasparente.',
  },
  {
    question: 'Hai esperienza con API REST e la loro progettazione?',
    answer: 'Sì, ho ampia esperienza nella progettazione e nel consumo di API REST. So documentare le API, gestire l\'autenticazione tramite token, implementare paginazione, filtri e ordinamento. Quando sviluppo Firebase Functions, creo endpoint HTTP RESTful ben strutturati, sicuri e facilmente integrabili da client di qualsiasi tipo. Ho anche conoscenza di GraphQL per scenari più complessi.',
  },
  {
    question: 'Come gestisci i dati in tempo reale nelle applicazioni?',
    answer: 'Utilizzo i listener real-time di Firestore (onSnapshot) per sincronizzare i dati automaticamente senza bisogno di polling. Questo è perfetto per chat, dashboard live, notifiche in tempo reale e applicazioni collaborative. Gestisco correttamente la pulizia dei listener per evitare memory leak e ottimizzare le performance, specialmente su applicazioni con molti utenti simultanei.',
  },
  {
    question: 'Puoi creare dashboard di analytics con grafici e visualizzazioni dati?',
    answer: 'Sì, so integrare librerie come Recharts, Chart.js o Nivo per creare dashboard interattive con grafici a barre, linee, torte, heatmap e molto altro. Collego queste visualizzazioni a dati in tempo reale da Firestore o da API esterne. L\'importante è presentare i dati in modo chiaro e azionabile, non solo esteticamente bello ma genuinamente utile per le decisioni di business.',
  },
  {
    question: 'Hai esperienza con l\'invio di email transazionali?',
    answer: 'Sì, ho esperienza con servizi come SendGrid, Mailgun e Resend per l\'invio di email transazionali tramite Firebase Functions. Implemento sistemi per conferme d\'ordine, reset password, notifiche automatiche e report periodici. Creo template HTML personalizzati e curo le best practice di deliverability per garantire che le email arrivino nella casella principale e non nello spam.',
  },
  {
    question: 'Sai lavorare partendo dai mockup di un designer?',
    answer: 'Sì, ho lavorato con designer che usano Figma, Adobe XD e Sketch. So interpretare i mockup e tradurli fedelmente in codice, rispettando stili, spaziature e comportamenti interattivi definiti nel design. Collaboro proattivamente con i designer per segnalare problemi di implementazione o per proporre ottimizzazioni. Il risultato finale è sempre fedele alla visione originale.',
  },
  {
    question: 'Puoi ottimizzare un sito web per i motori di ricerca (SEO)?',
    answer: 'Sì, conosco le tecniche SEO per applicazioni React: gestione dei meta tag, sitemap, robots.txt, ottimizzazione delle performance (Core Web Vitals), struttura semantica dell\'HTML e rendering server-side quando necessario. So anche configurare correttamente Open Graph per una buona presenza sui social media. La SEO tecnica è parte integrante della mia checklist di sviluppo.',
  },
  {
    question: 'Hai esperienza con l\'ottimizzazione delle performance frontend?',
    answer: 'Sì, mi occupo attivamente di performance. Uso code splitting con React.lazy, memoizzazione con useMemo e useCallback, ottimizzazione delle immagini, lazy loading dei componenti e analisi del bundle. Monitoro i Core Web Vitals e lavoro con l\'obiettivo di avere applicazioni veloci e reattive. Un sito lento perde utenti: la performance non è un lusso, è una necessità.',
  },
  {
    question: 'Sai lavorare con Redux Toolkit per la gestione dello stato?',
    answer: 'Sì, Redux Toolkit è il mio standard per la state management in applicazioni React di media e grande complessità. Creo slice ben organizzati, uso createAsyncThunk per le operazioni asincrone, e sfrutt RTK Query quando appropriato. Struttura la store in modo modulare per renderla manutenibile anche in team numerosi e nel lungo periodo.',
  },
  {
    question: 'Puoi sviluppare applicazioni multilingua?',
    answer: 'Sì, ho esperienza con l\'internazionalizzazione usando librerie come i18next e react-i18next. Struttura il codice fin dall\'inizio per supportare più lingue, con file di traduzione separati, gestione dei plurali e formattazione localizzata di date e numeri. Se non conosco una libreria specifica richiesta, la imparo rapidamente grazie alla solida base che ho su questi pattern.',
  },
  {
    question: 'Hai attenzione all\'accessibilità (a11y) nelle applicazioni web?',
    answer: 'Tengo molto all\'accessibilità. Utilizzo HTML semantico, attributi ARIA dove necessario, gestione corretta del focus, contrasto dei colori adeguato e navigazione tramite tastiera. So usare strumenti come Lighthouse e axe per identificare e correggere problemi di accessibilità. Un\'applicazione accessibile è una migliore applicazione per tutti.',
  },
  {
    question: 'Sai integrare CRM come HubSpot o Salesforce?',
    answer: 'Ho esperienza con le API di CRM come HubSpot per sincronizzare contatti, deal e attività. Se non conosco già l\'API specifica richiesta, la studio rapidamente grazie alla mia familiarità con le API REST standard. Posso implementare sincronizzazioni bidirezionali, webhook, automazioni e integrazioni personalizzate per connettere i sistemi aziendali esistenti.',
  },
  {
    question: 'Puoi gestire upload e archiviazione di file e media?',
    answer: 'Sì, ho esperienza completa con Firebase Storage per upload di file, immagini e documenti. Implemento progress bar, validazione del tipo e dimensione dei file, ridimensionamento delle immagini lato server con Firebase Functions e gestione sicura degli accessi tramite Security Rules. Posso anche integrare servizi esterni come Cloudinary per ottimizzazione e trasformazione avanzata delle immagini.',
  },
  {
    question: 'Hai mai sviluppato sistemi di prenotazione o booking?',
    answer: 'Sì, ho sviluppato sistemi di prenotazione che gestiscono disponibilità in tempo reale, calendari, notifiche di conferma, promemoria automatici e gestione dei pagamenti. L\'integrazione con WhatsApp per i promemoria automatici è uno dei casi d\'uso che ho implementato con maggiore successo. So anche integrare Google Calendar per sincronizzare gli appuntamenti con i calendari degli utenti.',
  },
  {
    question: 'Come gestisci la comunicazione con il cliente durante un progetto?',
    answer: 'Credo nella comunicazione proattiva e trasparente. Aggiorno regolarmente il cliente sui progressi, segnalo immediatamente eventuali problemi o cambiamenti, e mi assicuro che le aspettative siano allineate fin dall\'inizio. Non aspetto che il cliente chieda aggiornamenti: sono io il primo ad aggiornarli. Uso lo strumento di comunicazione preferito dal cliente, che sia email, Slack, WhatsApp o altro.',
  },
  {
    question: 'Hai esperienza con React Native o sviluppo mobile?',
    answer: 'Ho una buona base di React Native e ho sviluppato applicazioni mobile ibride. Valuto sempre la soluzione migliore per il progetto: a volte una PWA (Progressive Web App) ben fatta copre le esigenze mobile senza la complessità di un\'app nativa, risparmiando costi e tempi. Per progetti più avanzati, mi aggiorno rapidamente sulle tecnologie specifiche richieste o mi avvalgo di collaboratori specializzati.',
  },
  {
    question: 'Puoi integrare Google Calendar o Outlook nei sistemi che sviluppi?',
    answer: 'Sì, so integrare Google Calendar API per creare, modificare e visualizzare eventi, gestire notifiche e sincronizzare appuntamenti con sistemi aziendali. Questo è particolarmente utile per gestionali, sistemi di prenotazione o applicazioni di project management che richiedono una gestione del tempo integrata con gli strumenti già in uso dall\'azienda.',
  },
  {
    question: 'Sai sviluppare landing page ad alta conversione?',
    answer: 'Sì, so creare landing page ottimizzate per la conversione, con animazioni coinvolgenti realizzate con GSAP, design responsive, caricamento veloce e call-to-action strategici. Unisco le competenze tecniche a una buona comprensione dei principi UX/UI per creare pagine che non solo sono esteticamente curate ma anche efficaci nel convertire i visitatori in clienti o lead.',
  },
  {
    question: 'Come approcci la gestione degli errori nelle applicazioni?',
    answer: 'Implemento error handling a più livelli: error boundaries in React per catturare errori di rendering, try/catch nelle operazioni asincrone, messaggi di errore user-friendly tramite notifiche toast, logging centralizzato per il debugging e notifiche per errori critici in produzione. L\'utente finale non deve mai vedere uno stack trace o un\'interfaccia rotta: ogni errore deve essere gestito con grazia.',
  },
  {
    question: 'Puoi sviluppare sistemi di chat o messaggistica interna?',
    answer: 'Sì, ho implementato sistemi di chat real-time utilizzando Firestore come backend. Posso implementare chat 1-to-1, chat di gruppo, notifiche in tempo reale, storia dei messaggi e funzionalità come i messaggi letti/non letti. L\'integrazione con notifiche push FCM completa l\'esperienza anche quando l\'utente non è attivo sull\'applicazione.',
  },
  {
    question: 'Hai esperienza con gli emulatori Firebase per lo sviluppo locale?',
    answer: 'Sì, utilizzo sempre gli emulatori Firebase in locale per sviluppare senza toccare i dati di produzione. Configuro correttamente Firestore, Auth, Functions e Storage emulators per avere un ambiente di sviluppo stabile e sicuro. Questo approccio velocizza molto lo sviluppo, previene errori accidentali in produzione e permette di testare scenari complessi in sicurezza.',
  },
  {
    question: 'Puoi integrare sistemi di analytics come Google Analytics o Firebase Analytics?',
    answer: 'Sì, ho esperienza con Google Analytics 4, Firebase Analytics e Mixpanel. Implemento tracking di eventi personalizzati, funnel analysis e dashboard per monitorare il comportamento degli utenti. Configurando correttamente gli eventi fin dall\'inizio del progetto, i dati raccolti diventano un valore reale per le decisioni di business e per ottimizzare l\'esperienza utente nel tempo.',
  },
  {
    question: 'Sei in grado di fare refactoring di codice legacy?',
    answer: 'Sì, il refactoring è una delle attività che trovo più soddisfacenti. Mi approccio con sistematicità: capisco prima il codice esistente, identifico i punti critici, scrivo test dove possibile, poi procedo con il refactoring in modo incrementale. L\'obiettivo è sempre migliorare la manutenibilità e le performance senza introdurre regressioni nel comportamento esistente.',
  },
  {
    question: 'Come gestisci gli ambienti di sviluppo, staging e produzione?',
    answer: 'Utilizzo variabili d\'ambiente separate per ogni ambiente, con file .env per il frontend (con prefisso VITE_) e Firebase config per il backend. Il flusso tipico prevede: sviluppo locale con emulatori Firebase, testing su ambiente di staging, e deploy in produzione solo dopo validazione completa. Questo garantisce che nessun cambiamento non testato raggiunga mai gli utenti finali.',
  },
  {
    question: 'Hai esperienza avanzata con TypeScript?',
    answer: 'Sì, TypeScript è il mio standard: non scrivo JavaScript puro da molto tempo. Uso generics per componenti e funzioni riutilizzabili, utility types (Pick, Omit, Partial, Record), discriminated unions per stati complessi e branded types quando necessario. La type safety che TypeScript garantisce è fondamentale per la manutenibilità e la scalabilità dei progetti nel lungo periodo.',
  },
  {
    question: 'Puoi sviluppare soluzioni per la gestione documentale?',
    answer: 'Sì, posso sviluppare sistemi di gestione documentale con upload, organizzazione in cartelle, preview, ricerca, controllo degli accessi e versioning. Firebase Storage con Firestore per i metadati è una combinazione molto efficace per questo tipo di soluzione. Posso anche integrare con Google Drive o SharePoint se l\'azienda usa già questi strumenti.',
  },
  {
    question: 'Hai esperienza nella generazione automatica di PDF o report?',
    answer: 'Sì, so generare PDF lato server tramite Firebase Functions usando librerie come Puppeteer o PDFKit. Questo è utilissimo per fatture, report periodici, certificati o qualsiasi documento che debba essere generato automaticamente. I PDF generati possono essere salvati su Firebase Storage e inviati automaticamente via email o tramite WhatsApp.',
  },
  {
    question: 'Come ti mantieni aggiornato sulle nuove tecnologie?',
    answer: 'Studio costantemente: seguo la documentazione ufficiale delle tecnologie che uso, leggo blog tecnici, guardo conferenze come React Conf e Google I/O, e sperimento con progetti personali. Sono particolarmente attento agli sviluppi nel campo dell\'AI applicata allo sviluppo software. La curiosità e la voglia di imparare sono per me un motore continuo, non un dovere professionale.',
  },
  {
    question: 'Puoi ottimizzare le query Firestore per grandi volumi di dati?',
    answer: 'Sì, conosco le best practice di Firestore: uso corretto degli indici compositi, query su campi indicizzati, paginazione con cursors (startAfter, limit), denormalizzazione strategica dei dati per ridurre le letture e subcollection per dati gerarchici. Progetto sempre la struttura del database tenendo in mente i pattern di accesso e i costi di lettura/scrittura per evitare sorprese in produzione.',
  },
  {
    question: 'Hai esperienza nell\'integrazione con sistemi ERP aziendali?',
    answer: 'Ho esperienza nell\'integrazione tramite API con sistemi ERP e software gestionali. Quando mi trovo di fronte a una tecnologia nuova, mi documento rapidamente e trovo il modo di costruire i bridge necessari. Ogni integrazione parte dall\'analisi dei flussi di dati, degli endpoint disponibili e dei requisiti di sicurezza dell\'azienda.',
  },
  {
    question: 'Sai realizzare animazioni web complesse?',
    answer: 'Sì, ho esperienza con GSAP (GreenSock) per animazioni avanzate, incluse ScrollTrigger per le animazioni al scroll, timeline animate, e transizioni fluide. So anche usare le CSS animations e transitions per effetti più semplici. Le animazioni sono un elemento fondamentale per creare esperienze utente memorabili e professionali, e so quando usarle con misura per non appesantire l\'UX.',
  },
  {
    question: 'Puoi implementare un sistema di ricerca full-text nei miei dati?',
    answer: 'Sì, posso implementare ricerca full-text integrando servizi come Algolia o Typesense con Firebase, che offrono risultati immediati e rilevanti. Per casi più semplici, so implementare ricerche basilari direttamente su Firestore. La scelta della soluzione dipende dal volume di dati, dalla complessità delle query e dal budget del progetto.',
  },
  {
    question: 'Quali sono i tuoi valori fondamentali come sviluppatore?',
    answer: 'Qualità, affidabilità e passione genuina per quello che faccio. Non consegno codice di cui non vado fiero. Rispetto le scadenze e comunico tempestivamente se emergono imprevisti. Tratto ogni progetto, piccolo o grande, con la stessa dedizione, perché so che dietro ogni applicazione c\'è un business reale e persone reali che la usano ogni giorno. Quando incontro un ostacolo, non mi fermo finché non trovo una soluzione.',
  },
  {
    question: 'Hai esperienza con WebSocket o comunicazione bidirezionale in tempo reale?',
    answer: 'Sì, ho esperienza con comunicazione real-time tramite i listener di Firestore e, per scenari più specifici, con WebSocket nativi e librerie come Socket.io. Conosco i pattern di gestione delle connessioni, la gestione dei fallback e le best practice per applicazioni real-time efficienti e scalabili. La comunicazione bidirezionale è essenziale per applicazioni collaborative moderne.',
  },
  {
    question: 'Sai sviluppare Progressive Web App (PWA)?',
    answer: 'Sì, so trasformare applicazioni web in PWA complete con service worker per il funzionamento offline, Web App Manifest per l\'installazione, cache delle risorse per performance ottimali e integrazione con le notifiche push. Le PWA sono spesso la soluzione ideale per chi vuole un\'esperienza simile a un\'app mobile senza i costi e la complessità di sviluppare app native separate per iOS e Android.',
  },
];

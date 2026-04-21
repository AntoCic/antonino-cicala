export type ProjectCategory = 'principale' | 'iniziali';

export interface Project {
  id: string;
  name: string;
  description: string;
  tech: string[];
  image: string;
  date: string;
  demoUrl?: string;
  githubUrl?: string;
  videoUrl?: string;
  category?: ProjectCategory;
}

// Order in display:
// 1. category === 'principale' (top projects)
// 2. category === undefined (normal, sorted by date asc)
// 3. category === 'iniziali' (early/starter projects, always last)

export const projects: Project[] = [
  // ── Principali ────────────────────────────────────────────
  {
    id: 'cortexcic',
    name: 'cortexCic',
    description: 'Dashboard personale per gestire task Kanban, push notification real-time e integrazioni con servizi esterni tramite API key.',
    tech: ['React', 'TypeScript', 'Firebase', 'Redux'],
    image: '/img/site.png',
    date: '2024-11-01',
    demoUrl: 'https://cortexcic.web.app',
    githubUrl: 'https://github.com/AntoCic/cortexCic',
    category: 'principale',
  },
  {
    id: 'beauty',
    name: 'Beauty',
    description: 'Gestionale per estetisti con gestione appuntamenti, spese e preferenze clienti. Integrazione Google Calendar, WhatsApp e statistiche. Backend serverless su Netlify.',
    tech: ['Vue', 'Firebase', 'MongoDB', 'Bootstrap', 'Sass', 'Vite'],
    image: 'https://cnc-beauty.netlify.app/img/logo.png',
    date: '2024-09-07',
    demoUrl: 'https://cnc-beauty.netlify.app/',
    videoUrl: 'https://raw.githubusercontent.com/AntoCic/portfolio/main/public/beauty.mp4',
    category: 'principale',
  },
  {
    id: 'movietest',
    name: 'MovieTest',
    description: 'Libreria di film e serie TV con ricerca avanzata per genere e lingua, pagine di dettaglio e salvataggio preferiti in locale. Integra TMDB API.',
    tech: ['Vue', 'Bootstrap', 'Sass', 'Vite'],
    image: 'https://raw.githubusercontent.com/AntoCic/frontend-challenge-main/refs/heads/main/public/img/logo.png',
    date: '2024-10-10',
    demoUrl: 'https://movietest-vue.netlify.app/',
    githubUrl: 'https://github.com/AntoCic/frontend-challenge-main',
    category: 'principale',
  },
  {
    id: 'stayhub',
    name: 'StayHub',
    description: 'Clone Airbnb con autenticazione frontend, CRUD appartamenti, ricerca su mappa via raggio (TomTom API), pagamenti (Braintree) e statistiche Chart.js.',
    tech: ['Laravel', 'Vue', 'PHP', 'Bootstrap', 'Sass', 'Vite'],
    image: 'https://raw.githubusercontent.com/Andrea-Calligari/boolbnb-team-6/main/front_office_vue/public/img/logo.svg',
    date: '2024-07-17',
    githubUrl: 'https://github.com/Andrea-Calligari/boolbnb-team-6',
    videoUrl: 'https://raw.githubusercontent.com/Andrea-Calligari/boolbnb-team-6/main/StayHub.mp4',
    category: 'principale',
  },
  {
    id: 'tripcicrem',
    name: 'TripCicRem',
    description: 'App per organizzare viaggi e conservare ricordi con foto, mappe TomTom SDK, autenticazione Firebase e backend serverless Netlify. Template riutilizzabile per future app.',
    tech: ['Vue', 'Firebase', 'Bootstrap', 'Sass', 'Vite'],
    image: 'https://raw.githubusercontent.com/AntoCic/travel-app/main/public/img/logo.png',
    date: '2024-08-12',
    demoUrl: 'https://cic-travel-app.netlify.app/',
    githubUrl: 'https://github.com/AntoCic/travel-app',
    category: 'principale',
  },

  // ── Senza categoria (ordine temporale) ────────────────────
  {
    id: 'curriculum',
    name: 'Curriculum',
    description: 'Primo sito personale per presentare i dati del curriculum vitae.',
    tech: ['HTML', 'CSS', 'JavaScript'],
    image: 'https://antonino-cicala.netlify.app/img/logo.png',
    date: '2023-07-05',
    demoUrl: 'https://antonino-cicala.netlify.app/',
    githubUrl: 'https://github.com/AntoCic/Curriculum',
  },
  {
    id: 'cocktaildb',
    name: 'CocktailDB',
    description: 'Uno dei primi siti realizzati per testare le conoscenze di JavaScript e le chiamate API esterne.',
    tech: ['HTML', 'CSS', 'JavaScript'],
    image: 'https://ac-cocktaildb.netlify.app/img/logo.png',
    date: '2023-11-28',
    demoUrl: 'https://ac-cocktaildb.netlify.app/',
    githubUrl: 'https://github.com/AntoCic/cocktailDB',
  },
  {
    id: 'cicbomb',
    name: 'CicBomb',
    description: 'Campo minato (Minesweeper) — gioco di logica per scoprire tutte le caselle non minate senza far esplodere le mine.',
    tech: ['HTML', 'CSS', 'JavaScript', 'Bootstrap'],
    image: 'https://cicbomb.netlify.app/img/fav.png',
    date: '2024-03-21',
    demoUrl: 'https://cicbomb.netlify.app/',
    githubUrl: 'https://github.com/AntoCic/MPP_campominato',
  },
  {
    id: 'cicmind',
    name: 'CicMind',
    description: 'Mastermind — gioco di logica in cui il PC crea un codice segreto e il giocatore deve decifrarlo entro un numero limitato di tentativi.',
    tech: ['HTML', 'CSS', 'JavaScript', 'Bootstrap', 'Sass'],
    image: 'https://cicmind.netlify.app//img/fav.png',
    date: '2024-03-25',
    demoUrl: 'https://cicmind.netlify.app/',
    githubUrl: 'https://github.com/AntoCic/MPP_mastermind',
  },
  {
    id: 'warrior',
    name: 'Warrior (Game Creator)',
    description: 'Progetto di team per consolidare Laravel: operazioni CRUD, autenticazione e gestione ruoli per una piattaforma di creazione giochi.',
    tech: ['Laravel', 'PHP', 'MySQL', 'Bootstrap', 'Sass'],
    image: 'https://raw.githubusercontent.com/MarinaLasorsa/game-creator/main/resources/img/utility/logo.png',
    date: '2024-05-31',
    githubUrl: 'https://github.com/MarinaLasorsa/game-creator',
    videoUrl: 'https://raw.githubusercontent.com/MarinaLasorsa/game-creator/main/warrior.mp4',
  },
  {
    id: 'portfolio-vue',
    name: 'Portfolio Vue',
    description: 'Portfolio personale interamente modificabile tramite Notion API. Design dinamico con dati sincronizzati dal proprio spazio Notion.',
    tech: ['Vue', 'Bootstrap', 'Sass', 'Vite', 'Notion'],
    image: 'https://portfolio-antocic.netlify.app/img/logo.png',
    date: '2024-06-24',
    demoUrl: 'https://portfolio-antocic.netlify.app/',
    githubUrl: 'https://github.com/AntoCic/portfolio',
    videoUrl: 'https://raw.githubusercontent.com/AntoCic/portfolio/main/public/video_portfolio.mp4',
  },
  {
    id: 'watchflick',
    name: 'WatchFlick',
    description: 'Libreria di film e serie TV con Redux store, React Router e TMDB API. Creato per mettere alla prova React e Tailwind.',
    tech: ['React', 'Tailwind', 'Redux', 'Vite'],
    image: 'https://raw.githubusercontent.com/AntoCic/watchflick/main/public/logo.png',
    date: '2024-07-24',
    demoUrl: 'https://watchflick.netlify.app/',
    githubUrl: 'https://github.com/AntoCic/watchflick',
  },
  {
    id: 'textfacade',
    name: 'TextFacade',
    description: 'App Node/Express che analizza file di testo (upload o URL): conta parole, lettere, spazi e trova le parole più frequenti. Pattern Facade.',
    tech: ['Node.js', 'Express', 'JavaScript', 'Bootstrap'],
    image: 'https://raw.githubusercontent.com/AntoCic/test_Tecnico_Deploy/main/logo.png',
    date: '2024-07-27',
    demoUrl: 'https://test-tecnico-ub.netlify.app/',
    githubUrl: 'https://github.com/AntoCic/AntoninoCicala_Test_tecnico',
  },
  {
    id: 'firebase-secrets-cli',
    name: 'firebase-secrets-cli',
    description: 'Pacchetto npm per gestire i secret di Firebase Functions con generazione automatica dei type TypeScript e config condivisa.',
    tech: ['TypeScript', 'Node.js', 'Firebase'],
    image: '/img/repo.png',
    date: '2024-10-01',
    githubUrl: 'https://github.com/AntoCic/firebase-secrets-cli',
  },

  // ── Iniziali ──────────────────────────────────────────────
  {
    id: 'template-react',
    name: 'Template React',
    description: 'Template React con Redux, Tailwind CSS e React Router. Base di partenza per nuovi progetti.',
    tech: ['React', 'Tailwind', 'Vite'],
    image: 'https://raw.githubusercontent.com/AntoCic/template-react/main/public/logo.png',
    date: '2024-07-24',
    demoUrl: 'https://template-react-antocic.netlify.app/',
    githubUrl: 'https://github.com/AntoCic/template-react',
    category: 'iniziali',
  },
  {
    id: 'template-vue-bootstrap',
    name: 'Template Vue + Bootstrap',
    description: 'Template base con Vue, Bootstrap, Sass, storage reattivo, Vue Router e integrazione Netlify serverless.',
    tech: ['Vue', 'Bootstrap', 'Sass', 'Vite'],
    image: 'https://raw.githubusercontent.com/AntoCic/TEMP_vue_bootstrap/main/public/img/logo.png',
    date: '2024-08-09',
    demoUrl: 'https://temp-vue-bootstrap.netlify.app/',
    githubUrl: 'https://github.com/AntoCic/TEMP_vue_bootstrap',
    category: 'iniziali',
  },
  {
    id: 'template-html',
    name: 'Template HTML/CSS/JS',
    description: 'Template base HTML, CSS e JavaScript con struttura pulita e integrazione Netlify serverless.',
    tech: ['HTML', 'CSS', 'JavaScript'],
    image: 'https://temp-html-css-js.netlify.app/src/img/logo.png',
    date: '2024-08-08',
    demoUrl: 'https://temp-html-css-js.netlify.app/',
    githubUrl: 'https://github.com/AntoCic/TEMP_html-css-js',
    category: 'iniziali',
  },
  {
    id: 'template-vue-firebase',
    name: 'Template Vue + Firebase',
    description: 'Template Vue con Firebase (auth, Realtime DB, storage), Vue Router, Bootstrap e Netlify serverless. Include validate.js per i form.',
    tech: ['Vue', 'Firebase', 'Bootstrap', 'Sass', 'Vite'],
    image: 'https://raw.githubusercontent.com/AntoCic/TEMP_vue-bootstrap-firebase/main/public/img/logo.png',
    date: '2024-08-13',
    demoUrl: 'https://temp-vue-bootstrap-firebase.netlify.app/',
    githubUrl: 'https://github.com/AntoCic/TEMP_vue-bootstrap-firebase',
    category: 'iniziali',
  },
  {
    id: 'pj-preview-video',
    name: 'Preview Video',
    description: 'Piccolo sito per mostrare preview video di progetti direttamente da GitHub.',
    tech: ['HTML', 'CSS', 'JavaScript'],
    image: 'https://raw.githubusercontent.com/AntoCic/pj-preview-video/main/logo_pc.png',
    date: '2024-07-17',
    demoUrl: 'https://pj-preview-video.netlify.app/',
    githubUrl: 'https://github.com/AntoCic/pj-preview-video',
    category: 'iniziali',
  },
];

export function getSortedProjects(): Project[] {
  const principali = projects.filter((p) => p.category === 'principale');
  const normali = projects
    .filter((p) => !p.category)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const iniziali = projects.filter((p) => p.category === 'iniziali');
  return [...principali, ...normali, ...iniziali];
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string | null;
  location: string;
  description: string;
  type: 'tech' | 'hospitality' | 'other';
}

export const experiences: Experience[] = [
  {
    id: 'click-it',
    company: 'CLICK IT',
    role: 'Stagista IT',
    startDate: '2014-04-01',
    endDate: '2014-05-01',
    location: 'Sciacca, AG',
    description: 'Durante lo stage ho appreso come smontare e rimontare computer, riconoscendo e sostituendo le componenti danneggiate.',
    type: 'tech',
  },
  {
    id: 'civil-defence',
    company: 'Civil Defence',
    role: 'Assistente Bagnanti',
    startDate: '2016-07-01',
    endDate: '2016-08-31',
    location: 'Marsala, TP',
    description: 'Controllavo la sicurezza di chi frequentava gli stabilimenti balneari. Esperto negli interventi di soccorso in acqua.',
    type: 'other',
  },
  {
    id: 'signor-sassi',
    company: 'Signor Sassi',
    role: 'Commí · Barback',
    startDate: '2016-09-01',
    endDate: '2017-03-01',
    location: 'London, UK',
    description: 'Ristorante italiano a Londra. Partito da assistente cameriere sono arrivato a gestire autonomamente la caffetteria.',
    type: 'hospitality',
  },
  {
    id: 'oblix',
    company: 'Oblix, The Shard',
    role: 'Bartender',
    startDate: '2017-03-01',
    endDate: '2018-06-01',
    location: 'London, UK',
    description: 'Ristorante al 32° piano del grattacielo più alto di Londra. Appreso il mestiere del bartender a livello avanzato, migliorata la conoscenza dell\'inglese interagendo con clientela internazionale.',
    type: 'hospitality',
  },
  {
    id: 'soho-house',
    company: 'Soho House Barcelona',
    role: 'Bartender',
    startDate: '2018-10-04',
    endDate: '2019-12-16',
    location: 'Barcelona, Spagna',
    description: 'Club House esclusivo per clienti selezionati. Appresa la lingua spagnola e perfezionato l\'inglese lavorando in un contesto internazionale.',
    type: 'hospitality',
  },
  {
    id: 'verdura',
    company: 'Verdura Resort · Rocco Forte',
    role: 'Bartender',
    startDate: '2020-08-01',
    endDate: '2023-11-01',
    location: 'Sciacca, AG',
    description: 'Resort di lusso con contratti stagionali. Operato sia in team che individualmente con eccellenti risultati in termini di incassi e soddisfazione clienti.',
    type: 'hospitality',
  },
  {
    id: 'boolean',
    company: 'Boolean',
    role: 'Jr Full Stack Web Developer Trainee',
    startDate: '2024-01-23',
    endDate: '2024-07-17',
    location: 'Full remote',
    description: 'Bootcamp intensivo full stack. Ho lavorato su molti progetti collaborativi e individuali utilizzando HTML, CSS, JavaScript, Vue, React, PHP, Laravel, Node.js, MySQL, Firebase e molto altro.',
    type: 'tech',
  },
  {
    id: 'freelance',
    company: 'Freelance',
    role: 'Full Stack Developer',
    startDate: '2024-07-17',
    endDate: null,
    location: 'Remote',
    description: 'Sviluppo di applicazioni web su misura, dashboard, tool interni e pacchetti npm. Specializzato in React, TypeScript, Firebase e Vue.',
    type: 'tech',
  },
];

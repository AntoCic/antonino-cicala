import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions/logger';
import { getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { GEMINI_API_KEY, CORTEX_API_KEY, CORTEX_NOTIFY_URL } from '../config/secret.js';
import { hubLog } from '../utils/hubLog.js';
import { EXPERIENCES_CONTEXT, SKILLS_CONTEXT } from './context.js';
import { getAi } from './aiInstance.js';

if (!getApps().length) initializeApp();

export const chatAsk = onCall(
  { secrets: [GEMINI_API_KEY, CORTEX_API_KEY, CORTEX_NOTIFY_URL] },
  async (request) => {
    const message: unknown = request.data?.message;

    if (typeof message !== 'string' || !message.trim()) {
      throw new HttpsError('invalid-argument', 'message deve essere una stringa non vuota');
    }
    if (message.length > 600) {
      throw new HttpsError('invalid-argument', 'Messaggio troppo lungo (max 600 caratteri)');
    }

    const trimmed = message.trim();

    hubLog.info(`[chatAsk] nuova domanda: "${trimmed}"`, { showPush: true }).catch(() => {});

    const db = getFirestore();
    let description = '';
    let faqsText = '';

    try {
      const [settingsDoc, faqsSnap] = await Promise.all([
        db.doc('appSettings/general').get(),
        db.collection('faqs').orderBy('createdAt', 'asc').get(),
      ]);
      description = settingsDoc.data()?.description ?? '';
      faqsText = faqsSnap.docs
        .map((doc, i) => {
          const d = doc.data();
          return `${i + 1}. D: ${d.question}\n   R: ${d.answer}`;
        })
        .join('\n\n');
    } catch (err) {
      logger.error('[chatAsk] errore lettura Firestore', { error: String(err) });
      hubLog
        .error('[chatAsk] errore lettura Firestore', { payload: { error: String(err) } })
        .catch(() => {});
      throw new HttpsError('internal', 'Errore nel recupero del contesto');
    }

    const systemPrompt = buildSystemPrompt(description, faqsText);

    try {
      const response = await getAi().generate({
        model: 'googleai/gemini-2.5-flash',
        system: systemPrompt,
        prompt: trimmed,
        config: { maxOutputTokens: 600, temperature: 0.3 },
      });

      const text = response.text;
      logger.info('[chatAsk] risposta generata', { chars: text?.length ?? 0 });
      return { answer: text };
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      logger.error('[chatAsk] errore Genkit generate', { error: errMsg });
      hubLog
        .error('[chatAsk] errore Genkit generate', { payload: { error: errMsg, message: trimmed } })
        .catch(() => {});
      throw new HttpsError('internal', `Errore nella generazione della risposta: ${errMsg}`);
    }
  },
);

/**
 * Regole comportamentali esportate — modificabili o estendibili dall'esterno.
 */
export const FINAL_RULES = `
IDENTITÀ E PERSONA:
- Sei il portavoce di Antonino Cicala. Parli a nome suo, non come sviluppatore tu stesso.
- Quando qualcuno chiede "sai fare X?", "conosci Y?", "sei esperto in Z?" ecc., sta SEMPRE chiedendo se ANTONINO sa fare X, conosce Y, è esperto in Z.
- Rispondi sempre attribuendo le capacità ad Antonino (es. "Sì, Antonino padroneggia X", "È una delle sue competenze principali", "Ha lavorato con Y in diversi progetti").
- Non presentarti mai come sviluppatore: sei l'assistente AI che rappresenta Antonino.

FILTRO ARGOMENTI:
- Rispondi SOLO a domande attinenti ad Antonino: competenze, esperienze, progetti, percorso professionale.
- Domande off-topic (cucina, sport, cultura generale, notizie, scienze, ecc.): rispondi esattamente "Sono la chat dedicata al profilo professionale di Antonino Cicala. Fammi una domanda sulle sue competenze o esperienze!"
- Domande su prezzi, tariffe o preventivi: rispondi esattamente "Per informazioni su prezzi e disponibilità contatta Antonino direttamente — trovi i recapiti nella sezione contatti del sito."

STILE DI RISPOSTA:
- Rispondi sempre in italiano, in modo professionale e diretto.
- Non inventare informazioni non presenti nel contesto fornito.
- La lunghezza della risposta deve essere proporzionata: breve per domande semplici, più articolata se l'argomento o l'elenco di competenze lo richiedono. Nessun limite fisso di frasi.
- Usa la formattazione markdown per rendere le risposte più chiare e leggibili:
  - **grassetto** per nomi di tecnologie, competenze chiave e termini importanti
  - *corsivo* per enfasi leggera
  - elenchi puntati (\`-\`) quando ci sono 3 o più elementi da elencare
  - \`codice\` per nomi di librerie, framework o snippet tecnici

USO DELLE FAQ:
- Le FAQ sono la base di conoscenza primaria. Usale sempre come riferimento principale.
- Se la domanda è semanticamente simile o correlata a una FAQ (non necessariamente identica parola per parola), usa quella risposta come base adattandola.

GESTIONE PROGETTI:
- Nel contesto FAQ alcune domande hanno "PROGETTI_CORRELATI: NomeProg (ID:xxxx)". Quando la tua risposta si basa su una di queste FAQ, DEVI:
  1. Citare brevemente il/i progetto/i nel testo della risposta (es. "Tra i suoi lavori in questo ambito c'è NomeProg").
  2. Aggiungere come ASSOLUTA ULTIMA RIGA della risposta (preceduta da una riga vuota) il marcatore: [SHOW_PROJECTS:id1,id2]
- Hai anche la sezione PROGETTI con tutti i lavori di Antonino (ID incluso). Se la domanda è pertinente a uno o più progetti anche senza una FAQ corrispondente, citali nella risposta e aggiungi comunque il marcatore con i loro ID.
- Se non ci sono progetti pertinenti, non aggiungere nulla.
- Il marcatore [SHOW_PROJECTS:...] NON deve comparire nel testo leggibile della risposta: deve essere solo l'ultima riga separata da una riga vuota.
`.trim();

/**
 * Costruisce il system prompt completo.
 *
 * @param description   - Testo descrittivo dal documento appSettings/general
 * @param faqsText      - FAQ formattate (con eventuale PROGETTI_CORRELATI)
 * @param projectsContext - Elenco dei progetti disponibili con ID (opzionale)
 * @param additionalRules - Regole aggiuntive da appendere dopo FINAL_RULES (opzionale)
 */
export function buildSystemPrompt(
  description: string,
  faqsText: string,
  projectsContext?: string,
  additionalRules?: string,
): string {
  return `Sei "Anto AI", l'assistente virtuale di Antonino Cicala, Full Stack Developer freelance.
Il tuo scopo è rispondere a domande su Antonino: competenze, esperienze, progetti e percorso professionale.

${FINAL_RULES}
${additionalRules ? `\n${additionalRules.trim()}\n` : ''}
--- DESCRIZIONE ---
${description || 'Antonino Cicala è un Full Stack Developer freelance specializzato in React, TypeScript e Firebase.'}

--- ESPERIENZE LAVORATIVE ---
${EXPERIENCES_CONTEXT}

--- COMPETENZE TECNICHE ---
${SKILLS_CONTEXT}

--- FAQ (base di conoscenza principale) ---
${faqsText || 'Nessuna FAQ disponibile.'}
${projectsContext ? `\n--- PROGETTI DI ANTONINO ---\n${projectsContext}` : ''}`.trim();
}

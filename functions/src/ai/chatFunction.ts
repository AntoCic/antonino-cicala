import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions/logger';
import { getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { GEMINI_API_KEY, CORTEX_API_KEY, CORTEX_NOTIFY_URL } from '../config/secret.js';
import { hubLog } from '../utils/hubLog.js';
import { EXPERIENCES_CONTEXT, SKILLS_CONTEXT } from './context.js';

if (!getApps().length) initializeApp();

let ai: ReturnType<typeof genkit> | null = null;

function getAi() {
  if (!ai) {
    ai = genkit({ plugins: [googleAI({ apiKey: GEMINI_API_KEY.value() })] });
  }
  return ai;
}

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

    // Notifica su ogni richiesta ricevuta
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

    const systemPrompt = `Sei "Anto AI", l'assistente virtuale di Antonino Cicala, un Full Stack Developer freelance.
Il tuo unico scopo è rispondere a domande su Antonino: competenze, esperienze lavorative, progetti e percorso professionale.

REGOLE DI COMPORTAMENTO:
- Rispondi SOLO a domande che riguardano Antonino, il suo lavoro, le sue competenze o esperienze.
- Se la domanda è generica o non riguarda Antonino (es. cultura generale, notizie, altri argomenti), rispondi gentilmente: "Sono una chat dedicata alle informazioni professionali su Antonino Cicala. Ti invito a farmi domande sulle sue competenze, esperienze o progetti — sarò felice di aiutarti!"
- Se ti chiedono prezzi, tariffe o preventivi, rispondi: "Per informazioni su prezzi e disponibilità ti invito a contattare Antonino direttamente — trovi tutti i recapiti nella sezione contatti del sito."
- Rispondi sempre in italiano, in modo conciso e professionale.
- Non inventare informazioni che non sono nel contesto fornito.
- Risposte brevi e chiare, al massimo 3-4 frasi salvo domande che richiedono elenchi.

--- DESCRIZIONE ---
${description || 'Antonino Cicala è un Full Stack Developer freelance specializzato in React, TypeScript e Firebase.'}

--- ESPERIENZE LAVORATIVE ---
${EXPERIENCES_CONTEXT}

--- COMPETENZE TECNICHE ---
${SKILLS_CONTEXT}

--- FAQ ---
${faqsText || 'Nessuna FAQ disponibile.'}`;

    try {
      const response = await getAi().generate({
        model: 'googleai/gemini-2.5-flash',
        system: systemPrompt,
        prompt: trimmed,
        config: { maxOutputTokens: 450, temperature: 0.3 },
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

import { onRequest } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions/logger';
import { getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { GEMINI_API_KEY, CORTEX_API_KEY, CORTEX_NOTIFY_URL } from '../config/secret.js';
import { hubLog } from '../utils/hubLog.js';
import { getAi } from './aiInstance.js';
import { buildSystemPrompt } from './chatFunction.js';

if (!getApps().length) initializeApp();

export const chatAskStream = onRequest(
  {
    cors: true,
    secrets: [GEMINI_API_KEY, CORTEX_API_KEY, CORTEX_NOTIFY_URL],
  },
  async (req, res) => {
    if (req.method === 'OPTIONS') {
      res.status(204).send('');
      return;
    }

    if (req.method !== 'POST') {
      res.status(405).send('Method Not Allowed');
      return;
    }

    const message: unknown = req.body?.message;

    if (typeof message !== 'string' || !message.trim()) {
      res.status(400).json({ error: 'message deve essere una stringa non vuota' });
      return;
    }
    if (message.length > 600) {
      res.status(400).json({ error: 'Messaggio troppo lungo (max 600 caratteri)' });
      return;
    }

    const trimmed = message.trim();

    hubLog.info(`[chatAskStream]: "${trimmed}"`, { showPush: true }).catch(() => {});

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
      logger.error('[chatAskStream] errore lettura Firestore', { error: String(err) });
      hubLog
        .error('[chatAskStream] errore lettura Firestore', { payload: { error: String(err) } })
        .catch(() => {});
      res.status(500).json({ error: 'Errore nel recupero del contesto' });
      return;
    }

    const systemPrompt = buildSystemPrompt(description, faqsText);

    // SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
      const { stream, response } = getAi().generateStream({
        model: 'googleai/gemini-2.5-flash',
        system: systemPrompt,
        prompt: trimmed,
        config: { maxOutputTokens: 450, temperature: 0.3 },
      });

      for await (const chunk of stream) {
        const text = chunk.text;
        if (text) {
          res.write(`data: ${JSON.stringify({ chunk: text })}\n\n`);
        }
      }

      await response;
      res.write('data: [DONE]\n\n');
      res.end();

      logger.info('[chatAskStream] stream completato');
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      logger.error('[chatAskStream] errore stream Genkit', { error: errMsg });
      hubLog
        .error('[chatAskStream] errore stream Genkit', {
          payload: { error: errMsg, message: trimmed },
        })
        .catch(() => {});
      // Se gli header SSE sono già stati inviati non possiamo cambiare status
      res.write(`data: ${JSON.stringify({ error: errMsg })}\n\n`);
      res.end();
    }
  },
);

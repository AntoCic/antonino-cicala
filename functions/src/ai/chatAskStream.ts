import { onRequest } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions/logger';
import { getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { GEMINI_API_KEY, CORTEX_API_KEY, CORTEX_NOTIFY_URL } from '../config/secret.js';
import { hubLog } from '../utils/hubLog.js';
import { getAi } from './aiInstance.js';
import { buildSystemPrompt } from './chatFunction.js';

if (!getApps().length) initializeApp();

type HistoryMessage = { role: 'user' | 'model'; text: string };

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

    const rawHistory: unknown = req.body?.history;
    const history: HistoryMessage[] = Array.isArray(rawHistory)
      ? (rawHistory as HistoryMessage[]).filter(
          (h) =>
            typeof h === 'object' &&
            h !== null &&
            (h.role === 'user' || h.role === 'model') &&
            typeof h.text === 'string',
        )
      : [];

    const db = getFirestore();

    let description = '';
    let behavioralRules = '';
    let chatNotifications = true;
    let faqsText = '';
    let projectsContext = '';

    try {
      const [settingsDoc, faqsSnap, projectsSnap] = await Promise.all([
        db.doc('appSettings/general').get(),
        db.collection('faqs').orderBy('createdAt', 'asc').get(),
        db.collection('projects').orderBy('order', 'asc').get(),
      ]);

      const settings = settingsDoc.data() ?? {};
      description = settings.description ?? '';
      behavioralRules = settings.behavioralRules ?? '';
      chatNotifications = settings.chatNotifications ?? true;

      type ProjectData = { name: string; tech?: string[]; description?: string };
      const projectsMap = new Map<string, ProjectData>(
        projectsSnap.docs.map((d) => [d.id, d.data() as ProjectData]),
      );

      faqsText = faqsSnap.docs
        .map((doc, i) => {
          const d = doc.data();
          let text = `${i + 1}. D: ${d.question}\n   R: ${d.answer}`;
          const ids: string[] = d.projectIds ?? [];
          if (ids.length) {
            const named = ids
              .map((id) => {
                const p = projectsMap.get(id);
                return p ? `${p.name} (ID:${id})` : null;
              })
              .filter((n): n is string => n !== null);
            if (named.length) {
              text += `\n   PROGETTI_CORRELATI: ${named.join(', ')}`;
            }
          }
          return text;
        })
        .join('\n\n');

      projectsContext = projectsSnap.docs
        .map((d) => {
          const p = d.data() as ProjectData;
          const tech = p.tech?.slice(0, 5).join(', ') ?? '';
          return `- ${p.name} (ID:${d.id})${tech ? ` | ${tech}` : ''}`;
        })
        .join('\n');
    } catch (err) {
      logger.error('[chatAskStream] errore lettura Firestore', { error: String(err) });
      hubLog
        .error('[chatAskStream] errore lettura Firestore', { payload: { error: String(err) } })
        .catch(() => {});
      res.status(500).json({ error: 'Errore nel recupero del contesto' });
      return;
    }

    if (chatNotifications) {
      hubLog.info(`[chatAskStream]: "${trimmed}"`, { showPush: true }).catch(() => {});
    }

    const systemPrompt = buildSystemPrompt(
      description,
      faqsText,
      projectsContext,
      behavioralRules || undefined,
    );

    // SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
      const messages = [
        ...history.map((h) => ({
          role: h.role,
          content: [{ text: h.text }],
        })),
        { role: 'user' as const, content: [{ text: trimmed }] },
      ];

      const { stream, response } = getAi().generateStream({
        model: 'googleai/gemini-2.5-flash',
        system: systemPrompt,
        messages,
        config: { maxOutputTokens: 700, temperature: 0.3 },
      });

      let fullText = '';

      for await (const chunk of stream) {
        const text = chunk.text;
        if (text) {
          fullText += text;
          res.write(`data: ${JSON.stringify({ chunk: text })}\n\n`);
        }
      }

      await response;

      logger.info('[chatAskStream] full response', { tail: fullText.slice(-200) });

      const markerMatch = fullText.match(/\[SHOW_PROJECTS:([^\]]+)\]/);
      if (markerMatch) {
        const ids = markerMatch[1]
          .split(',')
          .map((id) => id.trim())
          .filter(Boolean);
        if (ids.length) {
          logger.info('[chatAskStream] projectIds trovati', { ids });
          res.write(`data: ${JSON.stringify({ projectIds: ids })}\n\n`);
        }
      }

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
      res.write(`data: ${JSON.stringify({ error: errMsg })}\n\n`);
      res.end();
    }
  },
);

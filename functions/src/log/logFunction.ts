import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions/logger';
import { CORTEX_API_KEY, CORTEX_NOTIFY_URL } from '../config/secret.js';
import { hubLog, HubLogLevel, HubLogOptions } from '../utils/hubLog.js';

const VALID_TYPES: HubLogLevel[] = ['info', 'error', 'warning', 'deploy'];

interface LogEventData {
  type: HubLogLevel;
  message: string;
  options?: HubLogOptions;
}

export const logEvent = onCall({ secrets: [CORTEX_API_KEY, CORTEX_NOTIFY_URL] }, async (request) => {
  const { type, message, options } = request.data as LogEventData;
  logger.info('[logEvent] called', { type, message });

  if (!VALID_TYPES.includes(type)) {
    throw new HttpsError('invalid-argument', `Invalid log type: "${type}". Must be one of: ${VALID_TYPES.join(', ')}`);
  }
  if (typeof message !== 'string' || !message) {
    throw new HttpsError('invalid-argument', 'message must be a non-empty string');
  }

  try {
    await hubLog[type](message, options);
    logger.info('[logEvent] hubLog completed', { type, message });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.error('[logEvent] hubLog failed', { error: msg, type, message });
    throw new HttpsError('failed-precondition', `hubLog failed: ${msg}`);
  }
});

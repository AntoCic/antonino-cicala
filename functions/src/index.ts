import { setGlobalOptions } from 'firebase-functions';
import { CORTEX_API_KEY, CORTEX_NOTIFY_URL } from './config/secret.js';
import { REGION } from './config/config.js';

setGlobalOptions({
  region: REGION,
  maxInstances: 10,
  secrets: [CORTEX_API_KEY, CORTEX_NOTIFY_URL],
});

export { logEvent } from './log/logFunction.js';
export { chatAsk } from './ai/chatFunction.js';
export { chatAskStream } from './ai/chatAskStream.js';

import { CORTEX_API_KEY, CORTEX_NOTIFY_URL } from '../config/secret.js';

export type HubLogLevel = 'info' | 'error' | 'warning' | 'deploy';

export interface HubLogOptions {
  payload?: Record<string, unknown>;
  showPush?: boolean;
}

async function send(type: HubLogLevel, message: string, options?: HubLogOptions): Promise<void> {
  const apiKey = CORTEX_API_KEY.value();
  const notifyUrl = CORTEX_NOTIFY_URL.value();

  const res = await fetch(notifyUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': apiKey,
    },
    body: JSON.stringify({
      message,
      type,
      payload: options?.payload,
      showPush: options?.showPush ?? false,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`cortex responded ${res.status}: ${body}`);
  }
}

export const hubLog = {
  info: (msg: string, opts?: HubLogOptions) => send('info', msg, opts),
  error: (msg: string, opts?: HubLogOptions) => send('error', msg, opts),
  warning: (msg: string, opts?: HubLogOptions) => send('warning', msg, opts),
  deploy: (msg: string, opts?: HubLogOptions) => send('deploy', msg, opts),
};

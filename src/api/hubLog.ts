import { httpsCallable } from 'firebase/functions';
import { functions } from '../components/firebase/firebase';

export type HubLogLevel = 'info' | 'error' | 'warning' | 'deploy';

export interface HubLogOptions {
  payload?: Record<string, unknown>;
  showPush?: boolean;
}

const logEvent = httpsCallable(functions, 'logEvent');

async function send(type: HubLogLevel, message: string, options?: HubLogOptions): Promise<void> {
  try {
    await logEvent({ type, message, options });
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'code' in err && 'message' in err) {
      console.error(`[hubLog] notify error — code: ${(err as { code: string }).code}, message: ${(err as { message: string }).message}`);
    } else {
      console.error('[hubLog] notify error:', err);
    }
  }
}

export const hubLog = {
  info: (msg: string, opts?: HubLogOptions) => send('info', msg, opts),
  error: (msg: string, opts?: HubLogOptions) => send('error', msg, opts),
  warning: (msg: string, opts?: HubLogOptions) => send('warning', msg, opts),
  deploy: (msg: string, opts?: HubLogOptions) => send('deploy', msg, opts),
};

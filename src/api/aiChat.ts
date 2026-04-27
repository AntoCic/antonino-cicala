import { httpsCallable } from 'firebase/functions';
import { functions, app } from '../components/firebase/firebase';

const chatAskFn = httpsCallable<{ message: string }, { answer: string }>(functions, 'chatAsk');

export async function askAi(message: string): Promise<string> {
  const result = await chatAskFn({ message });
  return result.data.answer;
}

export type ChatHistoryMessage = { role: 'user' | 'model'; text: string };

function getStreamUrl(): string {
  const projectId = app.options.projectId!;
  const region = 'europe-west1';
  if (location.hostname === 'localhost') {
    return `http://localhost:5001/${projectId}/${region}/chatAskStream`;
  }
  return `https://${region}-${projectId}.cloudfunctions.net/chatAskStream`;
}

export async function askAiStream(
  message: string,
  onChunk: (chunk: string) => void,
  onProjects?: (ids: string[]) => void,
  history?: ChatHistoryMessage[],
): Promise<void> {
  const res = await fetch(getStreamUrl(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history }),
  });

  if (!res.ok || !res.body) {
    throw new Error(`HTTP ${res.status}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const data = line.slice(6).trim();
      if (data === '[DONE]') return;
      try {
        const parsed = JSON.parse(data) as { chunk?: string; error?: string; projectIds?: string[] };
        if (parsed.error) throw new Error(parsed.error);
        if (parsed.chunk) onChunk(parsed.chunk);
        if (parsed.projectIds) onProjects?.(parsed.projectIds);
      } catch (e) {
        if (e instanceof SyntaxError) continue;
        throw e;
      }
    }
  }
}

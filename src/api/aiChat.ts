import { httpsCallable } from 'firebase/functions';
import { functions } from '../components/firebase/firebase';

const chatAskFn = httpsCallable<{ message: string }, { answer: string }>(functions, 'chatAsk');

export async function askAi(message: string): Promise<string> {
  const result = await chatAskFn({ message });
  return result.data.answer;
}

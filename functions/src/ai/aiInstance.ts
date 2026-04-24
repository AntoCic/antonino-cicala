import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { GEMINI_API_KEY } from '../config/secret.js';

let ai: ReturnType<typeof genkit> | null = null;

export function getAi() {
  if (!ai) {
    ai = genkit({ plugins: [googleAI({ apiKey: GEMINI_API_KEY.value() })] });
  }
  return ai;
}

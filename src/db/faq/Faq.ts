import type { Timestamp } from 'firebase/firestore';

export interface Faq {
  id: string;
  question: string;
  answer: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type FaqWrite = Pick<Faq, 'question' | 'answer'>;

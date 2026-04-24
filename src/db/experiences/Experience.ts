import type { Timestamp } from 'firebase/firestore';

export type ExperienceType = 'tech' | 'hospitality' | 'other';

export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  description: string;
  tech: string[];
  location?: string;
  type?: ExperienceType;
  order: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type ExperienceWrite = Omit<Experience, 'id' | 'createdAt' | 'updatedAt'>;

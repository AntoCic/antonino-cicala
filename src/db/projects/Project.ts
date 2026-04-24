import type { Timestamp } from 'firebase/firestore';

export type ProjectCategory = 'principale' | 'iniziali';

export interface Project {
  id: string;
  name: string;
  description: string;
  tech: string[];
  image: string;
  date: string;
  demoUrl?: string;
  githubUrl?: string;
  videoUrl?: string;
  category?: ProjectCategory;
  order: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type ProjectWrite = Omit<Project, 'id' | 'createdAt' | 'updatedAt'>;

export const PROJECT_CATEGORIES: Array<{ value: ProjectCategory | ''; label: string }> = [
  { value: '', label: 'Normale' },
  { value: 'principale', label: 'Principale' },
  { value: 'iniziali', label: 'Iniziali' },
];

import type { Timestamp } from 'firebase/firestore';

export type SkillCategory = 'Frontend' | 'Backend' | 'Tools' | 'AI';

export interface Skill {
  id: string;
  name: string;
  icon: string;
  category: SkillCategory;
  order: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type SkillWrite = Pick<Skill, 'name' | 'icon' | 'category' | 'order'>;

export const SKILL_CATEGORIES: SkillCategory[] = ['Frontend', 'Backend', 'Tools', 'AI'];

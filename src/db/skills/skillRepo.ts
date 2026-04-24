import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../../components/firebase/firebase';
import type { Skill, SkillWrite } from './Skill';
import { skills as staticSkills } from '../../views/Home/cmp/data/skills';

const skillsCol = () => collection(db, 'skills');

export async function getAllSkills(): Promise<Skill[]> {
  const q = query(skillsCol(), orderBy('order', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Skill, 'id'>) }));
}

export async function createSkill(data: SkillWrite): Promise<string> {
  const ref = await addDoc(skillsCol(), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateSkill(id: string, data: Partial<SkillWrite>): Promise<void> {
  await updateDoc(doc(db, 'skills', id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteSkill(id: string): Promise<void> {
  await deleteDoc(doc(db, 'skills', id));
}

export async function seedSkills(): Promise<void> {
  const existing = await getDocs(skillsCol());
  const deleteBatch = writeBatch(db);
  existing.docs.forEach((d) => deleteBatch.delete(d.ref));
  await deleteBatch.commit();

  const insertBatch = writeBatch(db);
  staticSkills.forEach((s, i) => {
    const ref = doc(skillsCol());
    insertBatch.set(ref, {
      name: s.name,
      icon: s.icon,
      category: s.category,
      order: i,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });
  await insertBatch.commit();
}

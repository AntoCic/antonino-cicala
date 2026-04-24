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
import type { Experience, ExperienceWrite } from './Experience';
import { experiences as staticExperiences } from '../../views/Home/cmp/data/experiences';

const experiencesCol = () => collection(db, 'experiences');

export async function getAllExperiences(): Promise<Experience[]> {
  const q = query(experiencesCol(), orderBy('order', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Experience, 'id'>) }));
}

export async function createExperience(data: ExperienceWrite): Promise<string> {
  const ref = await addDoc(experiencesCol(), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateExperience(id: string, data: Partial<ExperienceWrite>): Promise<void> {
  await updateDoc(doc(db, 'experiences', id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteExperience(id: string): Promise<void> {
  await deleteDoc(doc(db, 'experiences', id));
}

export async function seedExperiences(): Promise<void> {
  const existing = await getDocs(experiencesCol());
  const deleteBatch = writeBatch(db);
  existing.docs.forEach((d) => deleteBatch.delete(d.ref));
  await deleteBatch.commit();

  const insertBatch = writeBatch(db);
  staticExperiences.forEach((e, i) => {
    const ref = doc(experiencesCol());
    const data: Record<string, unknown> = {
      company: e.company,
      role: e.role,
      startDate: e.startDate,
      description: e.description,
      location: e.location,
      type: e.type,
      tech: [],
      order: i,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    if (e.endDate) data.endDate = e.endDate;
    insertBatch.set(ref, data);
  });
  await insertBatch.commit();
}

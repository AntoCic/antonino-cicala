import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  writeBatch,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '../../components/firebase/firebase';
import type { Faq, FaqWrite } from './Faq';
import { FAQ_SEED_DATA } from './faqSeedData';

const faqsCol = () => collection(db, 'faqs');

export async function getAllFaqs(): Promise<Faq[]> {
  const q = query(faqsCol(), orderBy('createdAt', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Faq, 'id'>) }));
}

export async function createFaq(data: FaqWrite): Promise<string> {
  const ref = await addDoc(faqsCol(), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateFaq(id: string, data: Partial<FaqWrite>): Promise<void> {
  await updateDoc(doc(db, 'faqs', id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteFaq(id: string): Promise<void> {
  await deleteDoc(doc(db, 'faqs', id));
}

export async function seedFaqs(): Promise<void> {
  const batch = writeBatch(db);
  for (const item of FAQ_SEED_DATA) {
    const newDoc = doc(faqsCol());
    batch.set(newDoc, {
      ...item,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
  await batch.commit();
}

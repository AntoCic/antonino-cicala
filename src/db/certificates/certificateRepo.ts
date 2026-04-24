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
import type { Certificate, CertificateWrite } from './Certificate';

const certificatesCol = () => collection(db, 'certificates');

export async function getAllCertificates(): Promise<Certificate[]> {
  const q = query(certificatesCol(), orderBy('order', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Certificate, 'id'>) }));
}

export async function createCertificate(data: CertificateWrite): Promise<string> {
  const ref = await addDoc(certificatesCol(), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateCertificate(id: string, data: Partial<CertificateWrite>): Promise<void> {
  await updateDoc(doc(db, 'certificates', id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteCertificate(id: string): Promise<void> {
  await deleteDoc(doc(db, 'certificates', id));
}

const SEED_DATA = [
  { name: 'Boolean Bootcamp', issuer: 'Boolean', image: 'boolean.png', description: 'Certificato di completamento del bootcamp intensivo full stack — oltre 600 ore di formazione su HTML, CSS, JavaScript, PHP, Laravel, Vue e React.' },
  { name: 'React Certification', issuer: 'React', image: 'React.png', description: 'Certificazione sulle competenze avanzate di React: hooks, stato globale, ottimizzazione delle performance e architettura di componenti.' },
  { name: 'Hackathon Codemotion', issuer: 'Codemotion', image: 'hackathon-codemotion.png', description: "Partecipazione e riconoscimento all'hackathon Codemotion — sviluppo di un MVP in 24 ore in team multidisciplinare." },
  { name: 'Canva Design', issuer: 'Canva', image: 'canva.jpg', description: 'Certificazione sulle competenze di design grafico e comunicazione visiva con Canva.' },
];

export async function seedCertificates(): Promise<void> {
  const existing = await getDocs(certificatesCol());
  const deleteBatch = writeBatch(db);
  existing.docs.forEach((d) => deleteBatch.delete(d.ref));
  await deleteBatch.commit();

  const insertBatch = writeBatch(db);
  SEED_DATA.forEach((c, i) => {
    const ref = doc(certificatesCol());
    insertBatch.set(ref, { ...c, order: i, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  });
  await insertBatch.commit();
}

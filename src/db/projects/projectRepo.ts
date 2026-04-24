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
import type { Project, ProjectWrite } from './Project';
import { getSortedProjects } from '../../views/Home/cmp/data/projects';

const projectsCol = () => collection(db, 'projects');

export async function getAllProjects(): Promise<Project[]> {
  const q = query(projectsCol(), orderBy('order', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Project, 'id'>) }));
}

export async function createProject(data: ProjectWrite): Promise<string> {
  const ref = await addDoc(projectsCol(), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateProject(id: string, data: Partial<ProjectWrite>): Promise<void> {
  await updateDoc(doc(db, 'projects', id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteProject(id: string): Promise<void> {
  await deleteDoc(doc(db, 'projects', id));
}

export async function seedProjects(): Promise<void> {
  const existing = await getDocs(projectsCol());
  const deleteBatch = writeBatch(db);
  existing.docs.forEach((d) => deleteBatch.delete(d.ref));
  await deleteBatch.commit();

  const sorted = getSortedProjects();
  const insertBatch = writeBatch(db);
  sorted.forEach((p, i) => {
    const ref = doc(projectsCol());
    const data: Record<string, unknown> = {
      name: p.name,
      description: p.description,
      tech: p.tech,
      image: p.image,
      date: p.date,
      order: i,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    if (p.demoUrl) data.demoUrl = p.demoUrl;
    if (p.githubUrl) data.githubUrl = p.githubUrl;
    if (p.videoUrl) data.videoUrl = p.videoUrl;
    if (p.category) data.category = p.category;
    insertBatch.set(ref, data);
  });
  await insertBatch.commit();
}

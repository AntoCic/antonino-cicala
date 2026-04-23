import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  type Timestamp,
} from 'firebase/firestore';
import { db } from '../../components/firebase/firebase';
import type { UserProfile } from './User';

function userDoc(uid: string) {
  return doc(db, 'users', uid);
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(userDoc(uid));
  if (!snap.exists()) return null;
  const data = snap.data() as Omit<UserProfile, 'uid' | 'createdAt' | 'updatedAt'> & {
    createdAt: Timestamp;
    updatedAt: Timestamp;
  };
  return {
    uid: snap.id,
    ...data,
    createdAt: data.createdAt?.toDate().toISOString() ?? '',
    updatedAt: data.updatedAt?.toDate().toISOString() ?? '',
  };
}

export async function createUserProfile(
  uid: string,
  data: Pick<UserProfile, 'firstName' | 'lastName' | 'email' | 'photoURL'>,
  fcmToken?: string,
): Promise<void> {
  await setDoc(userDoc(uid), {
    ...data,
    fcmTokens: fcmToken ? [fcmToken] : [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateUserProfile(
  uid: string,
  patch: Partial<Pick<UserProfile, 'firstName' | 'lastName'>>,
): Promise<void> {
  await updateDoc(userDoc(uid), { ...patch, updatedAt: serverTimestamp() });
}

export async function addFcmToken(uid: string, token: string): Promise<void> {
  await updateDoc(userDoc(uid), { fcmTokens: arrayUnion(token), updatedAt: serverTimestamp() });
}

export async function removeFcmToken(uid: string, token: string): Promise<void> {
  await updateDoc(userDoc(uid), { fcmTokens: arrayRemove(token), updatedAt: serverTimestamp() });
}

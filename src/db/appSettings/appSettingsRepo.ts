import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../components/firebase/firebase';
import type { AppSettings } from './AppSettings';

const SETTINGS_DOC = () => doc(db, 'appSettings', 'general');

export async function getAppSettings(): Promise<AppSettings | null> {
  const snap = await getDoc(SETTINGS_DOC());
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    description: data.description ?? '',
    aiChatEnabled: data.aiChatEnabled ?? false,
    chatNotifications: data.chatNotifications ?? true,
    behavioralRules: data.behavioralRules ?? '',
  };
}

export async function updateAppSettings(data: Partial<AppSettings>): Promise<void> {
  await setDoc(SETTINGS_DOC(), { ...data, updatedAt: serverTimestamp() }, { merge: true });
}

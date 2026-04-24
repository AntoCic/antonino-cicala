import type { Timestamp } from 'firebase/firestore';

export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  image: string;
  description: string;
  url?: string;
  order: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type CertificateWrite = Omit<Certificate, 'id' | 'createdAt' | 'updatedAt'>;

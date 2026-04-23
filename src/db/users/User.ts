export interface UserProfile {
  uid: string;
  firstName: string;
  lastName: string;
  email: string | null;
  photoURL: string | null;
  fcmTokens: string[];
  permissions?: string[];
  createdAt: string;
  updatedAt: string;
}

export type UserProfileWrite = Omit<UserProfile, 'uid'>;

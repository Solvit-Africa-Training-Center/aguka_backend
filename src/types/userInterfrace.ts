export interface UserInterface {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: 'admin' | 'president' | 'secretary' | 'treasurer' | 'user';
  googleId?: string;
  provider?: string;
  groupId?: string; // 6-character group code
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

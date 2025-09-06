// src/types/contributionInterface.ts
export interface ContributionInterface {
  id: string;
  userId: string;
  groupId: string; // 6-character group code
  amount: number;
  paymentMethod: 'cash' | 'bank' | 'momo';
  contributionDate: Date;
  recordedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export type AddContributionInterface = Omit<
  ContributionInterface,
  'id' | 'createdAt' | 'updatedAt' | 'contributionDate'
>;

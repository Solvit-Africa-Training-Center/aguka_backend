export interface GroupInterface {
  id: string; // 6-character group code
  name: string;
  description: string;
  location: string[];
  profilePicture?: string;
  meetingLocation?: string;
  interestRate?: number;
  contact?: string;
  email?: string;
  minContribution: number;
  agreementTerms?: string;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: null;
}

export type AddGroupInterface = Omit<
  GroupInterface,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;

export interface GetAllGroups {
  groups: GroupInterface[];
}

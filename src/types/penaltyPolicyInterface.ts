export interface penaltyPolicyInterface {
  id: string;
  type: 'LOAN_OVERDUE' | 'DISCIPLINARY';
  rate: number;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ANNUALLY';
  gracePeriodDays: number;
  createdAt?: Date;
  updatedAt?: Date;
}

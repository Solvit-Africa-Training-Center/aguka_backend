export interface penaltyInterface {
  id: string;
  userId: string;
  loanId: string;
  type: 'LOAN_OVERDUE' | 'DISCIPLINARY';
  amount: number;
  paymentMethod: string;
  status: 'PENDING' | 'PAID';
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

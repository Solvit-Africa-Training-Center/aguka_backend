export interface repaymentInterface {
  id: string;
  loanId: string;
  userId: string;
  amount: number;
  paymentDate: Date;
  status: 'PENDING' | 'PAID' | 'LATE';
  remainingBalance: number;
  penaltyAmount: number;
  paymentMethod: string;
  createdAt: Date;
  updatedAt: Date;
}

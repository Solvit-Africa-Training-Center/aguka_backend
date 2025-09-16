export interface loanInterface {
  id: string;
  userId: string;
  amount: number;
  interestRate: number;
  totalPayable: number;
  startDate: Date;
  dueDate: Date;
  durationMonths: number;
  status: 'PENDING' | 'APPROVED' | 'DENIED';
  approvedBy: string | null;
  createdAt: Date;
  updatedAt: Date;
}

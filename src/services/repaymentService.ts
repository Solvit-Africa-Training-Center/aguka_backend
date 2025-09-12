import { Loan } from '../database/models/loan';
import PenaltyPolicy from '../database/models/penaltyPolicy';
import { Repayment } from '../database/models/repaymentModel';
import { repaymentInterface } from '../types/repaymentInterface';

export default class RepaymentService {
  static async createRepayment(data: {
    loanId: string;
    userId: string;
    amount: number;
    paymentDate: Date;
    paymentMethod: string;
  }): Promise<repaymentInterface> {
    const loan = await Loan.findByPk(data.loanId);
    if (!loan) throw new Error('Loan not found');

    const previousRepayments = await Repayment.findAll({
      where: { loanId: data.loanId },
    });

    const totalPaid = previousRepayments.reduce((sum, r) => sum + r.amount, 0);

    let remainingBalance = loan.amount - totalPaid - data.amount;

    let status: 'PENDING' | 'PAID' | 'LATE' = 'PENDING';

    let penaltyAmount = 0;
    if (loan.dueDate && data.paymentDate > loan.dueDate) {
      const penaltyPolicy = await PenaltyPolicy.findOne({
        where: { type: 'LOAN_OVERDUE' },
      });
      if (penaltyPolicy) {
        const overdueDays = Math.ceil(
          (data.paymentDate.getTime() - loan.dueDate.getTime()) / (1000 * 60 * 60 * 24),
        );

        if (overdueDays > penaltyPolicy.gracePeriodDays) {
          penaltyAmount =
            loan.amount *
            penaltyPolicy.rate *
            (overdueDays / this.frequencyToDays(penaltyPolicy.frequency));
        }
      }
    }

    if (remainingBalance <= 0) {
      status = 'PAID';
      remainingBalance = 0;
      // Mark loan as PAID
      loan.status = 'PAID';
      await loan.save();
    } else if (penaltyAmount > 0) {
      status = 'LATE';
    }

    const repayment = await Repayment.create({
      loanId: data.loanId,
      userId: data.userId,
      amount: data.amount,
      paymentDate: data.paymentDate,
      status,
      remainingBalance,
      penaltyAmount,
      paymentMethod: data.paymentMethod,
    });

    return repayment.toJSON() as repaymentInterface;
  }

  static async getAll(filters?: { userId?: string; loanId?: string; status?: string }) {
    const where: any = {};
    if (filters?.userId) where.userId = filters.userId;
    if (filters?.loanId) where.loanId = filters.loanId;
    if (filters?.status) where.status = filters.status;

    return await Repayment.findAll({ where });
  }

  static async getById(id: string) {
    const repayment = await Repayment.findByPk(id);
    if (!repayment) throw new Error('Repayment not found');
    return repayment;
  }

  static async update(id: string, data: Partial<repaymentInterface>) {
    const repayment = await Repayment.findByPk(id);
    if (!repayment) throw new Error('Repayment not found');

    await repayment.update(data);
    return repayment;
  }

  static async delete(id: string) {
    const repayment = await Repayment.findByPk(id);
    if (!repayment) throw new Error('Repayment not found');
    await repayment.destroy();
    return { message: 'Repayment has been deleted successfully' };
  }

  static async getRemainingBalance(loanId: string) {
    const loan = await Loan.findByPk(loanId);
    if (!loan) throw new Error('Loan not found');

    const repayments = await Repayment.findAll({ where: { loanId } });
    const totalPaid = repayments.reduce((sum, r) => sum + r.amount, 0);

    const penalties = repayments.reduce((sum, r) => sum + r.penaltyAmount, 0);

    const remainingBalance = loan.amount - totalPaid + penalties;

    return {
      loanId,
      totalLoan: loan.amount,
      totalPaid,
      totalPenalties: penalties,
      remainingBalance: remainingBalance < 0 ? 0 : remainingBalance,
    };
  }

  private static frequencyToDays(frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ANNUALLY'): number {
    switch (frequency) {
      case 'DAILY':
        return 1;
      case 'WEEKLY':
        return 7;
      case 'MONTHLY':
        return 30;
      case 'ANNUALLY':
        return 365;
      default:
        return 1;
    }
  }
}

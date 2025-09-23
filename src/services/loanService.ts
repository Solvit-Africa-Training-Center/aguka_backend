import { Loan } from '../database/models/loan';
import penaltyPolicyModel from '../database/models/penaltyPolicy';
import { User } from '../database/models/userModel';

class LoanService {
  // Interest rate is now always fetched from policy, not hardcoded

  async requestLoan(userId: string, amount: number, durationMonths: number) {
    // Check for existing active loan
    const activeLoan = await Loan.findOne({
      where: {
        userId,
        status: ['PENDING', 'APPROVED'],
      },
    });
    if (activeLoan) {
      throw new Error(
        'You already have an active loan. Please repay it before requesting another.',
      );
    }

    // Fetch interest rate from policies
    const policy = await penaltyPolicyModel.findOne({
      where: { type: 'LOAN_INTEREST' },
    });
    if (!policy) {
      throw new Error('Loan interest policy not found');
    }
    const rate = policy.rate;

    const startDate = new Date();
    const dueDate = new Date(startDate);
    dueDate.setMonth(dueDate.getMonth() + durationMonths);

    const interest = amount * rate * durationMonths;
    const totalPayable = amount + interest;

    return await Loan.create({
      userId,
      amount,
      interestRate: rate, // use 'interestRate' field for interest rate
      totalPayable,
      durationMonths,
      startDate,
      dueDate,
      status: 'PENDING',
      remainingBalance: totalPayable,
    });
  }

  async processLoan(id: string, approverId: string, approverRole: string, approve: boolean) {
    const loan = await Loan.findByPk(id);
    if (!loan) throw new Error('Loan not found');

    if (loan.status !== 'PENDING') throw new Error('Loan already processed');

    if (approverRole !== 'president' && approverRole !== 'treasurer') {
      throw new Error('Only President and Treasurer can approve/deny loans');
    }

    loan.status = approve ? 'APPROVED' : 'DENIED';
    loan.approvedBy = approverId;

    return await loan.save();
  }

  async approveLoan(id: string, approverId: string, approverRole: string) {
    return await this.processLoan(id, approverId, approverRole, true);
  }

  async denyLoan(id: string, approverId: string, approverRole: string) {
    return await this.processLoan(id, approverId, approverRole, false);
  }

  async getLoan(id: string) {
    return await Loan.findByPk(id);
  }

  async getUserLoans(userId: string) {
    return await Loan.findAll({ where: { userId } });
  }

  async getGroupLoans(groupId: string) {
    const users = await User.findAll({ where: { groupId }, attributes: ['id'] });
    const userIds = users.map((u) => u.id);
    if (userIds.length === 0) return [];
    return await Loan.findAll({ where: { userId: userIds } });
  }

  async getAllLoans() {
    return await Loan.findAll();
  }

  async getLoansByStatus(status: string) {
    // Always use uppercase for status to match DB enum
    const normalizedStatus = status.toUpperCase();
    return await Loan.findAll({ where: { status: normalizedStatus } });
  }

  async getPendingLoans() {
    return await Loan.findAll({ where: { status: 'PENDING' } });
  }

  async getApprovedLoans() {
    return await Loan.findAll({ where: { status: 'APPROVED' } });
  }
  async getPaidLoans() {
    return await Loan.findAll({ where: { status: 'PAID' } });
  }

  async updateLoan(
    id: string,
    updateData: Partial<{ amount: number; durationMonths: number; status: string }>,
  ) {
    const loan = await Loan.findByPk(id);
    if (!loan) throw new Error('Loan not found');
    if (updateData.status) {
      updateData.status = updateData.status.toUpperCase();
    }
    Object.assign(loan, updateData);
    return await loan.save();
  }

  async deleteLoan(id: string) {
    const loan = await Loan.findByPk(id);
    if (!loan) throw new Error('Loan not found');
    await loan.destroy();
    return { message: 'Loan deleted successfully' };
  }
}

export default new LoanService();

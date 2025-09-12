import { Loan } from "../database/models/loan"
import { User } from "../database/models/userModel";

class LoanService {
  private INTEREST_RATE = 0.05; // 5% monthly interest rate

  async requestLoan(userId: string, amount: number, durationMonths: number) {
    const startDate = new Date();
    const dueDate = new Date(startDate);
    dueDate.setMonth(dueDate.getMonth() + durationMonths);

    const interest = amount * this.INTEREST_RATE * durationMonths;
    const totalPayable = amount + interest;

    return await Loan.create({
      userId,
      amount,
      interestRate: this.INTEREST_RATE,
      totalPayable,
      durationMonths,
      startDate,
      dueDate,
      status: "PENDING",
    });
  }

  async processLoan(id: string, approverId: string, approverRole: string, approve: boolean) {
    const loan = await Loan.findByPk(id);
    if (!loan) throw new Error("Loan not found");

    if (loan.status !== "PENDING") throw new Error("Loan already processed");

    if (approverRole !== "president" && approverRole !== "treasurer") {
      throw new Error("Only President and Treasurer can approve/deny loans");
    }

    loan.status = approve ? "APPROVED" : "DENIED";
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
    const userIds = users.map(u => u.id);
    if (userIds.length === 0) return [];
    return await Loan.findAll({ where: { userId: userIds } });
  }

  async getAllLoans() {
    return await Loan.findAll();
  }

  async getLoansByStatus(status: string) {
    return await Loan.findAll({ where: { status } });
  }

  async getPendingLoans() {
    return await Loan.findAll({ where: { status: "PENDING" } });
  }

  async getApprovedLoans() {
    return await Loan.findAll({ where: { status: "APPROVED" } });
  }

  async updateLoan(id: string, updateData: Partial<{ amount: number; durationMonths: number; status: string }>) {
    const loan = await Loan.findByPk(id);
    if (!loan) throw new Error("Loan not found");
    Object.assign(loan, updateData);
    return await loan.save();
  }

  async deleteLoan(id: string) {
    const loan = await Loan.findByPk(id);
    if (!loan) throw new Error("Loan not found");
    await loan.destroy();
    return { message: "Loan deleted successfully" };
  }
}

export default new LoanService();

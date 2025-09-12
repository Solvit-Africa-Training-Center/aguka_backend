import { v4 as uuidv4 } from 'uuid';
import { penaltyInterface } from '../types/penaltyInterface';
import { Penalty } from '../database/models/penaltyModel';

class PenaltyService {
  async createPenalty(data: Omit<penaltyInterface, 'id' | 'createdAt' | 'updatedAt' | 'status'>) {
    const penalty = await Penalty.create({
      ...data,
      id: uuidv4(),
      status: 'PENDING',
    });

    return penalty;
  }

  async getAllPenalties() {
    return await Penalty.findAll();
  }

  async getUserPenalties(userId: string) {
    return await Penalty.findAll({ where: { userId } });
  }
  async payPenalty(penaltyId: string, paymentMethod: string) {
    const penalty = await Penalty.findByPk(penaltyId);
    if (!penalty) throw new Error('Penalty not found');
    if (penalty.type === 'LOAN_OVERDUE') {
      throw new Error('Loan overdue penalties must be paid via loan repayment');
    }

    penalty.status = 'PAID';
    penalty.paymentMethod = paymentMethod;
    await penalty.save();
    return penalty;
  }

  async deletePenalty(penaltyId: string) {
    const penalty = await Penalty.findByPk(penaltyId);
    if (!penalty) throw new Error('Penalty not found');
    await penalty.destroy();
    return { message: 'Penalty deleted successfully' };
  }
}
export default new PenaltyService();

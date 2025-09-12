import Policy from '../database/models/penaltyPolicy';
import { penaltyPolicyInterface as PolicyInterface } from '../types/penaltyPolicyInterface';

export class PoliciesService {
  async getPolicyByType(type: string): Promise<PolicyInterface | null> {
    return await Policy.findOne({ where: { type } });
  }
  async createPolicy(data: Omit<PolicyInterface, 'id' | 'createdAt' | 'updatedAt'>) {
    const policy = await Policy.create(data);
    return policy;
  }

  async getAllPolicies(): Promise<PolicyInterface[]> {
    return await Policy.findAll();
  }

  async getPolicyById(id: string): Promise<PolicyInterface | null> {
    return await Policy.findByPk(id);
  }

  async updatePolicy(
    id: string,
    data: Partial<Omit<PolicyInterface, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<PolicyInterface | null> {
    const policy = await Policy.findByPk(id);
    if (!policy) return null;
    await policy.update(data);
    return policy;
  }

  async deletePolicy(id: string): Promise<boolean> {
    const deleted = await Policy.destroy({ where: { id } });
    return deleted > 0;
  }
}

export default new PoliciesService();

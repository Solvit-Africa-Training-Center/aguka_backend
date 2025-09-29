import { Contribution } from '../database/models/contributionModel';


export class ContributionService {
  static async addContribution(data: {
    userId: string;
    groupId: string;
    amount: number;
    paymentMethod: 'cash' | 'bank' | 'momo';
    recordedBy: string;
  }) {
    return Contribution.create({
      ...data,
      contributionDate: new Date(),
    });
  }

  static async getMemberContributions(userId: string, groupId: string) {
    return Contribution.findAll({ where: { userId, groupId } });
  }

  static async getGroupTotalContributions(groupId: string) {
    const total = await Contribution.sum('amount', { where: { groupId } });
    return { groupId, total, users: await Contribution.findAll({ where: { groupId }, attributes: ['userId'] }) };
  }
}

// src/services/contributionService.ts
import { Contribution } from '../database/models/contributionModel';
import { Op } from 'sequelize';

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

  // static async getMemberTodayContributions(userId: string, groupId: string) {
  //   const today = new Date();
  //   const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  //   const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  //   return Contribution.findAll({
  //     where: {
  //       userId,
  //       groupId,
  //       contributionDate: {
  //         [Op.between]: [startOfDay, endOfDay],
  //       },
  //     },
  //   });
  // }

  // static async getGroupContributions(groupId: string) {
  //   return Contribution.findAll({ where: { groupId } });
  // }
  // static async updateContribution(
  //   id: string,
  //   data: { amount?: number; paymentMethod?: 'cash' | 'bank' | 'momo' },
  // ) {
  //   const contribution = await Contribution.findByPk(id);
  //   if (!contribution) {
  //     throw new Error('Contribution not found');
  //   }

  //   if (data.amount !== undefined) contribution.amount = data.amount;
  //   if (data.paymentMethod !== undefined) contribution.paymentMethod = data.paymentMethod;

  //   await contribution.save();
  //   return contribution;
  // }

  // static async deleteContribution(id: string) {
  //   const contribution = await Contribution.findByPk(id);
  //   if (!contribution) return null;
  //   await contribution.destroy();
  //   return true;
  // }

  // static async getGroupTotalContributions(groupId: string) {
  //   const total = await Contribution.sum('amount', { where: { groupId } });
  //   return { groupId, total };
  // }
}

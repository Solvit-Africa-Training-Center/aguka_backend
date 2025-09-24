import { Contribution } from '../database/models/contributionModel';
import { Loan } from '../database/models/loan';
import { Penalty } from '../database/models/penaltyModel';
import { User } from '../database/models/userModel';

export class DividendService {
  static async getUserDividend(userId: string, groupId: string) {
    const userContributions = await Contribution.sum('amount', { where: { userId, groupId } });
    const groupContributions = await Contribution.sum('amount', { where: { groupId } });

    const groupUsers = await User.findAll({ where: { groupId }, attributes: ['id'] });
    const groupUserIds = groupUsers.map((u) => u.id);

    const groupLoans = await Loan.findAll({
      where: { userId: groupUserIds, status: 'APPROVED' },
      attributes: ['amount', 'totalPayable'],
    });

    const groupLoanInterest = groupLoans.reduce(
      (sum, loan) => sum + ((loan.totalPayable || 0) - (loan.amount || 0)),
      0,
    );

    const groupPenalties = await Penalty.sum('amount' as any, {
      where: { userId: groupUserIds },
    });

    const userSharePercent = groupContributions
      ? (userContributions / groupContributions) * 100
      : 0;
    const groupEarnings = (groupLoanInterest || 0) + (groupPenalties || 0);
    const userShare = groupEarnings * (userSharePercent / 100);

    const userLoanBalance = await Loan.sum('remainingBalance' as any, {
      where: { userId, status: 'APPROVED' },
    });

    const userDividend = (userContributions || 0) + userShare - (userLoanBalance || 0);

    return {
      userContributions,
      userShare,
      userLoanBalance,
      userDividend,
      userSharePercent,
      groupContributions,
      groupLoanInterest,
      groupPenalties,
    };
  }

  static async getGroupDividend(groupId: string) {
    const groupContributions = await Contribution.sum('amount', { where: { groupId } });

    const groupUsers = await User.findAll({ where: { groupId }, attributes: ['id'] });
    const groupUserIds = groupUsers.map((u) => u.id);

    const groupLoans = await Loan.findAll({
      where: { userId: groupUserIds, status: 'APPROVED' },
      attributes: ['amount', 'totalPayable'],
    });

    const groupLoanInterest = groupLoans.reduce(
      (sum, loan) => sum + ((loan.totalPayable || 0) - (loan.amount || 0)),
      0,
    );

    const groupPenalties = await Penalty.sum('amount' as any, {
      where: { userId: groupUserIds },
    });

    const groupLoanBalance = await Loan.sum('remainingBalance' as any, {
      where: { userId: groupUserIds, status: 'APPROVED' },
    });

    const groupDividend =
      (groupContributions || 0) +
      (groupLoanInterest || 0) +
      (groupPenalties || 0) -
      (groupLoanBalance || 0);

    return {
      groupContributions,
      groupLoanInterest,
      groupPenalties,
      groupLoanBalance,
      groupDividend,
    };
  }
}

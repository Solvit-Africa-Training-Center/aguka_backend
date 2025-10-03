import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import { User } from '../database/models/userModel';
import { GroupModel } from '../database/models/groupModel';
import { Database } from '../database';
import { redis } from '../utils/redis';
import { v4 as uuidv4 } from 'uuid';
import { sendEmail } from '../utils/emailService';

const Group = GroupModel(Database.database);

const JWT_SECRET = process.env.JWT_SECRET as string;
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'refreshSecret';

class AuthService {
  async generateToken(user: any) {
    const jti = uuidv4();
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      groupId: user.groupId,
      isApproved: user.isApproved,
      jti,
    };
    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
    const refreshToken = jwt.sign({ id: user.id, jti }, REFRESH_SECRET, { expiresIn: '30d' });
    await redis.setEx(`refresh:${jti}`, 30 * 24 * 60 * 60, JSON.stringify(payload));

    return { accessToken, refreshToken };
  }

  async loginLocal(identifier: string, password: string) {
    if (!identifier || !password) throw new Error('Identifier and password required');

    const isEmail = identifier.includes('@');
    let user: any = null;
    if (isEmail) {
      const email = identifier.trim().toLowerCase();
      user = await User.findOne({ where: { email } });
    } else {
      const normalizedPhone = identifier.replace(/\D/g, '');
      // search both raw and normalized variants for flexibility
      user = await User.findOne({
        where: {
          [Op.or]: [{ phoneNumber: identifier }, { phoneNumber: normalizedPhone }],
        },
      });
    }

    if (!user) throw new Error('Invalid credentials');

    // If user registered with Google only (no password) tell them to use Google or to set password
    if (!user.password || user.password.length === 0) {
      throw new Error(
        'This account does not have a local password. Please sign in with Google or set a password.',
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid credentials');

    const { accessToken, refreshToken } = await this.generateToken(user);
    return { accessToken, refreshToken };
  }

  async completeProfile(userId: string, data: { phoneNumber: string; groupId: string }) {
    const group = await Group.findByPk(data.groupId);
    if (!group) {
      throw new Error('Invalid groupId: group not found');
    }

    const user = await User.findByPk(userId);
    if (!user) throw new Error('User not found');

    // Update user profile
    user.phoneNumber = data.phoneNumber;
    user.groupId = data.groupId;

    await user.save();

    // Return updated user (omit password if needed)
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phoneNumber: user.phoneNumber,
      groupId: user.groupId,
      isApproved: user.isApproved,
    };
  }

  async approveUser(userId: string, isApproved: boolean) {
    const user = await User.findByPk(userId);
    if (!user) throw new Error('User not found');

    await user.update({ isApproved });
    await sendEmail(
      user.email,
      user.name || user.email,
      isApproved
        ? 'Your account has been approved. You can now access all features.'
        : 'Your account has been disapproved. Please contact Aguka support for more information.',
    );

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      groupId: user.groupId,
      isApproved: user.isApproved,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = jwt.verify(refreshToken, REFRESH_SECRET) as any;
      const jti = payload.jti;
      const redisData = await redis.get(`refresh:${jti}`);
      if (!redisData) throw new Error('Refresh token revoked or expired');
      const user = await User.findByPk(payload.id);
      if (!user) throw new Error('User not found');

      const newJti = uuidv4();
      const newPayload = {
        id: user.id,
        email: user.email,
        role: user.role,
        groupId: user.groupId,
        isApproved: user.isApproved,
        jti: newJti,
      };
      const accessToken = jwt.sign(newPayload, JWT_SECRET, { expiresIn: '1d' });
      const newRefreshToken = jwt.sign({ id: user.id, jti: newJti }, REFRESH_SECRET, {
        expiresIn: '7d',
      });
      await redis.setEx(`refresh:${newJti}`, 7 * 24 * 60 * 60, JSON.stringify(newPayload));
      await redis.del(`refresh:${jti}`);
      return { accessToken, refreshToken: newRefreshToken };
    } catch (err: any) {
      throw new Error('Invalid or expired refresh token');
    }
  }

  async forgotPassword(email: string) {
    const user = await User.findOne({
      where: { email },
    });

    if (!user) throw new Error('User not found');
    const resetToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });

    // const resetLink = `${
    //   (process.env.FRONTEND_URL as string) || 'http://localhost:5173/'
    //   }/reset-password?token=${resetToken}`;
    
     const  resetLink = `${('https://aguka2025.vercel.app').replace(/\/+$/, '')}/reset-password?token=${resetToken}`;

    const message = `Click <a href="${resetLink}">
      here</a> to reset your password.
      This link will expire in 1 hour.`;

    await sendEmail(user.email, user.name || user.email, message);
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const payload = jwt.verify(token, JWT_SECRET) as any;
      const user = await User.findByPk(payload.id);

      if (!user) throw new Error('Invalid or expired token');
      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();
    } catch {
      throw new Error('Invalid or expired token');
    }
  }

  async logout(refreshToken: string) {
    try {
      const payload = jwt.verify(refreshToken, REFRESH_SECRET) as any;
      await redis.del(`refresh:${payload.jti}`);
    } catch {
      throw new Error('Invalid refresh token');
    }
  }
}

export default new AuthService();

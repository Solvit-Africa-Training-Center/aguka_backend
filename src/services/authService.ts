import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import { User } from '../database/models/userModel';
import { GroupModel } from '../database/models/groupModel';
import { Database } from '../database';

const Group = GroupModel(Database.database);

const JWT_SECRET = process.env.SESSION_SECRET as string;

class AuthService {
  generateToken(user: any) {
    return jwt.sign(
      {
        id: user.id,
        role: user.role,
        email: user.email,
        groupId: user.groupId,
        isApproved: user.isApproved,
      },
      JWT_SECRET,
      {
        expiresIn: '1d',
      },
    );
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

    const token = this.generateToken(user);
    return {
      token,
      // user: {
      //   id: user.id,
      //   name: user.name,
      //   email: user.email,
      //   role: user.role,
      //   groupId: user.groupId,
      //   isApproved: user.isApproved,
      // },
    };
  }

  // Google login - find or create user (used by passport strategy)
  async loginGoogle(profile: any) {
    console.log('AuthService loginGoogle profile:', profile);

    // Ensure email exists
    if (!profile.emails || profile.emails.length === 0) {
      throw new Error('No email provided by Google');
    }

    const email = profile.emails[0].value.toLowerCase();
    const displayName = profile.displayName || profile.name?.givenName || 'User';

    let user = await User.findOne({ where: { googleId: profile.id, provider: 'google' } });

    if (!user) {
      // Check if user exists with same email but different provider
      user = await User.findOne({ where: { email: email } });

      if (user) {
        // Update existing user with Google info
        await user.update({
          googleId: profile.id,
          provider: 'google',
          name: user.name || displayName,
        });
      } else {
        // Create new user
        user = await User.create({
          name: displayName,
          email: email,
          phoneNumber: null,
          password: null,
          role: 'user',
          provider: 'google',
          googleId: profile.id,
          groupId: null,
          isApproved: false,
        });
      }
    }

    const token = this.generateToken(user);
    return {
      token,
      // user: {
      //   id: user.id,
      //   name: user.name,
      //   email: user.email,
      //   role: user.role,
      //   groupId: user.groupId,
      //   isApproved: user.isApproved,
      // },
    };
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

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      groupId: user.groupId,
      isApproved: user.isApproved,
    };
  }
}

export default new AuthService();

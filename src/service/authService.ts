// src/services/authService.ts
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import { User } from "../database/models/user"; // adapt import to your project
import { GroupModel } from "../database/models/group";
import { Database } from "../database";

const Group = GroupModel(Database.database);

const JWT_SECRET = process.env.JWT_SECRET as string;

class AuthService {
  generateToken(user: any) {
    return jwt.sign({ id: user.id, role: user.role, email: user.email, groupId: user.groupId }, JWT_SECRET, {
      expiresIn: "1d",
    });
  }

  // Accept identifier (email or phone)
  async loginLocal(identifier: string, password: string) {
    if (!identifier || !password) throw new Error("Identifier and password required");

    const isEmail = identifier.includes("@");
    let user: any = null;

    if (isEmail) {
      const email = identifier.trim().toLowerCase();
      user = await User.findOne({ where: { email } });
    } else {
      // normalize phone: remove non-digits
      const normalizedPhone = identifier.replace(/\D/g, "");
      // search both raw and normalized variants for flexibility
      user = await User.findOne({
        where: {
          [Op.or]: [{ phoneNumber: identifier }, { phoneNumber: normalizedPhone }],
        },
      });
    }

    if (!user) throw new Error("Invalid credentials");

    // If user registered with Google only (no password) tell them to use Google or to set password
    if (!user.password || user.password.length === 0) {
      throw new Error("This account does not have a local password. Please sign in with Google or set a password.");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    const token = this.generateToken(user);
    return { token};
  }

  // Google login remains unchanged (but ensure provider/providerId are set in model)
  async loginGoogle(profile: any) {
    let user = await User.findOne({ where: { googleId: profile.id, provider: "google" } });
    if (!user) {
      user = await User.create({
        name: profile.displayName,
        email: profile.emails?.[0]?.value?.toLowerCase(),
        phoneNumber: "", // optional
        password: "", // no local password
        role: "user",
        provider: "google",
        googleId: profile.id,
        groupId: "",
      });
    }   
    const token = this.generateToken(user);
    return { token };
  }
async completeProfile(userId: string, data: { phoneNumber: string; groupId: string }) {
  
   const group = await Group.findByPk(data.groupId);
   console.log("Group is:", Group);
  if (!group) {
    throw new Error("Invalid groupId: group not found");
  }
  // Find user by ID
    const user = await User.findByPk(userId);
    console.log("User found:", user);
    if (!user) throw new Error("User not found");

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
    };
  }
}

export default new AuthService();

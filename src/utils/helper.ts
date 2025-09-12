import { config } from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { redis } from './redis';
import { v4 as uuidv4 } from 'uuid';

config();

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

export const secretKey = process.env.SESSION_SECRET || 'helloSolvit';

export const generateToken = async ({
  id,
  email,
  role,
  groupId,
}: {
  id: string;
  email: string;
  role: string;
  groupId: string;
}): Promise<string> => {
  const payload = { id, email, role, groupId };
  const jti = uuidv4();
  const tokenPayload = { ...payload, jti };
  const token = jwt.sign(tokenPayload, secretKey, { expiresIn: '12h' });

  await redis.setEx(`jwt:${jti}`, 12 * 60 * 60, JSON.stringify(tokenPayload));
  return token;
};

export const verifyToken = async (token: string): Promise<any> => {
    try {
        console.log('JWT_SECRET:', process.env.JWT_SECRET);
        console.log('Token received:', token);
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string ) as any;
        return decoded;
    } catch (error: any) {
        console.log('Token verification failed:', error.message);
    }
}
export const generateGroupCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};
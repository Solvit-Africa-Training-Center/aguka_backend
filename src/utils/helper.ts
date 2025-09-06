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
    const decoded = jwt.verify(token, secretKey) as any;

    // If token has JTI, check Redis storage
    if (decoded.jti) {
      const storedData = await redis.get(`jwt:${decoded.jti}`);
      if (!storedData) {
        throw new Error('Token not found in Redis - may have been revoked');
      }

      const isBlacklisted = await redis.get(`blacklist:${token}`);
      if (isBlacklisted) {
        throw new Error('Token has been blacklisted');
      }
    }

    return decoded;
  } catch (error: any) {
    console.log('Token verification failed:', error.message);
    throw error;
  }
};

export const destroyToken = async (token: string): Promise<void> => {
  try {
    await redis.setEx(`blacklist:${token}`, 24 * 60 * 60, 'true');
  } catch (error: any) {
    console.error('Error destroying token:', error.message);
  }
};

// Generate a 6-character alphanumeric group code
export const generateGroupCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

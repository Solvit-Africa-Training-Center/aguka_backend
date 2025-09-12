import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config();

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
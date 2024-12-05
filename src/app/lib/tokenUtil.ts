import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { UserRole } from '@/app/types/userRole';
import { NextRequest } from 'next/server';
import DecodedToken from '../types/decodedToken';

const secret = new TextEncoder().encode(process.env.SECRET_KEY || 'your-secret-key');

export const generateToken = (userId: string, role: UserRole): Promise<string> => {
    return new SignJWT({ id: userId, role })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('1h')
        .sign(secret);
};

export async function verifyToken(req: NextRequest): Promise<DecodedToken | null> {
    try {
        const token = req.cookies.get('token')?.value;
        if (!token) return null;

        // Verify the token and decode the payload
        const { payload } = await jwtVerify(token, secret);
        const decoded: DecodedToken = {
            id: payload.id as string,
            role: payload.role as UserRole,
          };
          return decoded;
    } catch (error) {
        console.error('Error verifying token:', error);
        return null;
    }
};

// Optional utility to get the user's role from the token payload
export const getUserRole = async (req: NextRequest): Promise<UserRole | null> => {
    const payload = await verifyToken(req);
    return payload?.role ? (payload.role as UserRole) : null;
};
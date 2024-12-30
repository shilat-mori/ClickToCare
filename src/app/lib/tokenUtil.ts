import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { UserRole } from '@/app/types/users/userRole';
import { NextRequest } from 'next/server';
import DecodedToken from '../types/decodedToken';

const secret = new TextEncoder().encode(process.env.SECRET_KEY || 'your-secret-key');

export const generateToken = (username: string, role: UserRole): Promise<string> => {
    console.log("generateToken - username: ", username);
    return new SignJWT({ username, role })
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
            username: payload.username as string,
            role: payload.role as UserRole,
        };
        return decoded;
    } catch (error) {
        console.error('Error verifying token:', error);
        return null;
    }
};
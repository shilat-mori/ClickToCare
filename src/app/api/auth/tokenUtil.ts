import jwt from 'jsonwebtoken';
import { UserRole } from '@/app/types/userRole';
import { NextRequest, NextResponse } from 'next/server';

const secret = process.env.SECRET_KEY || 'your-secret-key';

export const generateToken = (userId: string, role: UserRole) => {
    const payload = { id: userId, role };
    return jwt.sign(payload, secret, { expiresIn: '1h' });
};

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, secret) as { id: string; role: UserRole };
    } catch (error) {
        return null;
    }
};

export const getUserRole = (token: string): UserRole | null => {
    try {
        const decoded = verifyToken(token);
        return decoded?.role || null;
    } catch (error) {
        console.error('Error verifying token:', error);
        return null; // Return null if token is invalid or expired
    }
};

//a function to check if the user's role in included in the accepted roles
export function requireRole(requiredRole: UserRole) {
  return (req: NextRequest) => {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.redirect("/login");
    }

    const user = verifyToken(token);
    if (!user) {
      return NextResponse.redirect("/login");
    }

    if (user.role < requiredRole) {
      return NextResponse.redirect("/pages/waitingPage");
    }

    return NextResponse.next();
  };
}
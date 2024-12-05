"use client"
import { jwtVerify } from 'jose';

//check the cookies for the current user role (number from 1-3), or null if logged out
export async function getUserRoleFromCookies(): Promise<string | null> {
    // Check if running on the client-side
    if (typeof window === 'undefined') {
        return null;
    }
    // Get the token from cookies
    const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
    if (!token) return null;
    try {
        // Create the secret as Uint8Array (used for verification)
        const secret = new TextEncoder().encode(process.env.SECRET_KEY || 'your-secret-key');

        // Verify and decode the token
        const { payload } = await jwtVerify(token, secret);
        console.log("get role from cookies - role = " + payload.role);
        return payload.role as string || null;
    } catch (error) {
        console.error('Error verifying token:', error);
        return null;
    }
}

//remove token - for debugging?
export const removeToken = () => {
    // Set the cookie with an expired date to delete it
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
};


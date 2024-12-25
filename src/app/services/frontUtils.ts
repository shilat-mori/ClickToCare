"use client"
import { UserRole } from "../types/userRole";

function decodeJWT(token: string): any | null {
    const parts = token.split('.');

    if (parts.length !== 3) {
        console.error('Invalid token');
        return null;
    }

    // Decode the payload (second part) from base64url
    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const decoded = JSON.parse(atob(payload));  // `atob` decodes base64 encoded string
    return decoded;
}

//check the cookies for the current user role (number from 1-3), or null if logged out
export async function getUserRoleFromCookies(): Promise<UserRole | null> {
    // Check if running on the client-side
    if (typeof window === 'undefined') {
        return null;
    }
    // Get the token from cookies
    const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
    if (!token) return null;
    try {
        // Decode the token manually
        const decoded = decodeJWT(token);

        if (decoded && decoded.role) {
            console.log("User role from cookies:", decoded.role);
            return decoded.role as UserRole;
        }

        console.error('Role not found in token payload');
        return null;
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};

//check the cookies for the current user name (unique), or null if logged out
export async function getUsernameFromCookies(): Promise<string | null> {
    // Check if running on the client-side
    if (typeof window === 'undefined') {
        return null;
    }
    // Get the token from cookies
    const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
    if (!token) return null;
    try {
        // Decode the token manually
        const decoded = decodeJWT(token);

        if (decoded && decoded.username) {
            console.log("Username from cookies:", decoded.username);
            return decoded.username as string;
        }

        console.error('Username not found in token payload');
        return null;
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};

//remove token
export const removeToken = () => {
    // Set the cookie with an expired date to delete it
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
};


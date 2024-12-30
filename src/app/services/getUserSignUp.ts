"use client"
import axios from 'axios';
import { getUsernameFromCookies } from './frontUtils';
import INewUser from '../types/users/newUsers/newUser';

export const getUserSignUp = async () => {
    try {
        const username = await getUsernameFromCookies();
        if (!username) return { error: "username not found." };

        const response = await axios.get<INewUser>('/api/newUsers', {
            params: { username },
        });
        console.log(response.data);
        const data = Array.isArray(response.data) ? response.data : [response.data];
        return data[0];
    } catch (error) {
        return { error: "error: " + error }
    }

};
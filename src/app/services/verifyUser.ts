"use client"
import axios from 'axios';
import NewUser from '../lib/models/newUserSchema';

export const verifyUser = async (userId: string) => {
    try {
        //add newUser to all users
        //get user from newUser cluster
        const { data: newUser } = await axios.get(`/api/newUsers/${userId}`);
        if (!newUser || !newUser.userInfo) {
            console.error("User info not found in newUsers collection.");
            return;
        }
        //add the user info to the users cluster
        const resonseAdd = await axios.post('/api/users', newUser.userInfo);
        //remove user from newUser cluster
        const responseRemove = await axios.delete(`/api/newUsers/${userId}`);
        console.log('User Added:', resonseAdd.data);
        console.log('NewUser Removed:', responseRemove.data);
    } catch (error) {
        console.error('Error verifying a user: ', error);
    }
};
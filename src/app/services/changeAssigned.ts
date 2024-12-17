"use client"
import axios from 'axios';
import { getUsernameFromCookies } from "./frontUtils";
import { Assignee } from '../types/assignee';

//check if assigned to me
export const assignedToMe = async (taskId: string) => {
    const myUsername = await getUsernameFromCookies();
    if (!myUsername) return false; //does not matter, both add and remove won't do anything for a not found user
    try {
        const original = await axios.get(`/api/tasks/${taskId}`);
        const task = original.data;
        return (task.assigned.some((assignee: Assignee) => assignee.name === myUsername));
    }
    catch (error) {
        console.error('Error checking if assigned:', error);
    }
};

//remove assigned
export const removeMe = async (taskId: string) => {
    try {
        const myUsername = await getUsernameFromCookies();
        if (!myUsername) return null;
        return removeAssigned(taskId, myUsername);
    } catch (error) {
        console.error('Error finding username in cookies:', error);
        return null;
    }
};

//add assigned
export const addMe = async (taskId: string) => {
    try {
        const myUsername = await getUsernameFromCookies();
        const original = await axios.get(`/api/tasks/${taskId}`);
        const task = original.data;

        if (task.assigned.some((assignee: Assignee) => assignee.name === myUsername))
            return null;

        const newAssigned = [...task.assigned, { name: myUsername, assignedAt: new Date() }];
        const response = await axios.put(`/api/tasks/${taskId}`, {
            assigned: newAssigned
        });

        //update user score
        const userResponse = await axios.put('/api/users', {
            username: myUsername as string,
            addition: Number(task.points), //score is positive addition
        });

        const updatedTask = response.data.task;
        return updatedTask.assigned;
    } catch (error) {
        console.error('Error adding assigned user:', error);
        return null;
    }
};

//remove assigned by admin (chosen from drop menu)
const removeAssigned = async (taskId: string, usernameToRemove: string) => {
    try {
        const original = await axios.get(`/api/tasks/${taskId}`);
        const task = await original.data;

        // Remove the specified username from the assigned list
        const updatedAssigned = task.assigned.filter(
            (assignee: Assignee) => assignee.name !== usernameToRemove
        );

        // Update the task in the backend
        const response = await axios.put(`/api/tasks/${taskId}`, {
            assigned: updatedAssigned
        });

        //update user score
        const userResponse = await axios.put('/api/users', {
            username: usernameToRemove as string,
            addition: -Number(task.points), //remove - the score is a negative addition
        });

        const updatedTask = response.data.task;
        return updatedTask.assigned;
    } catch (error) {
        console.error('Error removing assigned user:', error);
        return null;
    }
};
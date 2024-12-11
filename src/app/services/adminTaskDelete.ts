"use client"
import axios from 'axios';

export const deleteTask = async (taskId: string) => {
    try {
        const response = await axios.delete(`/api/tasks/${taskId}`);
        console.log('Task deleted:', response.data);
    } catch (error) {
        console.error('Error deleting task: ', error);
    }
};
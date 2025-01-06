"use client"
import axios from "axios"
import ITask from "../types/tasks/tasks";
import { getUsernameFromCookies } from "./frontUtils";

export const getMyTasks = async () => {
    try {
        const username = await getUsernameFromCookies();
        const response = await axios.get<ITask[]>('/api/tasks', {
            params: { username },
        });
        return(response.data);
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
};
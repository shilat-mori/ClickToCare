"use client"
import { getMyTasks } from '@/app/services/getMyTasks';
import ITask from '@/app/types/tasks';
import React, { useEffect, useState } from 'react'
import { TasksByDayProps } from '@/app/types/taskByDayProps';
import { getUsernameFromCookies } from '@/app/services/frontUtils';

const TasksByDay: React.FC<TasksByDayProps> = ({ range }) => {
    const [tasks, setTasks] = useState<ITask[]>([]);
    const [loading, setLoading] = useState(true);
    const [myName, setMyName] = useState("");

    // Date Range Calculation
    const today = new Date();
    const startDate = new Date();

    // Group Tasks by Day
    const tasksByDay: Record<string, ITask[]> = {};

    useEffect(() => {
        const fetchTasks = async () => {
            setLoading(true);
            const fetchedTasks = await getMyTasks();
            if (fetchedTasks) setTasks(fetchedTasks);
            setLoading(false);
        };
        fetchTasks();
        const fetchName = async () => {
            setLoading(true);
            const fetchedName = await getUsernameFromCookies();
            if (fetchedName) setMyName(fetchedName);
            setLoading(false);
        };
        fetchName();
    }, []);

    if (range === 'week') {
        startDate.setDate(today.getDate() - 7);
    } else {
        startDate.setMonth(today.getMonth() - 1);
    }
    startDate.setHours(0, 0, 0, 0);

    tasks.forEach(task => {
        const found = task.assigned.find(assignee => assignee.name === myName);
        if (!found) return;

        const assignedDate = new Date(found.assignedAt).setHours(0, 0, 0, 0);
        if (assignedDate >= startDate.setHours(0, 0, 0, 0) && assignedDate <= today.setHours(0, 0, 0, 0)) {
            const dateKey = new Date(found.assignedAt).toLocaleDateString();
            if (!tasksByDay[dateKey]) {
                tasksByDay[dateKey] = [];
            }
            tasksByDay[dateKey].push(task);
        }
    });

    return (
        <div>
            {loading ? (
                <p>Loading tasks...</p>
            ) : Object.keys(tasksByDay).length > 0 ? (
                Object.entries(tasksByDay).map(([date, dayTasks]) => (
                    <div key={date} className="p-4 rounded shadow-md my-2">
                        <h3 className="font-bold text-lg">{date}</h3>
                        {dayTasks.map(task => (
                            <div key={task._id} className="ml-4 p-2 border-l-4 border-blue-500">
                                Task: {task.name} <br />
                                Category: {task.category} <br />
                                Points: {task.points}
                            </div>
                        ))}
                    </div>
                ))
            ) : (
                <p>No tasks assigned during this period.</p>
            )}
        </div>
    );
}

export default TasksByDay;
"use client"
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getMyTasks } from '@/app/services/getMyTasks';
import ITask from '@/app/types/tasks';
import { getUsernameFromCookies } from '@/app/services/frontUtils';

//learn code
 
const TaskActivityGraph = ({ view = 'week' }: { view: 'week' | 'month' }) => {
    const [tasks, setTasks] = useState<ITask[]>([]);
    const [loading, setLoading] = useState(true);
    const [myName, setMyName] = useState("");

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

    // Utility to get the date (year, month, day) without the time 'yyyy-mm-dd'
    const getDateKey = (date: Date) => {
        return date.toISOString().split('T')[0];
    };

    // Get array of all dates in the week/month range
    const getAllDatesInRange = (view: 'week' | 'month') => {
        const today = new Date();
        const startDate = new Date();
        const allDates: string[] = [];

        if (view === 'week') {
            startDate.setDate(today.getDate() - 7);
        }
        if (view === 'month') {
            startDate.setMonth(today.getMonth() - 1);
        }

        // Loop through the range and get all dates
        let currentDate = new Date(startDate);
        while (currentDate <= today) {
            allDates.push(getDateKey(currentDate));
            currentDate.setDate(currentDate.getDate() + 1); // Increment by 1 day
        }

        return allDates;
    };

    // Group tasks by day
    const groupByDay = () => {
        const grouped: { [key: string]: { totalPoints: number, tasks: { name: string, points: number }[] } } = {};

        tasks.forEach((task) => {
            task.assigned.forEach((assignee) => {
                if (assignee.name !== myName)
                    return;

                const taskDate = getDateKey(new Date(assignee.assignedAt));

                // If this date doesn't exist yet, create it (empty)
                if (!grouped[taskDate]) {
                    grouped[taskDate] = { totalPoints: 0, tasks: [] };
                }

                // Add the task's name and points
                grouped[taskDate].totalPoints += task.points;
                grouped[taskDate].tasks.push({ name: task.name, points: task.points });
            });
        });

        return grouped;
    };

    const groupedData = groupByDay();
    const allDatesInRange = getAllDatesInRange(view); //all dates in range
    const data = allDatesInRange.map(date => {
        //dayData - the tasks info from groupedData if exist, or empty struct otherwise
        const dayData = groupedData[date] || { totalPoints: 0, tasks: [] };
        return {
            date,
            totalPoints: dayData.totalPoints,
            taskDetails: dayData.tasks,
        };
    });

    // Generate Y-axis ticks based on the range of totalPoints
    const maxPoints = Math.max(...data.map(d => d.totalPoints));
    const minPoints = 0; // We assume the minimum is 0
    const stepSize = 0.5; // For points in 0.5 increments
    const ticks: number[] = [];

    for (let i = minPoints; i <= maxPoints; i += stepSize) {
        ticks.push(i);
    }

    return (
        <div>
            {loading ? (
                <p>Loading tasks...</p>
            ) : (
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis ticks={ticks} />
                        <Tooltip
                            content={({ payload }) => {
                                if (payload && payload.length > 0) {
                                    const taskDetails = payload[0].payload.taskDetails.map((task: any) => (
                                        <div key={task.name}>
                                            {task.name}: {task.points} points
                                        </div>
                                    ));
                                    return (
                                        <div>
                                            <div>Total: {payload[0].payload.totalPoints}</div>
                                            <div>{taskDetails}</div>
                                        </div>);
                                }
                                return null;
                            }}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="totalPoints" stroke="#8884d8" />
                    </LineChart>
                </ResponsiveContainer>
            )}
        </div>
    );
};

export default TaskActivityGraph;

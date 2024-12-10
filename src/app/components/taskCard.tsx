"use client"
import React, { useEffect, useState } from 'react'
import ITask from '../types/tasks'
import { getUserRoleFromCookies } from '../services/frontUtils';
import { UserRole } from '../types/userRole';
import TimeRemainingCard from './TimeRemainingCard';

interface CardProps {
    taskInfo: ITask;
    taskActions: string[]; //later make a component
}

//function to determine card color based on category
const categoryColor = (category: string) => {
    switch (category) {
        case "driving":
            return { base: "bg-lime-200", tag: "bg-lime-400" };
        case "phone_calls":
            return { base: "bg-fuchsia-200", tag: "bg-fuchsia-500" };
        case "physical_work":
            return { base: "bg-orange-200", tag: "bg-orange-500" };
        case "visits":
            return { base: "bg-teal-200", tag: "bg-teal-500" };
        case "other":
            return { base: "bg-indigo-200", tag: "bg-indigo-500" };
        default:
            return { base: "bg-gray-200", tag: "bg-gray-400" };
    }
}

const TaskCard: React.FC<CardProps> = ({ taskInfo, taskActions }) => {
    const { base, tag } = categoryColor(taskInfo.category);
    const [role, setRole] = useState<string | null>(null);
    const buttonStyle = "text-white p-2 rounded mx-4";

    useEffect(() => {
        const fetchRole = async () => {
            const userRole = await getUserRoleFromCookies();
            setRole(userRole);
        };

        fetchRole();
    }, []);

    const renderActionButtons = () => {
        if (!role) {
            return <div>Loading...</div>;
        }
        if (+role === UserRole.admin) {
            return (
                <div>
                    <button className={`${buttonStyle} bg-orange-300`}>Edit</button>
                    <button className={`${buttonStyle} bg-red-400`}>Delete</button>
                </div>
            );
        }
        if (+role === UserRole.authorized) {
            const assignedToMe = true; //add a function to check
            if (assignedToMe) {
                return <button className={`${buttonStyle} bg-red-400`}>Remove me</button>
            } else {
                return <button className={`${buttonStyle} bg-sky-300`}>Add Me!</button>
            }
        }
        return <div>No actions available</div>;
    };

    return (
        <div className={`relative border-2 border-gray-500 p-4 rounded-xl ${base}`}>
            {/* Category Tag */}
            <span
                className={`absolute top-2 right-2 px-3 py-1 text-sm font-semibold border rounded-full ${tag}`}>
                {taskInfo.category.replace('_', ' ').toUpperCase()}
            </span>
            <h2 className="text-xl font-bold">{taskInfo.name}</h2>
            <p className="border border-gray-500 p-2 m-2 rounded-xl">{taskInfo.description}</p>
            <p>Points: {taskInfo.points}</p>
            <p>Assigned: {taskInfo.assigned}</p>
            <p>Start Time: {new Date(taskInfo.creation_time).toLocaleString()}</p>
            <p>End Time: {new Date(taskInfo.end_time).toLocaleString()}</p>
            <TimeRemainingCard startTime={new Date(taskInfo.creation_time)} endTime={new Date(taskInfo.end_time)}/>
            <div className="w-full border-t-2 border-gray-500 border-dashed pt-2">
                {renderActionButtons()}
            </div>
        </div>
    )
}

export default TaskCard
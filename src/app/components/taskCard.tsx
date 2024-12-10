"use client"
import React from 'react'
import ITask from '../types/tasks'

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

const renderActionButtons = () => {
    const role = getUserRoleFromCookies();
    console.log("renderActionButtons, role: ", role);
    if (!role) {
        return <div>Don't be here</div>;
    }
    if (+role == UserRole.admin) {
        return (
            <div>
                <button>Edit</button>
                <button>Delete</button>
            </div>
        );
    }
    if (+role == UserRole.authorized) {
        const assignedToMe = true; //add a function to check
        if (assignedToMe) {
            return <button>Remove me</button>
        } else {
            return <button>Add Me!</button>
        }
    }
};

const TaskCard: React.FC<CardProps> = ({ taskInfo, taskActions }) => {
    const { base, tag } = categoryColor(taskInfo.category);

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
            <p>TaskActions: {taskActions}</p>
        </div>
    )
}

export default TaskCard
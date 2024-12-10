"use client"
import React from 'react'
import ITask from '../types/tasks'

interface CardProps {
    taskInfo: ITask;
    taskActions: string[]; //later make a component
}

const TaskCard: React.FC<CardProps> = ({ taskInfo, taskActions }) => {
    return (
        <div className="border-2 border-gray-500 p-4 rounded">
            <h2 className="text-xl font-bold">{taskInfo.name}</h2>
            <p>{taskInfo.description}</p>
            <p>Category: {taskInfo.category}</p>
            <p>Points: {taskInfo.points}</p>
            <p>Assigned: {taskInfo.assigned}</p>
            <p>Start Time: {new Date(taskInfo.creation_time).toLocaleString()}</p>
            <p>End Time: {new Date(taskInfo.end_time).toLocaleString()}</p>
            <p>TaskActions: {taskActions}</p>
        </div>
    )
}

export default TaskCard
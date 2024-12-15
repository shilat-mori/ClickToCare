"use client"
import React, { useEffect, useState } from 'react'
import ITask from '@/app/types/tasks';
import { getMyTasks } from '@/app/services/getMyTasks';
import TaskCard from '@/app/components/taskCard';

const MyTasks = () => {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      const fetchedTasks = await getMyTasks();
      if (fetchedTasks) setTasks(fetchedTasks);
      setLoading(false);
    };
    fetchTasks();
  }, []);

  const setAssigned = (taskId: string, updatedAssigned: string[]) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === taskId ? { ...task, assigned: updatedAssigned } : task
      )
    );
  };

  return (
    <div>
      {loading ? (
        <p>Loading tasks...</p>
      ) : tasks.length > 0 ? (
        tasks.map((task) => (
          <div key={task._id} className="break-inside-avoid p-4 rounded">
            <TaskCard taskInfo={task} setAssigned={setAssigned} />
          </div>
        ))
      ) : (
        <p>No tasks assigned to you.</p>
      )}
    </div>
  )
}

export default MyTasks
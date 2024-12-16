"use client"
import { getMyTasks } from '@/app/services/getMyTasks';
import ITask from '@/app/types/tasks';
import React, { useEffect, useState } from 'react'

const MyActivity = () => {
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

  return (
    <div>
      {loading ? (
        <p>Loading tasks...</p>
      ) : tasks.length > 0 ? (
        tasks.map((task) => (
          <div key={task._id} className="break-inside-avoid p-4 rounded">
            {task.assigned[0].name}
          </div>
        ))
      ) : (
        <p>No tasks assigned to you.</p>
      )}
    </div>
  )
}

export default MyActivity
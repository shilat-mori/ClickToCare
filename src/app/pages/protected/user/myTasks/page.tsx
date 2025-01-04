"use client"
import React, { useEffect, useState } from 'react'
import ITask from '@/app/types/tasks/tasks';
import { getMyTasks } from '@/app/services/getMyTasks';
import TaskCard from '@/app/components/tasks/taskCard';
import { Assignee } from '@/app/types/tasks/assignee/assignee';
 
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

  const setAssigned = (taskId: string, updatedAssigned: Assignee[]) => {
    //no use to set the local assignee change
    //if we reached here is to remove self from task - 
    //therefore remove task from my tasks
    setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
  };

  return (
    <div>
      {loading ? (
        <p>Loading tasks...</p>
      ) : tasks.length > 0 ? (
        tasks.map((task) => (
          <div key={task._id} className="break-inside-avoid p-4 rounded">
            {/* on delete do nothing - you are the user, you can't delete */}
            <TaskCard taskInfo={task} setAssigned={setAssigned} onDelete={()=>{}}/>
          </div>
        ))
      ) : (
        <p>No tasks assigned to you.</p>
      )}
    </div>
  )
}

export default MyTasks
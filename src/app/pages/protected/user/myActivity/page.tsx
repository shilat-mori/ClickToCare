"use client"
import { getUsernameFromCookies, getUserRoleFromCookies } from '@/app/services/frontUtils';
import { getMyTasks } from '@/app/services/getMyTasks';
import ITask from '@/app/types/tasks';
import React, { useEffect, useState } from 'react'

const MyActivity = () => {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [loading, setLoading] = useState(true);
  const [myName, setMyName] = useState("");

  // Date Ranges for Filtering
  const today = new Date();
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(today.getDate() - 7);

  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(today.getMonth() - 1);

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

  return (
    <div>
      {loading ? (
        <p>Loading tasks...</p>
      ) : tasks.length > 0 ? (
        tasks.map((task) => {
          const found = task.assigned.find(assignee => assignee.name === myName);
          if (!found) return null;

          //task assigned date without time
          const assignedDate = new Date(found.assignedAt).setHours(0, 0, 0, 0);
          //get only the ones assigned in the last month (change to week?)
          if (assignedDate >= oneMonthAgo.setHours(0, 0, 0, 0) && assignedDate <= today.setHours(0, 0, 0, 0)) {
            return (
              <div key={task._id} className="break-inside-avoid p-4 rounded">
                Task: {task.name} <br />
                Worth {task.points} points <br />
                Assigned To: {found.name} <br />
                Assigned At: {new Date(found.assignedAt).toLocaleString()}
              </div>
            );
          }
          return null;
        })
      ) : (
        <p>No tasks assigned to you.</p>
      )}
    </div>
  )
}

export default MyActivity
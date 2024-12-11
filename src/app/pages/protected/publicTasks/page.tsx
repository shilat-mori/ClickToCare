"use client"
import TaskCard from '@/app/components/taskCard';
import ITask from '@/app/types/tasks';
import axios from 'axios';
import React, { useEffect, useState } from 'react'

const PublicTasks = () => {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('creation_time');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const filterStyle = "border p-2 rounded";

  // Fetch tasks when category, sortBy, or order changes
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get<ITask[]>('/api/tasks', {
          params: { category, sortBy, order },
        });
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, [category, sortBy, order]);

  const navigation = () => (
    <div className="fixed top-20 left-0 right-0 bg-white z-10 shadow-md p-4">
      <div className="flex justify-start space-x-4">
        {/* Category Filter */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={filterStyle}
        >
          <option value="">All Categories</option>
          <option value="driving">Driving</option>
          <option value="phone_calls">Phone Calls</option>
          <option value="physical_work">Physical Work</option>
          <option value="visits">Visits</option>
          <option value="other">Other</option>
        </select>

        {/* Sort By Options */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className={filterStyle}
        >
          <option value="creation_time">Sort by Creation Time</option>
          <option value="points">Sort by Points</option>
          <option value="end_time">Sort by End Time</option>
        </select>

        {/* Sort Order */}
        <button
          onClick={() => { setOrder((order == 'asc') ? 'desc' : 'asc') }}
          className={filterStyle}>
          {(order == 'asc') ? "↑" : "↓"}
        </button>
      </div>
    </div>
  );

  // Update the task assigned list in state when changes are made
  const setAssigned = (taskId: string, updatedAssigned: string[]) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === taskId ? { ...task, assigned: updatedAssigned } : task
      )
    );
  };

  return (
    <div>
      {navigation()}
      <div className="pt-36">
        {tasks.length === 0 ? (
          <p>No tasks available.</p>
        ) : (
          <div className="columns-3 gap-2">
            {tasks.map((task) => (
              <div key={task._id} className="break-inside-avoid p-4 rounded">
                <TaskCard taskInfo={task} setAssigned={setAssigned} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicTasks;
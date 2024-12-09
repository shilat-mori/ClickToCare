"use client"
import ITask from '@/app/types/tasks';
import axios from 'axios';
import React, { useEffect, useState } from 'react'

const PublicTasks = () => {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('creation_time');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

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

  const navigation = () => {
    return (<div className="fixed top-0 left-0 right-0 bg-white z-10 shadow-md p-4">
      <div className="flex justify-between space-x-4">
        {/* Category Filter */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded"
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
          className="border p-2 rounded"
        >
          <option value="creation_time">Sort by Creation Time</option>
          <option value="points">Sort by Points</option>
          <option value="end_time">Sort by End Time</option>
        </select>

        {/* Sort Order */}
        <button
          onClick={() => { setOrder((order == 'asc') ? 'desc' : 'asc') }}>
          {(order == 'asc') ? "↑" : "↓"}
        </button>
      </div>
    </div>);
  };

  console.log("tasks: ", tasks);
  return (
    <div>
      {navigation()}
      <div className="pt-20">
        {tasks.length === 0 ? (
          <p>No tasks available.</p>
        ) : (
          <ul>
            {tasks.map((task) => (
              <li key={task._id} className="border p-4 mb-4 rounded">
                <h2 className="text-xl font-bold">{task.name}</h2>
                <p>{task.description}</p>
                <p>Category: {task.category}</p>
                <p>Points: {task.points}</p>
                <p>End Time: {new Date(task.end_time).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PublicTasks;
"use client"
import React, { useEffect, useState } from 'react'
import { useHeaderHeight } from '@/app/context/HeaderHeightContext';
import TaskCard from '@/app/components/taskCard';
import ITask from '@/app/types/tasks';
import axios from 'axios';
import { Assignee } from '@/app/types/assignee';
import Masonry from 'react-masonry-css';

const PublicTasks = () => {
  const { headerHeight } = useHeaderHeight();
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('creation_time');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [startHeight, setStartHeight] = useState<number>(80);

  const filterStyle = "border p-2 rounded";

  // Fetch tasks when category, sortBy, or order changes
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get<ITask[]>('/api/tasks', {
          params: { category, sortBy, order, status: "running" },
        });
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();

    // // Set up periodic polling
    // const interval = setInterval(() => {
    //   fetchTasks();

    // }, 5000); // Re-fetch every 5 seconds

    // return () => clearInterval(interval); // Clean up on unmount
  }, [category, sortBy, order]);

  useEffect(() => {
    setStartHeight(headerHeight === 80 ? 80 : 150);
  }, [headerHeight]);

  const navigation = () => (
    <div className="fixed left-0 right-0 bg-white z-10 shadow-md p-4"
      style={{ top: `${startHeight}px` }}>
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

  const getMaxAssignee = (taskId: string): number | undefined => {
    const task = tasks.find(task => task._id === taskId);
    return task?.assigned_max; // Return the max assignee or undefined if not found
  };

  // Update the task assigned list in state when changes are made
  const setAssigned = (taskId: string, updatedAssigned: Assignee[]) => {
    //first check if we got to the max assignees
    const maxAssignee = getMaxAssignee(taskId);
    //if so, don't show this task
    if (maxAssignee !== undefined && updatedAssigned.length >= maxAssignee) {
      removeTask(taskId);
    } else {
      //otherwise, upadte the assignee list in the card component
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, assigned: updatedAssigned } : task
        )
      );
    }
  };

  const removeTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task._id !== taskId));
  };

  const breakpointColumnsObj = {
    default: 3, // 3 columns for large screens
    1100: 2,    // 2 columns for medium screens
    700: 1,     // 1 column for small screens
  };

  return (
    <div>
      {navigation()}
      <div className="pt-24">
        {tasks.length === 0 ? (
          <p>No tasks available.</p>
        ) : (
          // <div className="grid grid-cols-3 auto-rows-auto gap-4">
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="flex gap-4"
            columnClassName="masonry-column"
          >
            {tasks.map((task: ITask) => (
              <div key={task._id} className="p-4 rounded">
                <TaskCard taskInfo={task} setAssigned={setAssigned} onDelete={removeTask} />
              </div>
            ))}
            {/* </div> */}
          </Masonry>
        )}
      </div>
    </div>
  );
};

export default PublicTasks;
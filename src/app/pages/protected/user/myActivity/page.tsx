"use client"
import TaskActivityGraph from '@/app/components/TaskActivityGraph';
import TasksByDay from '@/app/components/taskByDay';
import React from 'react'

const MyActivity = () => {
  return (
    <div>
      <TasksByDay range="week" />
      {/* <TasksByDay range="month" /> */}
      <TaskActivityGraph view="week" />
    </div>
  )
}

export default MyActivity
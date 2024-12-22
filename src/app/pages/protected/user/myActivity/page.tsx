"use client"
import TaskActivityGraph from '@/app/components/userActivityComponents/TaskActivityGraph';
import TasksByDay from '@/app/components/userActivityComponents/taskByDay';
import React, { useState } from 'react'

const MyActivity = () => {
  const [type, setType] = useState<"list" | "graph">("list");
  const [time, setTime] = useState<"week" | "month">("week");

  return (
    <div>
      <div className="flex flex-row">
        <button className="buttonStyle" onClick={() => setType(type === "list" ? "graph" : "list")}>{type}</button>
        <button className="buttonStyle" onClick={() => setTime(time === "week" ? "month" : "week")}>{time}</button>
      </div>
      {(type === "list") && <TasksByDay range={time} />}
      {(type === "graph") && <TaskActivityGraph view={time} />}
    </div>
  )
}

export default MyActivity
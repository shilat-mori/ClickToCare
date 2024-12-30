"use client";
import React from "react";
import TimeTracker from "./TimeRemainingGraph";
import TimeCardProps from "../../types/tasks/timeRemaining/timeCardProps";

const TimeRemainingCard: React.FC<TimeCardProps> = ({ startTime, endTime }) => {
  // Calculate the total time in milliseconds
  const totalTime = endTime.getTime() - startTime.getTime();
  if (new Date().getTime() > endTime.getTime()) {
    return (
      <div className="border border-gray-500 p-2 m-2 rounded-xl">Done</div>
    ); //for now, later will be erased
  }

  return (
    <div className="p-2 m-2 text-center">
      <div className="w-fit m-auto">
        <TimeTracker totalTime={totalTime} endTime={endTime.getTime()} />
      </div>
    </div>
  );
};

export default TimeRemainingCard;

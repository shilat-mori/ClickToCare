import React, { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import TimeTrackerProps from "../types/timeTrackerProps";

const formatTime = (seconds: number) => {
  const days = Math.floor(seconds / (60 * 60 * 24));
  const hours = Math.floor((seconds % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((seconds % (60 * 60)) / 60);
  const secs = Math.floor(seconds % 60);

  if (days > 0) return `${days}d${hours}h`;
  if (hours > 0) return `${hours}h${minutes}m`;
  if (minutes > 0) return `${minutes}m${secs}s`;
  return `${secs}s`;
};

const TimeTracker: React.FC<TimeTrackerProps> = ({ totalTime, endTime }) => {
  const [timeRemaining, setTimeRemaining] = useState<number>(totalTime);
  //const percentage = Math.max((timeRemaining / totalTime) * 100, 0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const remaining = Math.max((endTime - now) / 1000, 0); // Time in seconds
      setTimeRemaining(() => remaining);
      // console.log(`totalTime: ${totalTime}, timeRemaining: ${timeRemaining}`);

      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  const percentage = Math.max((timeRemaining / totalTime) * 100, 0);

  const getColor = () => {
    // if (timeRemaining <= 3 * 60 * 60) return "red";
    // if (timeRemaining <= 24 * 60 * 60) return "orange";
    if (timeRemaining <= 60) return "red";
    if (timeRemaining <= 2 * 60) return "orange";
    return "green";
  };

  return (
    <div style={{ width: 100, height: 200 }}>
      <CircularProgressbar
        value={percentage*100}
        text={formatTime(timeRemaining)}
        styles={buildStyles({
          pathColor: getColor(),
          textColor: getColor(),
          trailColor: "#d6d6d6",
          textSize: "16px",
        })}
      />
      <p>totalTime: {formatTime(totalTime/1000)}s</p>
      <p>precentage: {(percentage*100).toFixed(2)}%</p>
    </div>
  );
};

export default TimeTracker;

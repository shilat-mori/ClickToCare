import React, { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import TimeTrackerProps from "../types/timeTrackerProps";

const TimeTracker: React.FC<TimeTrackerProps> = ({ totalTime, endTime }) => {
  const [timeRemaining, setTimeRemaining] = useState<number>(totalTime);
  const percentage = Math.max((timeRemaining / totalTime) * 100, 0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const remaining = Math.max((endTime - now) / 1000, 0); // Time in seconds
      setTimeRemaining(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  const getColor = () => {
    // if (timeRemaining <= 3 * 60 * 60) return "red";
    // if (timeRemaining <= 24 * 60 * 60) return "orange";
    if (timeRemaining <= 60) return "red";
    if (timeRemaining <= 2 * 60) return "orange";
    return "green";
  };

  return (
    <div style={{ width: 100, height: 100 }}>
      <CircularProgressbar
        value={percentage}
        text={`${Math.ceil(timeRemaining)}s`}
        styles={buildStyles({
          pathColor: getColor(),
          textColor: getColor(),
          trailColor: "#d6d6d6",
          textSize: "16px",
        })}
      />
    </div>
  );
};

export default TimeTracker;

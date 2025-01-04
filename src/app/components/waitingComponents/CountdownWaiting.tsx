import React from "react";
import Countdown, { CountdownRenderProps } from "react-countdown";
import CountdownBlock from "@/app/components/waitingComponents/countdownBlock";
import countdownWaitingProps from "@/app/types/waiting/countdownWaitingProps";


const CountdownWaiting: React.FC<countdownWaitingProps> = ({ endDate, rejected, onComplete }) => {
  const renderer = ({
    days,
    hours,
    minutes,
    seconds,
    completed,
  }: CountdownRenderProps) => {
    if (completed) {
      return (
        <span className="text-2xl font-bold text-red-500">Time&#39;s up!</span>
      );
    } else {
      return (
        <div className={`flex gap-4 w-fit text-center m-auto ${rejected?``:`animate-beat`}`}>
          <CountdownBlock name="Days" num={days} lighting={!rejected} />
          <CountdownBlock name="Hours" num={hours} lighting={!rejected} />
          <CountdownBlock name="Minutes" num={minutes} lighting={!rejected} />
          <CountdownBlock name="Seconds" num={seconds} lighting={!rejected} />
        </div>
      );
    }
  };
  return endDate ? (
    <Countdown
      date={endDate}
      renderer={renderer}
      onComplete={onComplete} // Pass the custom function here
    />
  ) : (
    <div />
  );
};

export default CountdownWaiting;

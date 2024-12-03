"use client"
import React from 'react';
import Countdown from 'react-countdown';
import TimeTracker from './components/TimeRemainingGraph';

export default function Home() {
  const totalTime = 2.5 * 60; // Total time in seconds
  const endTime = new Date().getTime() + totalTime * 1000; // Current time + totalTime, in milliseconds
  return (
   <div>
    <h1>Count Down Timer:</h1>
    <TimeTracker totalTime={totalTime} endTime={endTime} />
    <Countdown date={Date.now() + totalTime * 1000} />
   </div>
  )
}

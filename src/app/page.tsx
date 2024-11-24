"use client"
import React, { useState } from 'react';
import Countdown from 'react-countdown';
import TimeTracker from './components/TimeRemainingGraph';
// import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';

// type ValuePiece = Date | null;
// type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function Home() {
  // const [value, setValue] = useState<Value>(new Date());
  const totalTime = 2.5 * 60; // Total time in seconds (4 days)
  const endTime = new Date().getTime() + totalTime * 1000; // Current time + totalTime
  return (
   <div>
    <h1>Count Down Timer:</h1>
    <TimeTracker totalTime={totalTime} endTime={endTime} />
    <Countdown date={Date.now() + totalTime * 1000} />
    {/* <Calendar onChange={setValue} value={value} /> */}
   </div>
  )
}

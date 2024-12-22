"use client"
import React, { useEffect, useState } from 'react';
import { getUserSignUp } from '@/app/services/getUserSignUp';
import INewUser from '@/app/types/newUser';
import Countdown, { CountdownRenderProps } from 'react-countdown';
import CountdownBlock from '@/app/components/waitingComponents/countdownBlock';

const Waiting = () => {
  const [signUpUser, setSignUpUser] = useState<INewUser | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const user = await getUserSignUp();
      if (!user.error)
        setSignUpUser(user); // Save user data in state
      console.log("username: ", user?.username); // Log username if available
      console.log("time: ", user?.signTime, " of type: ", typeof (user?.signTime));
    };

    fetchData();
  }, []);

  const renderer = ({ days, hours, minutes, seconds, completed }: CountdownRenderProps) => {
    if (completed) {
      return <span className="text-2xl font-bold text-red-500">Time&#39;s up!</span>;
    } else {
      return (
        <div className="flex gap-4 text-center">
          <CountdownBlock name="Days" num={days} />
          <CountdownBlock name="Hours" num={hours} />
          <CountdownBlock name="Minutes" num={minutes} />
          <CountdownBlock name="Seconds" num={seconds} />
        </div>
      );
    }
  };

  const signUpDate = signUpUser?.signTime ? new Date(signUpUser.signTime) : null;
  const endDate = signUpDate
    ? new Date(signUpDate.getTime() + 7 * 24 * 60 * 60 * 1000) // Add 1 week (in milliseconds)
    : null;


  return (
    <div>
      {signUpUser ? (
        <div>
          <p>Welcome, {signUpUser.username}!</p>
          <p>Answer in:</p>
          {endDate && <Countdown date={endDate} renderer={renderer} />}
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default Waiting;
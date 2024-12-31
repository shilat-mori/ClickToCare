"use client"
import React, { useEffect, useState } from 'react';
import { getUserSignUp } from '@/app/services/getUserSignUp';
import INewUser from '@/app/types/users/newUsers/newUser';
import { useRouter } from 'next/navigation';
import CountdownWaiting from '@/app/components/waitingComponents/CountdownWaiting';
import { rejectUser } from '@/app/services/verifyUser';

const Waiting = () => {
  const [signUpUser, setSignUpUser] = useState<INewUser | null>(null);
  const router = useRouter()
  useEffect(() => {
    const fetchData = async () => {
      const user = await getUserSignUp();
      if (!user || user.error)
        router.push('/')
      else setSignUpUser(user); // Save user data in state 
    };

    fetchData();
  }, []);

  const handleCountdownComplete = async () => {
    //if user exists, but wasn't rejected yet
    if (signUpUser && !signUpUser.reject_time) {
      //user waiting period has ended, we want to automatically reject him (and start reject countdown)
      rejectUser(signUpUser._id);
      // refresh data and page
      const user = await getUserSignUp();
      setSignUpUser(user);
    }
    //if we completed the rejected countdown, there's nothing to do
    //it will be erased automatically around midnight UTC
  };

  const signUpDate = signUpUser?.signTime ? new Date(signUpUser.signTime) : null;
  const rejectDate = signUpUser?.reject_time ? new Date(signUpUser.reject_time) : null;

  // For rejectDate, set the end date to 7 days later at midnight UTC. (when vercel erases it)
  const rejectEndDate = rejectDate
    ? (() => {
      const end = new Date(rejectDate);
      end.setUTCDate(end.getUTCDate() + 7); // Add 7 days
      end.setUTCHours(0, 0, 0, 0); // Set to midnight UTC
      return end;
    })()
    : null;

  // For signUpDate, set the end date to exactly 7 days later.
  const signUpEndDate = signUpDate
    ? new Date(signUpDate.getTime() + 7 * 24 * 60 * 60 * 1000) // Add 7 days in milliseconds
    : null;

  const endDate = rejectEndDate || signUpEndDate; //prefer the reject date if exists.

  return (
    <div>
      {signUpUser ? (
        <div>
          <p>Welcome, {signUpUser.username}!</p>
          <p>
            {signUpUser.reject_time
              ? "You were rejected, and will be deleted in:"
              : "Answer in:"}
          </p>
          <CountdownWaiting endDate={endDate} onComplete={handleCountdownComplete} />
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default Waiting;
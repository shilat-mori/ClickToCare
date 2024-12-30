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


  const signUpDate = signUpUser?.signTime ? new Date(signUpUser.signTime) : null;
  const rejectDate = signUpUser?.reject_time ? new Date(signUpUser.reject_time) : null;

  const baseDate = rejectDate || signUpDate; //prefer the reject date if exists.
  const endDate = baseDate ? new Date(baseDate.getTime() + 7 * 24 * 60 * 60 * 1000) : null;

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
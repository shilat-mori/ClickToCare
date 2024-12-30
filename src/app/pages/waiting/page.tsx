"use client"
import React, { useEffect, useState } from 'react';
import { getUserSignUp } from '@/app/services/getUserSignUp';
import INewUser from '@/app/types/users/newUsers/newUser';
import { useRouter } from 'next/navigation';
import CountdownWaiting from '@/app/components/waitingComponents/CountdownWaiting';

const Waiting = () => {
  const [signUpUser, setSignUpUser] = useState<INewUser | null>(null);
  const router = useRouter()
  useEffect(() => {
    const fetchData = async () => {
      const user = await getUserSignUp();
      if (!user || user.error)
       router.push('/')
      else setSignUpUser(user); // Save user data in state 
      console.log("username: ", user?.username); // Log username if available
      console.log("time: ", user?.signTime, " of type: ", typeof (user?.signTime));
    };

    fetchData();
  }, []);


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
         <CountdownWaiting endDate={endDate}/>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default Waiting;
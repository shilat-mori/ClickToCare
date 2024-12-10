"use client"
import React from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  //for the routing here there is no need for checking, since everyone can acceess those pages
  const router = useRouter();
  const buttonStyle = "bg-sky-500 text-white p-2 rounded m-4";
  return (
    <div>
      <h1>אמץ משימה</h1>
      <button onClick={() => router.push('/pages/login')} className={buttonStyle}>Log In</button>
      <button onClick={() => router.push('/pages/signup')} className={buttonStyle}>Sign Up</button>
    </div>
  )
}

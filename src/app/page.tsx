"use client"
import React from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const buttonStyle = "bg-sky-500 text-white p-2 rounded m-2";
  
  return (
    <div className="relative h-screen bg-cover bg-no-repeat bg-center" style={{ backgroundImage: 'url(/images/main_hands.jpg)' }}>
      {/* Stylized Heading */}
      <h1 className="absolute top-10 left-3/4 transform -translate-x-1/2 text-4xl sm:text-6xl lg:text-7xl font-bold text-sky-700">
        אמץ משימה
      </h1>

      {/* Buttons */}
      <div className="absolute bottom-0 left-0 p-8 flex flex-col space-y-4">
        <button onClick={() => router.push('/pages/login')} className={buttonStyle}>Log In</button>
        <button onClick={() => router.push('/pages/signup')} className={buttonStyle}>Sign Up</button>
      </div>
    </div>
  )
}

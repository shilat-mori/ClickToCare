"use client";
import React, { useEffect, useState } from "react";
import Logo from "./components/Logo";
import { useRouter } from "next/navigation";

export default function Home() {
  const [buttonAnimate, setAnimate] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setAnimate(false), 1000); // סיום האנימציה לאחר 1 שנייה
        return () => clearTimeout(timer);
    }, []);

  const router = useRouter();

  return (
    <div
      className="bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200 min-h-screen flex flex-col items-center justify-center text-gray-800"
      style={{}}
    >
      <Logo />
      {/* Buttons */}
      <div className={`${buttonAnimate ? "button-bounce" :""}
       "p-10 w-80 flex flex-row justify-between items-stretch"`}>
        <button 
          onClick={() => router.push("/pages/login")}
          className="buttonStyle"
        >
          Log In
        </button>
        <button
          onClick={() => router.push("/pages/signup")}
          className="buttonStyle"        >
          Sign Up
        </button>
      </div>
    </div>
  );
}

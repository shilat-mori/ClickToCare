"use client";
import React from "react";
import { removeToken } from './services/frontUtils';
import { useRouter } from 'next/navigation';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  return (
    <html lang="en">
      <body>
        <header>
          <button onClick={() => router.push('/')}>Home</button>
          <h1>Welcome to the App</h1>
          <button onClick={() => removeToken()} className="bg-red-500 text-white p-2 rounded">
            Sign Out
          </button>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}

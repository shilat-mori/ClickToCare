"use client";
import React from "react";
import { removeToken } from "../services/frontUtils";
import { useRouter } from 'next/navigation';

export default function Layout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const handleSignOut = () => {
        removeToken();
        //router.push('/');
    };
    return (
        <div>
            <header className="fixed top-0 left-0 right-0 bg-sky-400 text-white p-4 z-20">
                <div className="flex justify-between items-center">
                    <button onClick={() => router.push('/')}>Home</button>
                    <div className="text-2xl font-bold">אמץ משימה</div>
                    <button onClick={handleSignOut} className="bg-red-400 text-white p-2 rounded">
                        Sign Out
                    </button>
                </div>
            </header>
            <main className="flex-1 pt-20 overflow-auto bg-gray-100">
                {children}
            </main>
        </div>
    );
}
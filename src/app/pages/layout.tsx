"use client";
import React, { useEffect, useState } from "react";
import { removeToken } from "../services/frontUtils";
import { useRouter } from 'next/navigation';
import NavBar from "../components/navBar/navBar";
import { useHeaderHeight } from "../context/HeaderHeightContext";
import { LogoMode } from "../types/ILogo";
import Logo from "../components/Logo";

export default function Layout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [openMenu, setOpenMenu] = useState(false);
    const { headerHeight, setHeaderHeight } = useHeaderHeight();

    useEffect(() => {
        const header = document.getElementById("header");
        if (header) {
            setHeaderHeight(header.offsetHeight);
        }
    }, [openMenu, setHeaderHeight]); 

    const handleSignOut = () => {
        removeToken();
        router.push('/');
    };

    const handleNavigator = (nav:string)=>{
        setOpenMenu(false)
        router.push(nav)
    }

    return (
        <div>
            <header id="header" className="fixed top-0 left-0 right-0 bg-sky-400 text-white p-4 z-20">
                <div className="flex justify-between items-center">
                    <div>
                        <button onClick={() => router.push('/')}>Home</button>
                        <button onClick={() => setOpenMenu(!openMenu)} className="m-3">≡</button>
                    </div>
                    <Logo mode={LogoMode.Avatar}/>
                    <button onClick={handleSignOut} className="bg-red-400 text-white p-2 rounded">
                        Sign Out
                    </button>
                </div>
                {openMenu && (
                    <div className="mt-4">
                        <NavBar handleNavigator={handleNavigator}/>
                    </div>
                )}
            </header>
            <main className="h-screen overflow-auto bg-gray-100 " style={{ paddingTop: `${headerHeight}px` }}>
                {children}
            </main>
        </div>
    );
}
"use client"
import React, { useState, useEffect } from 'react'
import { UserRole } from '../types/userRole'
import { getUserRoleFromCookies } from '../services/frontUtils';
import { useRouter } from 'next/navigation';
import Trophy from './trophy';

const NavBar = () => {
    const router = useRouter();
    const [role, setRole] = useState<UserRole | null>(null);
    const divStyle = "flex justify-between items-center";
    const buttonStyle = "bg-sky-500 text-white p-2 rounded m-2";

    useEffect(() => {
        const fetchRole = async () => {
            const userRole = await getUserRoleFromCookies();
            setRole(userRole);
        };

        fetchRole();
    }, []);

    const renderButtons = () => {
        if (!role)
            return <div className={divStyle}>Loading...</div>;
        if (role === UserRole.admin) {
            return (
                <div className={divStyle}>
                    <button className={buttonStyle} onClick={() => { router.push('/pages/protected/publicTasks'); }}>All Tasks</button>
                    <button className={buttonStyle} onClick={() => { router.push('/pages/protected/admin/reviewNewUsers'); }}>Verify Users</button>
                    <button className={buttonStyle} onClick={() => { router.push('/pages/protected/admin/newTask'); }}>Add a Task</button>
                    <button className={`${buttonStyle} flex items-center space-x-2`}
                        onClick={() => { router.push('/pages/scores'); }}>
                        <span>Score Board</span>
                        <Trophy />
                    </button>
                </div>
            );
        }
        if (role === UserRole.authorized) {
            return (
                <div className={divStyle}>
                    <button className={buttonStyle} onClick={() => { router.push('/pages/protected/publicTasks'); }}>All Tasks</button>
                    <button className={buttonStyle} onClick={() => { router.push('/pages/protected/user/myTasks'); }}>My Tasks</button>
                    <button className={buttonStyle} onClick={() => { router.push('/pages/protected/user/myActivity'); }}>My Activity</button>
                    <button className={`${buttonStyle} flex items-center space-x-2`}
                        onClick={() => { router.push('/pages/scores'); }}>
                        <span>Score Board</span>
                        <Trophy />
                    </button>
                </div>
            );
        }
        if (role === UserRole.unauthorized) {
            return (
                <div className={divStyle}>
                    <button className={buttonStyle} onClick={() => { router.push('/pages/waiting'); }}>watch icon</button>
                    <button className={`${buttonStyle} flex items-center space-x-2`}
                        onClick={() => { router.push('/pages/scores'); }}>
                        <span>Score Board</span>
                        <Trophy />
                    </button>
                </div>
            );
        }
    };
    return (
        <div>{renderButtons()}</div>
    )
}

export default NavBar
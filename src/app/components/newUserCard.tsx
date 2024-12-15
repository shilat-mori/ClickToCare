"use client"
import React from "react"
import NewUserCardProps from "../types/newUserCardProps"
import axios from "axios"
import { UserRole } from "../types/userRole"

const NewUserCard: React.FC<NewUserCardProps> = ({userInfo, aboutMe}) => {
    const verifyUser = async () => {
        const userResponse = await axios.put('/api/users', {
            username: userInfo.username as string,
            role: userInfo.role as UserRole,
        });
        console.log(userResponse.data);
    };
    return (
        <div className="w-full flex items-center justify-between p-4 mb-4 rounded-lg border-2 border-sky-500">
            <div className="font-bold text-lg">{userInfo.username}</div>
            <div>{userInfo.email}</div>
            <div>about me: {aboutMe}</div>
            <button onClick={verifyUser} className="bg-sky-500 text-white p-2 rounded m-2">Verify User</button>
        </div>
    )
}

export default NewUserCard
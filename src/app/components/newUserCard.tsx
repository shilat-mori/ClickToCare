"use client"
import React from "react"
import INewUser from "../types/newUser"
import { verifyUser } from "../services/verifyUser"

const NewUserCard: React.FC<INewUser> = ({ _id, userInfo, aboutMe, signTime }) => {
    return (
        <div className="w-full p-4 mb-4 rounded-lg border-2 border-sky-500 flex flex-col gap-4">
            <div className="font-bold text-lg">{userInfo.username}</div>
            <div className="text-lg">email: {userInfo.email}</div>
            <div>About me: </div>
            <div className="border-2 border-gray-200 w-1/2">{aboutMe}</div>
            <div>Added on: {new Date(signTime).toLocaleString()}</div>
            <div className="flex justify-end w-full">
                <button
                    onClick={() => verifyUser(_id)}
                    className="bg-sky-500 text-white px-4 py-2 rounded">
                    Verify User
                </button>
            </div>
        </div>
    )
}

export default NewUserCard
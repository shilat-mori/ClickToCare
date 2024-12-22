"use client"
import React from "react"
import { verifyUser, rejectUser } from "../services/verifyUser"
import NewUserCardProps from "../types/newUserCardProps"

const NewUserCard: React.FC<NewUserCardProps> = ({ userInfo, setVerified }) => {
    return (
        <div className="w-full p-4 mb-4 rounded-lg border-2 border-sky-500 flex flex-col gap-4">
            <div className="font-bold text-lg">{userInfo.username}</div>
            <div className="text-lg">email: {userInfo.email}</div>
            <div>About me: </div>
            <div className="border-2 border-gray-200 w-1/2">{userInfo.freeText}</div>
            <div>{userInfo.faceImage ? "has image" : "no image"}</div>
            <div>Added on: {new Date(userInfo.signTime).toLocaleString()}</div>
            <div className="flex justify-end w-full">
            <button
                    onClick={async () => {
                        await verifyUser(userInfo._id);
                        setVerified(userInfo._id);
                    }}
                    className="bg-sky-500 text-white px-4 py-2 rounded">
                    Verify User
                </button>
                <button
                    onClick={async () => {
                        await rejectUser(userInfo._id);
                        setVerified(userInfo._id);
                    }}
                    className="bg-red-400 text-white px-4 py-2 rounded">
                    Reject User
                </button>
            </div>
        </div>
    )
}

export default NewUserCard
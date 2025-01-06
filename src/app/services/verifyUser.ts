"use client";
import axios from "axios";

export const verifyUser = async (userId: string) => {
  try {
    //add newUser to all users
    //get user from newUser cluster
    const { data: newUser } = await axios.get(`/api/newUsers/${userId}`);
    if (!newUser) {
      console.error("User info not found in newUsers collection.");
      return;
    }
    const user = {
      username: newUser.username,
      email: newUser.email,
      password: newUser.password,
    };
    //add the user info to the users cluster
    const responseAdd = await axios.post("/api/users", user);
    //if we reached here, no error were caught. we can safely delete
    //remove user from newUser cluster
    const responseRemove = await axios.delete(`/api/newUsers/${userId}`);
    console.log("User Added:", responseAdd.data);
    console.log("NewUser Removed:", responseRemove.data);
  } catch (error) {
    console.error("Error verifying a user: ", error);
  }
};

export const rejectUser = async (userId: string) => {
  try {
    // edit the reject time so the user will be automatically deleted in one week
    const resRejectNewUser = await axios.put(`/api/newUsers/${userId}`);
    console.log("NewUser Rejected:", resRejectNewUser.data);
  } catch (error) {
    console.error("Error rejecting a user: ", error);
  }
};

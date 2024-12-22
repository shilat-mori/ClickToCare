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
    //add newUser to all users
    //get user from newUser cluster
    const { data: newUser } = await axios.get(`/api/newUsers/${userId}`);
    if (!newUser) {
      console.error("User info not found in newUsers collection.");
      return;
    }
    //remove user from newUser cluster
    const resRemoveNewUser = await axios.delete(`/api/newUsers/${userId}`);
    //remove user from newUser cluster
    console.log("NewUser Removed:", resRemoveNewUser.data);
  } catch (error) {
    console.error("Error verifying a user: ", error);
  }
};

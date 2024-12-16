"use client"
import NewUserCard from '@/app/components/newUserCard';
import { UserRole } from '@/app/types/userRole';
import IUser from '@/app/types/users';
import INewUserReq from '@/app/types/newUser';
import axios from 'axios';
import React, { useState, useEffect } from 'react'
import INewUser from '@/app/types/newUser';

const ReviewNewUsers = () => {
  const [users, setUsers] = useState<INewUser[]>([]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get<INewUser[]>('/api/newUsers');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  console.log(users);
  return (
    <div>
      <h1>ReviewNewUsers</h1>
      <ul>
        {users.length > 0 ? (
          users.map((user) => (
            <li key={user._id}>
              <NewUserCard {...user} />
            </li>
          ))
        ) : (
          <p>No users found</p>
        )}
      </ul>
    </div>
  )
}

export default ReviewNewUsers
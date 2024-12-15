"use client"
import UserScoreCard from '@/app/components/userScoreCard';
import { UserRole } from '@/app/types/userRole';
import IUser from '@/app/types/users';
import axios from 'axios';
import React, { useState, useEffect } from 'react'

const Scores = () => {
  const [users, setUsers] = useState<IUser[]>([]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get<IUser[]>('/api/users', {
        params: { role: UserRole.authorized },
      });
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
      <h1>Score Board:</h1>
      <ul>
        {users.length > 0 ? (
          users.map((user) => (
            <li key={user._id}>
               <UserScoreCard {...user}/>
            </li>
          ))
        ) : (
          <p>No users found</p>
        )}
      </ul>
    </div>
  )
}

export default Scores
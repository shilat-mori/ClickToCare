"use client"
import UserScoreCard from '@/app/components/scoreBoard/userScoreCard';
import { UserRole } from '@/app/types/users/userRole';
import IUser from '@/app/types/users/users';
import axios from 'axios';
import React, { useState, useEffect } from 'react'
 
const ScoreBoard = () => {
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

  //map all users to their score or zero. on the scores array, find max.
  const maxScore = Math.max(...users.map((user) => user.score || 0));
  return (
    <div>
      <ul>
        {users.length > 0 ? (
          users.map((user) => (
            <li key={user._id}>
               <UserScoreCard {...user} isMax={user.score === maxScore}/>
            </li>
          ))
        ) : (
          <p>No users found</p>
        )}
      </ul>
    </div>
  )
}

export default ScoreBoard
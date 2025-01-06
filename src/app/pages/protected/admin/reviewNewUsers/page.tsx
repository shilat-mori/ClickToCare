"use client"
import NewUserCard from '@/app/components/newUser/newUserCard';
import axios from 'axios';
import React, { useState, useEffect } from 'react'
import INewUser from '@/app/types/users/newUsers/newUser';

const ReviewNewUsers = () => {
  const [users, setUsers] = useState<INewUser[]>([]);

  const fetchUsers = async () => {
    try {
      // only the new users that are not rejected
      const response = await axios.get<INewUser[]>('/api/newUsers');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  //local filtering. used for user verify and for user reject
  const userVerified = (userId: string) => {
    setUsers(prev => prev.filter(user => user._id !== userId));
  };

  return (
    <div>
      <ul>
        {users.length > 0 ? (
          users.map((user) => (
            <li key={user._id}>
              <NewUserCard userInfo={user} setVerified={userVerified} />
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
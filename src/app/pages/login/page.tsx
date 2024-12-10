"use client"
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { getUserRoleFromCookies } from '@/app/services/frontUtils';
import { UserRole } from '@/app/types/userRole';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/login', { username, password });
      console.log(response.data);
      if (response.data.error) {
        console.log(response.data.error);
      }
      else {
        //check user role and route accordingly
        const role = await getUserRoleFromCookies();
        console.log("login, handle submit - role: ", role);
        if (!role) {
          //if role == null, user not logged in. should be caught in the if.
          console.error("role is null, but login post retured success");
        } else if (+role < UserRole.authorized) {
          //otherwise, if new user (unauthorized)
          router.push('/pages/waiting');
        } else {
          //else - authorized user and admin
          router.push('/pages/protected/publicTasks');
        }
      }
    } catch (error) {
      console.error('Error logging in', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="p-2 border border-gray-300 rounded"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="p-2 border border-gray-300 rounded"
        required
      />
      <button
        type="submit"
        className="bg-blue-500 text-white p-2 rounded">
        Log In
      </button>
    </form>
  );
};

export default Login;

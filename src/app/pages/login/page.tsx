"use client"
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { getUserRoleFromCookies } from '@/app/services/frontUtils';

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
        //check user role
        const role = getUserRoleFromCookies();
        router.push('/pages/publicTasks');
        setTimeout(() => {
          router.refresh(); // Ensure fresh data on layout
        }, 500); // Slight delay for cookie propagation
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

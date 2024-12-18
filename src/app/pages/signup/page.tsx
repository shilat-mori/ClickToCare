"use client"
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import SignUpForm from '../../components/SignUpForm'
const Signup = () => {

  // const [username, setUsername] = useState('');
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  // const [message, setMessage] = useState("");

  // const router = useRouter();

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   try {
  //     const response = await axios.post('/api/users', { username, email, password });
  //     if (response.data.error) {
  //       setMessage(response.data.error);
  //     }
  //     else {
  //       //no need to check role here, we just created a new user, unauthorized
  //       router.push('/pages/waiting/');
  //     }

  //   } catch (error) {
  //     console.error('Error signing up', error);
  //   }
  // };

  return (
    // <div>
    //   <form onSubmit={handleSubmit}>
    //     <input
    //       type="text"
    //       placeholder="Username"
    //       value={username}
    //       onChange={(e) => setUsername(e.target.value)}
    //       className="p-2 border border-gray-300 rounded"
    //       required
    //     />
    //     <input
    //       type="email"
    //       placeholder="Email"
    //       value={email}
    //       onChange={(e) => setEmail(e.target.value)}
    //       className="p-2 border border-gray-300 rounded"
    //       required
    //     />
    //     <input
    //       type="password"
    //       placeholder="Password"
    //       value={password}
    //       onChange={(e) => setPassword(e.target.value)}
    //       className="p-2 border border-gray-300 rounded"
    //       required
    //     />
    //     <button
    //       type="submit"
    //       className="bg-blue-500 text-white p-2 rounded">
    //       Sign Up
    //     </button>
    //   </form>
    //   {message && <p className="mt-4 text-red-500">{message}</p>}

      <SignUpForm/>
    // </div>
  );
};

export default Signup;

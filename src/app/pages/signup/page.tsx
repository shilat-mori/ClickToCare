"use client"
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [message, setMessage] = useState("");

  const router = useRouter();

  const inpStyle = "p-2 border border-gray-300 rounded m-2";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/newUsers', { username, email, password, aboutMe });
      if (response.data.error) {
        setMessage(response.data.error);
      }
      else {
        //no need to check role here, we just created a new user, unauthorized
        router.push('/pages/waiting/');
      }

    } catch (error) {
      console.error('Error signing up', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={inpStyle}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inpStyle}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inpStyle}
          required
        />
        <textarea
          placeholder="Tell us about yourself!"
          rows={5}
          value={aboutMe}
          onChange={(e) => setAboutMe(e.target.value)}
          className={inpStyle}
          required
        />
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded justify-end w-1/4 m-2">
            Sign Up
          </button>
        </div>
      </form >
      {message && <p className="mt-4 text-red-500">{message}</p>}
    </div >
  );
};

export default Signup;

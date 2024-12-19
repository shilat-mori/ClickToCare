"use client"
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import SignUpForm from '../../components/SignUpForm'
const Signup = () => {
  return (
      <SignUpForm/>
  );
};

export default Signup;

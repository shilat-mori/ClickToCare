"use client"
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const page = () => {
  const router = useRouter();

  useEffect(() => {
    console.log("waiting - use effect cookies: " + document.cookie);
    // Force re-render to update layout's role
    router.refresh();
  }, [router]);
  return (
    <div>waiting page</div>
  )
}

export default page
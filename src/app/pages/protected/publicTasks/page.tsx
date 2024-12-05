"use client"
import React from 'react'

// Page component
const PublicTasks = () => {
  console.log("PublicTasks rendered");
  return (
    <div>
      <h1>Protected Page</h1>
      <p>You have the necessary permissions to view this content.</p>
    </div>
  );
};

export default PublicTasks;
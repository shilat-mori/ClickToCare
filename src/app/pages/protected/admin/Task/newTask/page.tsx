"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import TaskForm from "@/app/components/tasks/TaskForm";

const NewTask = () => {
  const router = useRouter();
  const goBack = () => {
    router.push("/pages/protected/publicTasks");
  };
  return <TaskForm mode={"add"} taskToUpdate={null} />;
};

export default NewTask;

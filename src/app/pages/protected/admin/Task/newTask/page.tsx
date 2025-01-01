"use client";
import React, { useState } from "react";
import ITask from "@/app/types/tasks";
import { useRouter } from "next/navigation";
import axios from "axios";
import { TaskFormPageProps } from "@/app/types/TaskFormPageProps";
import TaskForm from "@/app/components/TaskForm";

const NewTask: React.FC<TaskFormPageProps> = ({ turn_back }) => {
  const router = useRouter();
  const goBack = () => {
    router.push("/pages/protected/publicTasks");
  };
  return <TaskForm turn_back={goBack} mode={"add"} taskToUpdate={null} />;
};

export default NewTask;

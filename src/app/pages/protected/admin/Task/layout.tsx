"use client";
import React, { ReactElement } from "react";
import { useRouter } from "next/navigation";
import { TaskFormPageProps } from "@/app/types/TaskFormPageProps";

export default function Layout({
  children,
}: {
  children: ReactElement<TaskFormPageProps>;
}) {
  const router = useRouter();

  const goBack = () => {
    router.push("/pages/protected/publicTasks");
  };
  console.log("Child before cloning:", children); // בדיקת children
  return (
    <div>
      <button className="btn bg-gray-400" onClick={goBack}>
        Back
      </button>
      <div>{React.cloneElement(children, { turn_back: goBack })}</div>
    </div>
  );
}

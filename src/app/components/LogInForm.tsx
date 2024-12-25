"use client"
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { getUserRoleFromCookies } from "../services/frontUtils";
import { UserRole } from "../types/userRole";
import { NextResponse } from "next/server";

//learn code
 
const LogInForm = () => {
  const schema = z.object({
    username: z.string().min(2, "Username must be at least 2 characters"),
    password: z.string().min(3, "Password must be at least 3 characters"),
  });
  type zUser = z.infer<typeof schema>;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<zUser>({
    resolver: zodResolver(schema),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const router = useRouter()
  const onSubmit = async (data: zUser) => {
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("password", data.password);

    try {
      const username = formData.get("username") as string;
      const password = formData.get("password") as string;
      const response = await axios.post("/api/login", { username, password });
      if (response.data.error) {
        setMessage(response.data.error);
        alert(response.data.error);
      } else {
        //no need to check role here, we just created a new user, unauthorized
        console.log(response.data);
        const role = await getUserRoleFromCookies();
        if (!role)
          router.push("/");
        else if (role === UserRole.unauthorized)
          router.push("/pages/waiting/");
        else if (role > UserRole.unauthorized)
          router.push("/pages/protected/publicTasks");
      }
    } catch (error) {
      console.log(error);
      const axiosError = error as AxiosError;
      
    }
    setIsSubmitting(false);
  };
  return (
    <div className="form-box">
      <form className="h-full flex flex-col justify-between" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex">
          <input
            className="form-input"
            placeholder="Username"
            type="text"
            {...register("username")}
          />
          {errors.username && <p>{errors.username.message}</p>}
        </div>

        <div className="flex flex-col">
          <input
            className="form-input"
            placeholder="Password"
            type="password"
            {...register("password")}
          />
          {errors.password && <p>{errors.password.message}</p>}
        </div>

        <button className="buttonStyle flex flex-col" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Logging..." : "Log In"}
        </button>
      </form>
    </div>
  );
};
export default LogInForm;

"use client"
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { getUserRoleFromCookies } from "@/app/services/frontUtils";
import { UserRole } from "@/app/types/users/userRole";
import AxiosErrorResponse from "@/app/types/forms/axiosErrorResponse";
import { LoginResponse } from "@/app/types/forms/loginResponse";

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
    setMessage(""); // Clear previous messages

    try {
      const username = data.username as string;
      const password = data.password as string;

      const response = await axios.post<LoginResponse>("/api/login", {
        username,
        password,
      });

      if (response.data.error) {
        setMessage(response.data.error);
      } else {
        const role = await getUserRoleFromCookies();
        if (!role)
          router.push("/");
        else if (role === UserRole.unauthorized)
          router.push("/pages/waiting/");
        else if (role > UserRole.unauthorized)
          router.push("/pages/protected/publicTasks");
      }
    } catch (error) {
      const axiosError = error as AxiosError<AxiosErrorResponse>;
      if (axiosError.response?.data?.error) {
        setMessage(axiosError.response.data.error);
      } else {
        setMessage("An unexpected error occurred.");
      }
    }
    setIsSubmitting(false);
  };

  return (
    <div className="form-box">
      <form className="h-full flex flex-col justify-between" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex-col">
          <input
            className="form-input"
            placeholder="Username"
            type="text"
            {...register("username")}
          />
          {errors.username && <p className="error-message">{errors.username.message}</p>}
        </div>

        <div className="flex-col">
          <input
            className="form-input"
            placeholder="Password"
            type="password"
            {...register("password")}
          />
          {errors.password && <p className="error-message">{errors.password.message}</p>}
        </div>

        <div className="error-message-box">{message}</div>

        <button className="buttonStyle flex flex-col" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Logging..." : "Log In"}
        </button>
      </form>
    </div>
  );
};
export default LogInForm;

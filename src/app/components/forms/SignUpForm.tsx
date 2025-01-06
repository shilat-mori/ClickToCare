"use client"
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import AxiosErrorResponse from "@/app/types/forms/axiosErrorResponse";
import { LoginResponse } from "@/app/types/forms/loginResponse";

const SignUpForm = () => {
  const router = useRouter();
  const schema = z
    .object({
      username: z.string().min(2, "Username must be at least 2 characters"),
      email: z.string().email("Invalid email address"),
      password: z.string().min(3, "Password must be at least 3 characters"),
      confirmPassword: z
        .string()
        .min(3, "Password must be at least 3 characters"),
      faceImage: z
        .any()
        .refine((file) => file && file.length > 0, "Face image is required")
        .refine(
          (file) => file[0]?.size <= 5 * 1024 * 1024,
          "Face image must be under 5MB"
        )
        .refine(
          (file) =>
            ["image/jpeg", "image/png", "image/jpg"].includes(file[0]?.type),
          "Only JPG, JPEG or PNG images are allowed"
        ),
      freeText: z.string().optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ["confirmPassword"],
      message: "Passwords do not match",
    });
  type INewUser = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<INewUser>({
    resolver: zodResolver(schema),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const onSubmit = async (data: INewUser) => {
    setIsSubmitting(true);
    setMessage(""); // Clear previous messages

    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("faceImage", data.faceImage[0]); // Append the file
    if (data.freeText) formData.append("freeText", data.freeText);

    try {
      const response = await axios.post<LoginResponse>("/api/newUsers", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.error) {
        setMessage(response.data.error);
      } else {
        console.log("signed successfully");
        router.push("/pages/waiting/");
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
    <div className="form-box justify-center">
      <form
        className="h-full flex flex-col justify-between"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col">
          <input
            className="form-input"
            placeholder="Username"
            type="text"
            {...register("username")}
          />
          {errors.username && <p className="error-message">{errors.username.message}</p>}
        </div>

        <div className="flex flex-col">
          <input
            className="form-input"
            placeholder="Email"
            type="email"
            {...register("email")}
          />
          {errors.email && <p className="error-message">{errors.email.message}</p>}
        </div>

        <div className="flex flex-col">
          <input
            className="form-input"
            placeholder="Password"
            type="password"
            {...register("password")}
          />
          {errors.password && <p className="error-message">{errors.password.message}</p>}
        </div>
        <div className="flex flex-col">
          <input
            className="form-input"
            placeholder="Confirm Password"
            type="password"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && <p className="error-message">{errors.confirmPassword.message}</p>}
        </div>
        <div className="flex flex-col">
          <input
            className="form-input"
            placeholder="Face Image"
            type="file"
            accept="image/*"
            {...register("faceImage")}
          />
          {errors.faceImage?.message &&
            typeof errors.faceImage.message === "string" && (
              <p className="error-message">{errors.faceImage.message}</p>
            )}
        </div>

        <div className="flex flex-col">
          <textarea
            className="form-input"
            {...register("freeText")}
            placeholder="Write about yourself. why have you decided to join us?"
          />
        </div>

        <div className="error-message-box">{message}</div>

        <button
          className="buttonStyle flex flex-col"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};
export default SignUpForm;

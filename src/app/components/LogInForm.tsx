import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

const LogInForm = () => {
  const schema = z.object({
    username: z.string().min(2, "Username must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(3, "Password must be at least 3 characters"),
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

  const onSubmit = async (data: INewUser) => {
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("password", data.password);

    //TODO: fetch call for signing up

    const res = await fetch("/api/signup", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      console.log("User registered successfully");
    } else {
      console.error("Error registering user");
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
              placeholder="Email"
              type="email"
              {...register("email")}
            />
            {errors.email && <p>{errors.email.message}</p>}
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

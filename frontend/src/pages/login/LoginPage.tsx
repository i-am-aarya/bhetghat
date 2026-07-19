import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/authStore";
import { Eye, EyeOff, LockKeyhole, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

interface LoginFormData {
  username: string;
  password: string;
}

const LoginPage = () => {

  // const [error, setError] = useState("")
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const isLoading = useAuthStore((s) => s.isSubmitting)

  const login = useAuthStore((s) => s.login)

  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting}
  } = useForm<LoginFormData>()

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login({ username: data.username, password: data.password })
      navigate("/character")
    } catch (error) {
      console.error(error)
    } finally {
      //
    }

  }


  const submitting = isSubmitting || isLoading;

  const togglePassword = (e: React.MouseEvent) => {
    e.preventDefault()
    setShowPassword(!showPassword)
  }

  return (
    <div className="w-screen h-screen flex justify-center items-center flex-col gap-2">


      <div className="p-10 border border-border rounded-xl">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <img
                  src="/assets/icons/title-crisp.png"
                  alt="BhetGhat Logo"
                  width={250}
                  style={{ imageRendering: "pixelated" }}
                />

          <div>
            <label htmlFor="username" className="block text-muted-foreground text-xs font-medium mb-1">Username</label>
          <div className="relative">
            <Input
            id="username"
              {...register("username", {
                required: "username is required",
                minLength: {value: 4, message: "minimum 4 characters"}
              })}
              placeholder="username"
              className="pl-7 text-sm"
              />

            <User size={16} className="text-muted-foreground absolute top-1/2 -translate-y-1/2 left-2"/>

          </div>
            {errors.username && (
              <span className="text-xs text-red-500">
                {errors.username.message}
              </span>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-muted-foreground text-xs font-medium mb-1">Password</label>
          <div className="relative">
            <Input
            id="password"
              {...register("password", {
                required: "password is required",
                minLength: { value: 8, message: "minimum 8 characters" }
              },
              )}
              placeholder="password"
              className="pl-7 pr-7 text-sm"
              type={showPassword ? "text": "password"}
            />

            <LockKeyhole size={16} className="text-muted-foreground absolute top-1/2 -translate-y-1/2 left-2"/>

            <button className="text-muted-foreground absolute top-1/2 -translate-y-1/2 right-3" onClick={togglePassword}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>

          </div>
            {errors.password && (
              <span className="text-xs text-red-500">{errors.password.message}</span>
          )}
          </div>


          <Button type="submit" disabled={submitting}>
            {isSubmitting ? "Logging In.." : "Login"}
          </Button>

        </form>
      </div>

      <div className="text-sm text-muted-foreground mt-5">
        New here? {" "}
        <Link to={"/signup"} className="text-primary hover:underline font-medium">Sign Up</Link>
      </div>

    </div>
  );
};

export default LoginPage;

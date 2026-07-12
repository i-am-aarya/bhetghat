import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/authStore";
import { Eye, LockKeyhole, Mail, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

interface RegisterFormData {
  email: string;
  password: string;
  username: string;
}

const SignupPage = () => {
  const navigate = useNavigate();
  const register = useAuthStore((s) => s.register);
  const isLoading = useAuthStore((s) => s.isSubmitting);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>();

  const onSubmit = async (data: RegisterFormData) => {
    // setApiError("");
    try {
      await register({
        username: data.username,
        email: data.email,
        password: data.password,
      });

      navigate("/lobby");
    } catch (error) {
      // setApiError(error.response?.data?.message || "Registration Failed!");
      console.error(error);
    }
  };

  const submitting = isSubmitting || isLoading;


  const togglePassword = (e: React.MouseEvent) => {
    e.preventDefault()
    setShowPassword(!showPassword)
  }

  return (
    <div className="w-screen h-screen flex justify-center items-center flex-col gap-2">
      {/*Registration Div*/}

      <div className="p-10 border border-border rounded-xl">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
          <img
            src="/assets/icons/title-crisp.png"
            alt="BhetGhat Logo"
            width={250}
            style={{ imageRendering: "pixelated" }}
          />

        <div>
          <label htmlFor="email" className="block text-muted-foreground text-xs font-medium mb-1">Email</label>
            <div className="relative">
          <Input
          id="email"
            {...formRegister("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "invalid email",
              },
            })}
            type="email"
            placeholder="you@example.com"
            className="pl-7 text-sm"
          />
          <Mail size={16} className="absolute top-1/2 -translate-y-1/2 text-muted-foreground left-2"/>
            </div>
          {errors.email && (
            <span className="text-xs text-red-500">{errors.email.message}</span>
          )}
        </div>

        <div>
                    <label htmlFor="username" className="block text-muted-foreground text-xs font-medium mb-1">Username</label>
                  <div className="relative">
                    <Input
                    id="username"
                      {...formRegister("username", {
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
                                {...formRegister("password", {
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



        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? "Creating Account ..." : "Sign Up"}
        </Button>
      </form>
      </div>

      <div className="text-sm text-muted-foreground mt-5">
             Already signed up? {" "}
             <Link to={"/login"} className="text-primary hover:underline font-medium">Login</Link>
           </div>


    </div>
  );
};

export default SignupPage;

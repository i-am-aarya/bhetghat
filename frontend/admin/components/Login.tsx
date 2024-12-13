"use client";
import React, { useState } from "react";
import { useAuth } from "@/context/auth-context";
import Image from "next/image"; // Import Image component for optimization
import BackgroundImage from "@/app/assets/background.png"; // Import background image
import BackgroundBlurred from "@/app/assets/background-blurred.png"; // Import background image
import Title from "@/app/assets/title.png"; // Import title image
import { Input } from "./ui/input"; // Assuming Input is a custom component
import { Button } from "./ui/button";
import { LoadingSpinner } from "./spinner";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

const Login = () => {
  const router = useRouter()
  const { login, setUser, logout } = useAuth();
  const [loading, setLoading] = useState(false);

  // State for email and password input fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Error state
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true);

    // Simple form validation
    if (!email) {
      setEmailError("Email is required.");
      setLoading(false);
      return;
    }
    if (!password) {
      setPasswordError("Password is required.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true)
      login(email, password)
      setLoading(false)

    } catch (error) {
      setLoading(false);
      toast({
        title: "Login Failed",
        description: "Invalid Credentials"
      })
    }
  };

  return (
    <div className="flex w-full relative">
      {/* Background with Image */}
      <div
        className="flex-1 md:flex justify-center items-center hidden"
        style={{
          backgroundImage: `url(${BackgroundBlurred.src})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Use the Next.js Image component for the Title */}
        <div className="flex flex-col justify-center">
          <Image src={Title} alt="Logo" className="w-[500px] z-50 p-5" />
          <p className="text-6xl text-white font-bold font-mono"> Admin Dashboard</p>
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="flex flex-1 justify-center items-center h-screen bg-cover bg-center">
        <div className="flex flex-col p-10 ">
          <h1 className="text-7xl text-center font-bold mb-4 pb-9">
            Log<span className="text-[#EB3D77]">in</span>
          </h1>

          {/* Email Input */}
          <form onSubmit={handleLogin}>

            <div className="mb-4">
              <label htmlFor="emailInput" className="text-lg font-semibold">Enter Email</label>
              <Input
                className="w-[400px]"
                type="email"
                id="emailInput"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
              {(emailError && email.length === 0) && (
                <span className="text-red-500 text-sm">{emailError}</span>
              )}
            </div>

            {/* Password Input */}
            <div className="mb-4">
              <label className="text-lg font-semibold">Enter Password</label>
              <Input
                className="w-[400px]"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
              {(passwordError && password.length === 0) && (
                <span className="text-red-500 text-sm">{passwordError}</span>
              )}
            </div>

            {/* Login Button */}
            <Button className="w-full" type="submit" disabled={loading}>{
              loading ?
                <p className="flex gap-2 items-center"><LoadingSpinner /> Logging In</p>
                :
                "LogIn"
            }</Button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Login;

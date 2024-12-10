"use client";
import React, { useState } from "react";
import { useAuth } from "@/app/context/auth-context";
import Image from "next/image"; // Import Image component for optimization
import BackgroundImage from "@/app/assets/background.png"; // Import background image
import Title from "@/app/assets/title.png"; // Import title image
import { Input } from "./ui/input"; // Assuming Input is a custom component

const Login = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  // State for email and password input fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Error state
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleLogin = async () => {
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
      await login();
    } catch (error) {
      console.error("Login failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full relative">
      {/* Background with Image */}
      <div
        className="md:w-1/2 flex justify-start items-start"
        style={{
          backgroundImage: `url(${BackgroundImage.src})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Use the Next.js Image component for the Title */}
        <Image src={Title} alt="Logo" className="w-[245px] z-50 p-5" />
      </div>

      {/* Right side: Login Form */}
      <div className="flex md:w-1/2 justify-center items-center h-screen bg-cover bg-center">
        <div className="flex flex-col p-10 ">
          <h1 className="text-7xl text-center font-bold mb-4 pb-9">
            Log<span className="text-[#EB3D77]">in</span>
          </h1>

          {/* Email Input */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold pb-3">Enter Email</h2>
            <Input
              className="w-[400px]"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
            {emailError && (
              <span className="text-red-500 text-sm">{emailError}</span>
            )}
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold pb-3">Enter Password</h2>
            <Input
              className="w-[400px]"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
            {passwordError && (
              <span className="text-red-500 text-sm">{passwordError}</span>
            )}
          </div>

          {/* Login Button */}
          <button
            className={`bg-[#EB3D77] text-white hover:bg-[#f597b6] px-4 py-2 rounded ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;

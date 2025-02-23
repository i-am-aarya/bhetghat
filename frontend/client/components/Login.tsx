import useAuth from "@/hooks/useAuth";
import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";

const Login = () => {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (email.length === 0 || password.length === 0) {
      setError("");
      return;
    }

    try {
      await login(email, password);
    } catch (error) {
      setError("Invalid Credentials");
    }
  };

  return (
    <div className="border rounded-md shadow">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 max-w-2xl p-8"
      >
        <div style={{ imageRendering: "pixelated" }}>
          <Image
            src="/assets/icons/title-crisp.png"
            alt="BhetGhat Logo"
            width={400}
            height={400}
          />
        </div>

        <p className="text-4xl font-bold flex justify-center items-center">
          Login
        </p>

        <div>
          <Label
            htmlFor="emailInput"
            className="text-sm block text-gray-700 font-medium pixel-text"
          >
            Email
          </Label>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-500" />
            </div>
            <Input
              id="emailInput"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="godfather@example.com"
              title="Email Input"
              required
              className="pl-10"
            />
          </div>
        </div>

        <div>
          <Label
            htmlFor="passwordInput"
            className="text-sm block text-gray-700 font-medium pixel-text"
          >
            Password
          </Label>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center  pointer-events-none">
              <Lock className="w-5 h-5 text-gray-500" />
            </div>

            <Input
              id="passwordInput"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              placeholder="supersecret#123"
              title="Password Input"
              className="pl-10"
              required
            />

            <div className="absolute right-0 top-0">
              <Button
                onClick={() => {
                  setShowPassword(!showPassword);
                }}
                type="button"
                variant={"link"}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-gray-500" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-500" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {error && (
          <div>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <Button disabled={loading} type="submit" className="font-bold text-md">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : ""}
          LOGIN
        </Button>

        <p className="flex justify-center gap-2 items-center text-center text-sm text-gray-600">
          New User?{" "}
          <Link href="/register" className="text-[#d91656] hover:underline">
            Sign Up Here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;

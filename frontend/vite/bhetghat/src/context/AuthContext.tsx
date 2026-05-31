import axios from "axios";

import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  username: string;
  email: string;
  spriteURL: string;
  id?: string;
  firstName?: string;
  lastName?: string;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    firstname: string,
    lastname: string,
    username: string,
    email: string,
    password: string,
    confirmPassword: string,
  ) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_GAME_SERVER}/auth/v1/verify`,
          {
            withCredentials: true,
          },
        );
        setUser(response.data.user);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser();
  }, []);

  const register = async (
    firstname: string,
    lastname: string,
    username: string,
    email: string,
    password: string,
    confirmPassword: string,
  ) => {
    const response = await fetch("/auth/v1/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        firstname,
        lastname,
        username,
        email,
        password,
        confirmPassword,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      setUser(data.user);

      navigate("/login");
    } else {
      throw new Error("Registration Failed!");
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const serverUrl = import.meta.env.VITE_GAME_SERVER;
      console.log(serverUrl);

      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_GAME_SERVER}/auth/v1/login`,
        {
          email: email,
          password: password,
        },
        {
          withCredentials: true,
        },
      );
      console.log("login successful1");
      setUser(response.data.user);
      console.log("login successful2");
      setUser(response.data.user);
      console.log("login successful3");
      localStorage.setItem("authToken", response.data.authToken);

      console.log("token set successfully");
      const tok = localStorage.getItem("authToken");
      console.log("token got successfully: ", tok);

      console.log("login successful4");
      navigate("/character");
      console.log("login successful5");
    } catch (error) {
      console.error("ERROR Logging in:", error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await fetch(`${import.meta.env.VITE_GAME_SERVER}/auth/v1/logout`, {
      credentials: "include",
    });
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

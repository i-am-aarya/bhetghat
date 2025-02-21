"use client";
import { useRouter } from "next/navigation";
import React, { createContext, useEffect, useState } from "react";

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
  const [loading, setLoading] = useState<boolean>(true);

  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      if (process.env.NEXT_PUBLIC_DEVELOPMENT === "true") {
        const mockUser: User = {
          id: "67b36cfae3582aed4548e52c",
          firstName: "",
          lastName: "",
          spriteURL: "assets/characters/character-male.png",
          email: "mocker@abc.com",
          username: "faker",
          isAdmin: false,
        };
        setUser(mockUser);
        return;
      }

      try {
        const response = await fetch("/api/auth/verify", {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (error) {
        console.log("failed to log in");
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
    const response = await fetch("/api/auth/register", {
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

      router.push("/login");
    } else {
      throw new Error("Registration Failed!");
    }
  };

  const login = async (email: string, password: string) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      setUser(data.user);
      router.push("/game");
    } else {
      throw new Error("Invalid Credentials!");
    }
  };

  const logout = async () => {
    // await fetch("")
    await fetch(`${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/auth/v1/logout`, {
      credentials: "include",
    });
    setUser(null);

    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

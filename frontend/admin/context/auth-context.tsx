"use client";
import { toast } from "@/hooks/use-toast";
import { getCookie } from "@/utils/getCookie";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useState, useEffect } from "react";

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>
  logout: () => Promise<void>;
};

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const fetchUser = async () => {

      if(getCookie('authToken')?.length===0) {
        return
      }

      try {
        const response = await fetch("http://localhost:8000/auth/v1/verify", {
          method: 'GET',
          credentials: "include"
        })

        if (response.ok) {
          const data = await response.json()
          if (data.user.isAdmin) {
            setUser(data.user)
            router.push('/')
          } else {
            setUser(null)
          }
        } else {
          setUser(null)
        }

      } catch (err) {
        toast({
          title: "Login Failed",
          description: "Some Error Occurred!",
          variant: "destructive"
        })
      }
    }
    fetchUser()
    console.log("fetch user called")
  }, []);


  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("http://localhost:8000/auth/v1/login", {
        method: 'POST',
        headers: { 'Content-Type': 'Application/json' },
        credentials: "include",
        body: JSON.stringify({ email, password })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.user.isAdmin) {
          setUser(data.user)
          router.push('/admin')
        }
      }

    } catch (err) {
      toast({
        title: "Login Failed",
        description: "Something went wrong"
      })
    }
  };

  const logout = async () => {
    try {
      const response = await fetch("http://localhost:8000/auth/v1/logout", {
        method: 'POST',
        credentials: 'include'
      })
      if(response.ok) {
        router.push('/login')
      }
    } catch (err) {
      console.log(err)
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

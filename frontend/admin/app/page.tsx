"use client"

import Time from "@/components/Time";
import React, { useEffect } from "react";
import { useAuth } from "../context/auth-context";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter()
  const { user, logout } = useAuth()
  useEffect(() => {
    if(user && user.isAdmin) {
      router.push('/admin')
      toast({
        title: `Welcome, ${user.firstName}`,
        description: "How are you doing today?"
      })
    } else {
      logout()
      router.push('/login')
    }
  }, [])
  return (
    <div className="p-9">
      <Time />
      You are here!
    </div>
  );
};

export default Home;

"use client";
import React, { useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { MenuBar } from "@/components/MenuBar"; // Your Navbar
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const router = useRouter()

  useEffect(() => {

    if (!user || !user?.isAdmin) {
      router.push("/login")
      toast({
        title: "Unauthorized",
        variant: "destructive"
      })
    }
  }, [])

  return (
    <div className="flex flex-col md:flex-row">
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default ProtectedLayout;

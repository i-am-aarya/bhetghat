"use client";
import React from "react";
import { useAuth } from "@/app/context/auth-context";
import { MenuBar } from "@/components/MenuBar"; // Your Navbar
import Login from "@/components/Login"; // Your Login Component

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Login />; // Render login component if not authenticated
  }

  return (
    <div className="flex flex-col md:flex-row">
      <div className="flex-none md:block hidden w-64">
        <MenuBar />
      </div>
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default ProtectedLayout;

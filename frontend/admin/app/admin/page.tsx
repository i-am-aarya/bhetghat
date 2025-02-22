"use client";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Dashboard = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/admin/players");
  }, []);
  return (
    <div className="p-10">
      <p className="text-4xl font-bold">Dashboard</p>
    </div>
  );
};

export default Dashboard;

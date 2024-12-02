"use client";
import React, { useState } from "react";
import Link from "next/link"; // Import Next.js Link component
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";

import { LogOut, Settings2, Users2 } from "lucide-react";

const items = [
  {
    title: "Manage Players",
    url: "/manage_players",
    icon: Users2,
  },
  {
    title: "Account Settings",
    url: "/account_settings",
    icon: Settings2,
  },
  {
    title: "Log Out",
    url: "/log-out",
    icon: LogOut,
  },
];

export function MenuBar() {
  const [highlight, setHighlight] = useState<string | null>(null);

  return (
    <SidebarProvider className="bg-white w-64">
      {" "}
      {/* Adjust sidebar width */}
      <Sidebar className="p-4 bg-white">
        <SidebarContent className="bg-white">
          <SidebarGroup>
            <SidebarHeader className="text-4xl text-black font-bold mb-9">
              BhetGhat
            </SidebarHeader>
            <SidebarGroupLabel className="text-lg mb-7 font-medium">
              Dashboard
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title} className="p-2">
                    <SidebarMenuButton
                      className="hover:bg-[#f597b6] hover:text-white"
                      asChild
                    >
                      <Link
                        href={item.url}
                        onClick={() => setHighlight(item.title)}
                        className={`flex items-center p-2 rounded-md ${
                          highlight === item.title
                            ? "text-white bg-[#EB3D77]"
                            : "text-black"
                        } hover:bg-[#f597b6] hover:text-white`}
                      >
                        <item.icon className="mr-2" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}

export default MenuBar;

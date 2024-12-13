"use client";
import React, { useState } from "react";
import Link from "next/link"; // Import Next.js Link component

import { useRouter } from "next/navigation"; // Import useRouter for navigation
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

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { LogOut, Settings2, Users2 } from "lucide-react";
import { useAuth } from "@/context/auth-context";

const items = [
  {
    title: "Manage Players",
    url: "/admin/players",
    icon: Users2,
  },
  {
    title: "Account Settings",
    url: "/admin/account",
    icon: Settings2,
  },
];

export function MenuBar() {
  const {logout} = useAuth()
  const [highlight, setHighlight] = useState<string | null>(null);
  const [showLogOutDialog, setShowLogOutDialog] = useState(false);
  const router = useRouter(); // Initialize Next.js router

  const handleLogOut = () => {
    setShowLogOutDialog(false); // Close the dialog
    setHighlight("Log Out");
    logout()
  };

  return (
      <Sidebar className="p-4">
        <SidebarContent className="">
          <SidebarGroup>
            <SidebarHeader className="text-4xl font-bold mb-9">
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
                      className="hover:bg-[#f597b6] hover:text-white p-4"
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
                {/* Log Out Menu Item */}
                <SidebarMenuItem className="p-2">
                  <SidebarMenuButton
                    className={`hover:bg-[#f597b6] hover:text-white flex items-center p-2 rounded-md ${
                      highlight === "Log Out"
                        ? "text-white bg-[#EB3D77]"
                        : "text-black"
                    }`}
                    onClick={() => setShowLogOutDialog(true)}
                  >
                    <LogOut className="mr-2" />
                    <span>Log Out</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

      {/* Log Out Confirmation Dialog */}
      {showLogOutDialog && (
        <AlertDialog open={showLogOutDialog} onOpenChange={setShowLogOutDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Log Out</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to log out?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setShowLogOutDialog(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleLogOut}
              >
                Log Out
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      </Sidebar>
  );
}

export default MenuBar;

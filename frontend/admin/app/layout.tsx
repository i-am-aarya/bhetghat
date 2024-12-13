import "./globals.css";

import { AuthProvider } from "@/context/auth-context";
import { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "BhetGhat - Admin",
  description: "Admin dashboard for BhetGhat",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
          <Toaster/>
        </AuthProvider>
      </body>
    </html>
  );
}

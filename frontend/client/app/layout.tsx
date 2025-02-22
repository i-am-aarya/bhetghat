import type { Metadata } from "next";
// import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthContext";
import { Poppins } from "next/font/google";

export const metadata: Metadata = {
  title: "BhetGhat",
  description: "Download BhetGhat",
};

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: "600",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <AuthProvider>{children}</AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}

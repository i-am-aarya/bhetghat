import MenuBar from "@/components/MenuBar";
import "./globals.css";

import { AuthProvider } from "@/app/context/auth-context";
import ProtectedLayout from "@/components/layouts/ProtectedLayout";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ProtectedLayout>{children}</ProtectedLayout>
        </AuthProvider>
      </body>
    </html>
  );
}

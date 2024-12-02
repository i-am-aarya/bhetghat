import MenuBar from "@/components/MenuBar";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col md:flex-row">
        <div className="flex-none md:block hidden w-64">
          <MenuBar/>
        </div>
        <main className="flex-1">
          {children}</main>
      </body>
    </html>
  );
}

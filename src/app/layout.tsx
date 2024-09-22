import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/Navbar";
import { EdgeStoreProvider } from "@/lib/edgestore";
import { Toaster } from "@/components/ui/toaster";


export const metadata: Metadata = {
  title: "Zeddit",
  description: "Social Media for Young Generation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html lang="en" suppressHydrationWarning={true}>
        <body className="dark:bg-[#171717]">
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <EdgeStoreProvider>
              {children}
              <Toaster/>
            </EdgeStoreProvider>
          </ThemeProvider>
        </body>
      </html>
    </AuthProvider>
  );
}

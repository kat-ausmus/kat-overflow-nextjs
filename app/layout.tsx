import type { Metadata } from "next";

import "./globals.css";
import localFont from "next/font/local";
import ThemeProvider from "@/context/theme-provider";
import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/sideBar/AppSideBar";

const inter = localFont({
  src: "./fonts/InterVR.ttf",
  variable: "--font-inter",
  weight: "100 200 300 400 500 600 700 800 900",
});

const spaceGrotesk = localFont({
  src: "./fonts/SpaceGroteskVF.ttf",
  variable: "--font-space-grotesk",
  weight: "300 400 500 700",
});

export const metadata: Metadata = {
  title: "Kat Overflow App",
  description: "Stackoverflow like app built with Next.js",
  icons: {
    icon: "/site-logo.svg",
  },
};

const Layout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const session = await auth();
  return (
    <html lang="en" suppressHydrationWarning>
      <SessionProvider session={session}>
        <body className={`${inter.className} ${spaceGrotesk.variable} antialiased`}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <SidebarProvider>
              <AppSidebar />
              <main>{children}</main>
            </SidebarProvider>
          </ThemeProvider>
          <Toaster />
        </body>
      </SessionProvider>
    </html>
  );
};

export default Layout;

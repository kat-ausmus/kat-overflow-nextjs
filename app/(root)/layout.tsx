import React from "react";
import NavBar from "@/components/navigation/navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/sideBar/AppSideBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <NavBar />
      <SidebarProvider>
        <AppSidebar />
        <main>{children}</main>
        {children}
      </SidebarProvider>
    </main>
  );
}

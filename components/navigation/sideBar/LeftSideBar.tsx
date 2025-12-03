"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { sidebarLinks } from "@/constants/sidebarLinks";
import React from "react";
import SideBarItem from "@/components/navigation/sideBar/SideBarItem";
import SideBarBottomItem from "@/components/navigation/sideBar/SideBarBottomItem";
import { useSession } from "next-auth/react";

export function LeftSideBar() {
  const { data: session } = useSession();
  const firstSixLinks = sidebarLinks.slice(0, 6);
  const lastFewLinks = sidebarLinks.slice(6);
  const isLoggedIn = !!session;
  console.log("Rendering LeftSideBar", { session, isLoggedIn });
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent className="flex flex-col justify-between">
        <SidebarGroup>
          <SidebarMenu className="align-items-stretch flex flex-col justify-end-safe gap-4">
            {firstSixLinks.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <SideBarItem item={item} />
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <div className="flex flex-col justify-end-safe">
            {lastFewLinks.map((item) => (
              <div className="flex flex-col justify-end-safe gap-4 px-4 py-2" key={item.title}>
                <SideBarBottomItem item={item} />
              </div>
            ))}
          </div>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}

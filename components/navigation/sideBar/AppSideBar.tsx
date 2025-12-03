"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { sidebarLinks } from "@/constants/sidebarLinks";
import React from "react";
import AppSideBarItem from "@/components/navigation/sideBar/AppSideBarItem";
import AppSideBarBottom from "@/components/navigation/sideBar/AppSideBarBottom";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroupLabel>Application</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {sidebarLinks.map((item, index) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  {index <= 5 ? <AppSideBarItem item={item} isMobile /> : <AppSideBarBottom item={item} isMobile />}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}

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

export function LeftSideBar() {
  const firstSixLinks = sidebarLinks.slice(0, 6);
  const lastFewLinks = sidebarLinks.slice(6);

  return (
    <Sidebar className="pt-20">
      <SidebarHeader />
      <SidebarContent className="flex flex-1 flex-col justify-between">
        <SidebarGroup>
          <SidebarMenu className="align-items-stretch flex flex-col justify-end-safe gap-2">
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
          <div className="flex flex-col">
            {lastFewLinks.map((item) => (
              <div className="flex flex-col pt-4" key={item.title}>
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

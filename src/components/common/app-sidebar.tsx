"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
} from "@/components/ui/sidebar";

import { NavUser } from "./nav-user";
import { SidebarMenuWithSubitems } from "./nav-main";

export default function AppSidebar() {

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenuWithSubitems />
        </SidebarGroup>
      </SidebarContent>
        <SidebarFooter>
          <NavUser />
        </SidebarFooter>
    </Sidebar>
  );
}
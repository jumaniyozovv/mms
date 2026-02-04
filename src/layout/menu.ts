import { LayoutDashboardIcon, UserIcon, SettingsIcon, LucideIcon, Users } from "lucide-react";

export interface SubMenuItem{
    title: string;
  icon: LucideIcon;
  roles: ("admin" | "manager" | "user")[];
  path: string; 
}
export interface MenuItem {
  title: string;
  icon: LucideIcon;
  roles: ("admin" | "manager" | "user")[]; // allowed roles
  path: string; // URL path
  subitems?:SubMenuItem[]
};

export const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboardIcon,
    roles: ["admin", "manager"],
    path: "/dashboard",
    subitems:[{
        title:"aaa",
        icon:Users,
        path:"/dashboard/users",
        roles:["admin"]
    }]
  },
  {
    title: "Users",
    icon: UserIcon,
    roles: ["admin"],
    path: "/dashboard/users",
  },
  {
    title: "Settings",
    icon: SettingsIcon,
    roles: ["admin", "manager"],
    path: "/settings",
  },
];

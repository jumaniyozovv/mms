import { LayoutDashboardIcon, UserIcon, SettingsIcon, CalendarDays, LucideIcon, Users, FileBarChart } from "lucide-react";

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
  },
  {
    title: "Users",
    icon: UserIcon,
    roles: ["admin"],
    path: "/users",
  },
  {
    title: "Day Off",
    icon: CalendarDays,
    roles: ["admin", "manager", "user"],
    path: "/day-off",
    subitems: [
      {
        title: "Dashboard",
        icon: LayoutDashboardIcon,
        roles: ["admin", "manager", "user"],
        path: "/day-off",
      },
      {
        title: "Reports",
        icon: FileBarChart,
        roles: ["admin", "manager", "user"],
        path: "/day-off/reports",
      },
      {
        title: "Settings",
        icon: SettingsIcon,
        roles: ["admin", "manager"],
        path: "/day-off/settings",
      },
    ],
  },
  {
    title: "Settings",
    icon: SettingsIcon,
    roles: ["admin", "manager"],
    path: "/settings",
  },
];

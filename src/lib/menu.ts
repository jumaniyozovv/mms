import { UserRole } from "@/app/generated/prisma/enums";
import { LayoutDashboardIcon,  SettingsIcon, CalendarDays, LucideIcon, Users, FileBarChart, ListCheckIcon,FolderGit2 } from "lucide-react";



export interface SubMenuItem{
  title: string;
  icon: LucideIcon;
  roles: UserRole[];
  path: string; 
}
export interface MenuItem {
  title: string;
  icon: LucideIcon;
  roles: UserRole[]; // allowed roles
  path: string; // URL path
  subitems?:SubMenuItem[]
};

export const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboardIcon,
    roles: [],
    path: "/dashboard",
  },
  {
    title: "Users",
    icon: Users,
    roles: [],
    path: "/users",
  },
  {
  title: "Tasks",
  icon: ListCheckIcon,
  roles: [],
  path: "/tasks",
  subitems: [
    {
      title: "Table",
      icon: ListCheckIcon,
      roles: [],
      path: "/tasks",
    },
    {
      title: "Board",
      icon: LayoutDashboardIcon, // or Kanban/Columns icon if lucide has one
      roles: [],
      path: "/tasks/board",
    },
  ],
},
    {
    title: "Projects",
    icon: FolderGit2,
    roles: [],
    path: "/projects",
  },
  {
    title: "Day Off",
    icon: CalendarDays,
    roles: [],
    path: "/day-off",
    subitems: [
      {
        title: "Dashboard",
        icon: LayoutDashboardIcon,
        roles: [],
        path: "/day-off/dashboard",
      },
      {
        title: "Reports",
        icon: FileBarChart,
        roles: [],
        path: "/day-off/reports",
      },
      {
        title: "Settings",
        icon: SettingsIcon,
        roles: ["ADMIN", "MANAGER"],
        path: "/day-off/settings",
      },
    ],
  },
  {
    title: "Settings",
    icon: SettingsIcon,
    roles: [],
    path: "/settings",
  },
];

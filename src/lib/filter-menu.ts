import { UserRole } from "@/app/generated/prisma/enums";
import { MenuItem, SubMenuItem, menuItems } from "@/lib/menu";


export function getVisibleMenu(role: UserRole): MenuItem[] {
  return menuItems
    .filter((item) => item.roles.includes(role)||item.roles.length===0)
    .map((item) => ({
      ...item,
      subitems: item.subitems?.filter((sub: SubMenuItem) =>
        sub.roles.includes(role)||sub.roles.length===0
      ),
    }));
}
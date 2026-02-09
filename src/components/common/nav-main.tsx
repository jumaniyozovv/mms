import { usePathname } from "next/navigation";
import { SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "../ui/sidebar";
import { menuItems, SubMenuItem } from "@/lib/menu";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";

export function SidebarMenuWithSubitems() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <SidebarMenu>
      {menuItems.map((item) => {
        const isActive =
          pathname === item.path || pathname.startsWith(`${item.path}/`);

        const hasSubitems = !!item.subitems?.length;
        const Icon = item.icon;

        // ── Item with NO subitems ──
        if (!hasSubitems) {
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                <Link href={item.path}>
                  <Icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        }

        // ── Item WITH subitems (collapsed) → DropdownMenu ──
        if (isCollapsed) {
          return (
            <SidebarMenuItem key={item.title}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton isActive={isActive}>
                    <Icon />
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" align="start" className="min-w-48">
                  <DropdownMenuLabel>{item.title}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {item.subitems?.map((sub: SubMenuItem) => {
                    const isSubActive = pathname === sub.path;
                    const SubIcon = sub.icon;

                    return (
                      <DropdownMenuItem key={sub.title} asChild>
                        <Link
                          href={sub.path}
                          className={cn(
                            "flex items-center gap-2 cursor-pointer",
                            isSubActive && "bg-accent"
                          )}
                        >
                          <SubIcon className="h-4 w-4" />
                          <span>{sub.title}</span>
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          );
        }

        // ── Item WITH subitems (expanded) → Collapsible ──
        return (
          <Collapsible
            key={item.title}
            defaultOpen={isActive || pathname.startsWith(item.path)}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton isActive={isActive}>
                  <Icon />
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
            </SidebarMenuItem>

            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {item.subitems?.map((sub: SubMenuItem) => {
                    const isSubActive = pathname === sub.path;
                    const SubIcon = sub.icon;

                    return (
                      <SidebarMenuItem key={sub.title}>
                        <SidebarMenuButton
                          asChild
                          isActive={isSubActive}
                          className="pl-8"
                        >
                          <Link href={sub.path}>
                            <SubIcon className="h-4 w-4" />
                            <span>{sub.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        );
      })}
    </SidebarMenu>
  );
}
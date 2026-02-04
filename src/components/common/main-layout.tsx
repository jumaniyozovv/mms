import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "./app-sidebar";
import { ReactNode } from "react";
import { ModeToggle } from "@/components/cusom/toggle-mode";

export default function MainLayout({ children }: { children: ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="bg-background border-b sticky top-0 z-30 flex h-14 lg:h-15 shrink-0 items-center gap-4 px-4 lg:px-6">
                    <SidebarTrigger className="data-[state=open]:bg-accent data-[state=open]:text-accent-foreground" />
                    <div className="flex-1">
                        <h1 className="text-lg font-semibold">Dashboard</h1>
                    </div>
                    <ModeToggle />
                </header>

                <main className="flex-1 overflow-y-auto p-4 lg:p-6">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
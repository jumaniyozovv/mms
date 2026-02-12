import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "../components/common/app-sidebar";
import { ReactNode } from "react";
import { ModeToggle } from "@/components/cusom/toggle-mode";

export default function MainLayout({ children }: { children: ReactNode }) {
    return (
        <SidebarProvider >
            <AppSidebar />
            <SidebarInset className="pr-2 h-screen overflow-y-hidden">
                <header className="w-full bg-card border rounded-lg mt-2 flex h-14 lg:h-15 shrink-0 justify-center items-center gap-4 px-4">
                    <SidebarTrigger className="data-[state=open]:bg-accent data-[state=open]:text-accent-foreground" />
                    <div className="flex-1">
                        <h1 className="text-lg font-semibold">Dashboard</h1>
                    </div>
                    <ModeToggle />
                </header>
                <main className="w-full h-[calc(100vh-84px)] mt-2 rounded-lg border bg-card overflow-y-auto p-4">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
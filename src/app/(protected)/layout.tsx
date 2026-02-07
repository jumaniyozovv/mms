
import MainLayout from "@/layout/main-layout";
import { AuthProvider } from "@/shared/providers/AuthProvider";
import { SocketProvider } from "@/shared/providers/SocketProvider";
import { ReactNode } from "react";

export default function ProtectedeLayout({ children }: { children: ReactNode }) {
    return (
        <AuthProvider>
            <SocketProvider>
                <MainLayout>{children}</MainLayout>
            </SocketProvider>
        </AuthProvider>
    )
}
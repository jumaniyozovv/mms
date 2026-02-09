
import MainLayout from "@/lib/main-layout";
import { AuthProvider } from "@/shared/providers/AuthProvider";
import { ReactNode } from "react";

export default function ProtectedeLayout({ children }: { children: ReactNode }) {
    return (
        <AuthProvider>
            <MainLayout>{children}</MainLayout>
        </AuthProvider>
    )
}
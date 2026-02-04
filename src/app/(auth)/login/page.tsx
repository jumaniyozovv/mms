import { Suspense } from "react";
import { LoginForm } from "@/features/auth/components";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Suspense
        fallback={
          <div className="w-full max-w-md p-8 text-center text-muted-foreground">
            Loading...
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}

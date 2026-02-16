import { Suspense } from "react";
import { LoginForm } from "@/features/auth/components";
import { DottedGlowBackground } from "@/components/ui/dotted-glow-background";

export default function LoginPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden">
      <DottedGlowBackground />
      <Suspense
        fallback={
          <div className="relative z-10 w-full max-w-md p-8 text-center text-muted-foreground">
            Loading...
          </div>
        }
      >
        <div className="relative z-10">
          <LoginForm />
        </div>
      </Suspense>
    </div>
  );
}

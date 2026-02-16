import { Suspense } from "react";
import { RegisterForm } from "@/features/auth/components";

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-md p-8 text-center text-muted-foreground">
          Loading...
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}

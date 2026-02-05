    "use client";

import { useAuth } from "@/shared/providers/AuthProvider";



    export default function Dashboard() {
      const {isLoading} = useAuth()
      if (isLoading) {
        return (
          <div className="flex min-h-screen items-center justify-center">
            <p className="text-gray-500 text-xl">Loading...</p>
          </div>
        );
      }

      return (
        <div className="h-full w-full">
aaaaaaaaaaaa
        </div>
      );
    }


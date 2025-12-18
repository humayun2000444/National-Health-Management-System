"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { cn } from "@/lib/utils";
import { CurrencyProvider } from "@/contexts/CurrencyContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
      return;
    }

    // Redirect to correct portal based on user type
    const userType = session.user.type;
    const isInCorrectPortal = pathname.startsWith(`/${userType}`);

    if (!isInCorrectPortal) {
      router.push(`/${userType}`);
    }
  }, [session, status, router, pathname]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-blue-600" />
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <CurrencyProvider>
      <div className="min-h-screen bg-slate-50">
        <Sidebar />
        <main
          className={cn(
            "transition-all duration-300",
            sidebarCollapsed ? "ml-20" : "ml-64"
          )}
        >
          {children}
        </main>
      </div>
    </CurrencyProvider>
  );
}

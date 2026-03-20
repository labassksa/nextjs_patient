"use client";

import { usePathname } from "next/navigation";
import { DashboardProviders } from "@/features/dashboard/providers/dashboard-providers";
import { AuthGuard } from "@/features/dashboard/providers/auth-guard";
import { Sidebar } from "@/features/dashboard/components/layout/sidebar";
import { Topbar } from "@/features/dashboard/components/layout/topbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/dashboard/login";

  return (
    <div dir="ltr" className="font-cairo min-h-screen bg-gray-50">
      <DashboardProviders>
        <AuthGuard>
          {isLoginPage ? (
            children
          ) : (
            <div className="flex h-screen overflow-hidden">
              <Sidebar />
              <div className="flex-1 flex flex-col overflow-hidden">
                <Topbar />
                <main className="flex-1 overflow-y-auto p-6">
                  {children}
                </main>
              </div>
            </div>
          )}
        </AuthGuard>
      </DashboardProviders>
    </div>
  );
}

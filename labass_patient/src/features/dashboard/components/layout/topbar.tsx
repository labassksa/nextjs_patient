"use client";

import { usePathname } from "next/navigation";
import { sidebarNavigation } from "@/features/dashboard/constants/navigation";

function getPageTitle(pathname: string): string {
  if (pathname === "/dashboard") return "Overview";

  const navItem = sidebarNavigation.find(
    (item) => item.href !== "/dashboard" && pathname.startsWith(item.href)
  );

  if (navItem) return navItem.label;

  return "Dashboard";
}

export function Topbar() {
  const pathname = usePathname();

  if (pathname === "/dashboard/login") return null;

  const title = getPageTitle(pathname);

  return (
    <header className="flex h-14 items-center border-b bg-card px-6">
      <div className="ml-12 md:ml-0">
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
    </header>
  );
}

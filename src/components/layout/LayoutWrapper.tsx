"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/login") {
    // If on login page, render children without Sidebar and Topbar
    return <div className="h-screen w-screen overflow-hidden bg-slate-950">{children}</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <div className="mx-auto max-w-7xl animate-in fade-in zoom-in-95 duration-300">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

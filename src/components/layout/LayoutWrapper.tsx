"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { X } from "lucide-react";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Tutup sidebar otomatis jika user berpindah halaman
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  if (pathname === "/login") {
    // If on login page, render children without Sidebar and Topbar
    return <div className="h-screen w-screen overflow-hidden bg-slate-950">{children}</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden w-full relative">
      
      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop gelap */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)} />
          
          {/* Panel animatif */}
          <div className="relative w-64 h-full shadow-2xl flex animate-in slide-in-from-left-full duration-200 ease-out">
            <Sidebar />
            
            {/* Tombol Silang (X) di luar panel */}
            <button 
              className="absolute top-4 -right-12 w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors border border-slate-700"
              onClick={() => setIsMobileOpen(false)}
              aria-label="Tutup navigasi"
            >
              <X className="w-5 h-5"/>
            </button>
          </div>
        </div>
      )}

      {/* Area Utama */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Topbar onMenuClick={() => setIsMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 scroll-smooth">
          <div className="mx-auto max-w-7xl animate-in fade-in zoom-in-95 duration-300">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

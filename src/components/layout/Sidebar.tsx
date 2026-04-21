"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, Search, Video, Archive, PieChart, LogOut, Settings } from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', icon: Home, href: '/' },
  { name: 'Product Research', icon: Search, href: '/research' },
  { name: 'Collections', icon: Archive, href: '/collections' },
  { name: 'Livestream Mgr', icon: Video, href: '/livestream' },
  { name: 'Analytics', icon: PieChart, href: '/analytics' },
];

export function Sidebar() {
  const router = useRouter();

  const handleLogout = () => {
     // Hancurkan cookie
     document.cookie = "shopfind_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
     router.push("/login");
  };

  return (
    <aside className="w-64 h-screen bg-slate-950 text-slate-300 flex flex-col border-r border-slate-800">
      <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-900/50">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
          Shopfind
        </h1>
        <span className="ml-2 text-xs font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">v1.3</span>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-slate-800 hover:text-white group"
          >
            <item.icon className="w-5 h-5 text-slate-500 group-hover:text-orange-400 transition-colors" />
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 space-y-2">
        <Link href="/settings" className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 hover:text-white transition-colors">
          <Settings className="w-5 h-5 text-slate-500" />
          Settings
        </Link>
        <button onClick={handleLogout} className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors">
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}

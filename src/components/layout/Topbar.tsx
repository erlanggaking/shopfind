"use client";

import { Bell, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Topbar() {
  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-10 transition-colors">
      <div className="flex-1 max-w-xl flex items-center gap-2">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <Input 
            placeholder="Search campaigns, streams, or products..." 
            className="pl-9 bg-slate-100/50 dark:bg-slate-900/50 border-none focus-visible:ring-1 focus-visible:ring-orange-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2.5 h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse"></span>
        </Button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800">
          <div className="hidden md:flex flex-col text-right">
            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">Boss Admin</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Master Account</span>
          </div>
          <Avatar className="h-9 w-9 border-2 border-orange-100 dark:border-orange-900/50 cursor-pointer hover:opacity-80 transition-opacity">
             <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" />
             <AvatarFallback>AD</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}

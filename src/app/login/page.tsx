"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate Supabase/Auth network delay
    setTimeout(() => {
      setIsLoading(false);
      router.push("/");
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-slate-950">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-orange-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-red-600/10 blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent inline-block pb-1">
            Shopfind
          </h1>
          <Badge className="ml-2 bg-slate-800 text-slate-300 pointer-events-none align-top mt-1">v1.3</Badge>
          <p className="text-slate-400 mt-2 text-sm">Agency Command Center</p>
        </div>

        <Card className="bg-slate-900/80 backdrop-blur-xl border-slate-800 shadow-2xl">
          <form onSubmit={handleLogin}>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-slate-100">Welcome back</CardTitle>
              <CardDescription className="text-slate-400">
                Enter your credentials to access your agency dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Email Config / Shop ID</label>
                <Input 
                  type="email" 
                  placeholder="admin@shopfind.id" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-slate-200 h-11 focus-visible:ring-orange-500"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-300">Password</label>
                  <a href="#" className="text-xs text-orange-400 hover:text-orange-300">Forgot password?</a>
                </div>
                <Input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-slate-200 h-11 focus-visible:ring-orange-500"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-11 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-medium shadow-[0_0_20px_rgba(234,88,12,0.2)] transition-all"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <p className="text-center text-xs text-slate-500 mt-8">
          By signing in, you agree to our Terms of Service. <br />
          System secured by Supabase Auth.
        </p>
      </div>
    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${className}`}>
      {children}
    </span>
  );
}

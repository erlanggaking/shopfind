import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, PlayCircle, ShoppingBag, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
        <p className="text-slate-400 mt-1">Welcome back. Here is what's happening with your agency today.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Active Streamers</CardTitle>
            <PlayCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">12 / 45</div>
            <p className="text-xs text-slate-400 mt-1">
              <span className="text-emerald-400">+2</span> since last hour
            </p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Total Viewers (CCU)</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">4,320</div>
            <p className="text-xs text-slate-400 mt-1">Across all live sessions</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Est. Commission</CardTitle>
            <Activity className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">Rp 12.4M</div>
            <p className="text-xs text-slate-400 mt-1">
              Generated today
            </p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Winning Products</CardTitle>
            <ShoppingBag className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">142</div>
            <p className="text-xs text-slate-400 mt-1">Ready in collections</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
        <Card className="col-span-4 bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-200">Live Traffic Source</CardTitle>
             <CardDescription className="text-slate-400">Viewers trend over the last 12 hours</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center border-dashed border-2 border-slate-800 rounded-md m-4">
            <p className="text-slate-500 text-sm">Chart Placeholder</p>
          </CardContent>
        </Card>
        <Card className="col-span-3 bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-200">Top Streamers</CardTitle>
            <CardDescription className="text-slate-400">Based on CCU metrics</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center">
                    <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold mr-3 border border-slate-700">
                      S{i}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none text-slate-200">Streamer {i}</p>
                      <p className="text-xs text-slate-500">Live since 2h ago</p>
                    </div>
                    <div className="font-medium text-sm text-emerald-400">
                      {Math.floor(Math.random() * 500) + 100} CCU
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

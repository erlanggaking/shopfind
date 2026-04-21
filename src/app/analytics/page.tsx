"use client";

import { BarChart3, TrendingUp, DollarSign, Clock, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const ANALYTICS_DATA = [
  { id: 1, name: "Jessica Official", hours: 42, views: 12500, orders: 450, comm: "Rp 4.5M", trend: "up" },
  { id: 2, name: "Fashion House BDO", hours: 38, views: 9800, orders: 310, comm: "Rp 3.1M", trend: "up" },
  { id: 3, name: "Gadget Tech Store", hours: 55, views: 45000, orders: 1200, comm: "Rp 24M", trend: "up" },
  { id: 4, name: "Beauty Care ID", hours: 25, views: 8900, orders: 280, comm: "Rp 2.8M", trend: "down" },
  { id: 5, name: "Sneakers Zone", hours: 15, views: 3200, orders: 85, comm: "Rp 1.2M", trend: "up" },
];

export default function Analytics() {
  return (
    <div className="space-y-6 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reporting & Analytics</h2>
          <p className="text-slate-400 mt-1">Evaluasi performa streamer dan pendapatan agensi minggu ini.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6">
        <Card className="bg-slate-900 border-slate-800 border-t-4 border-t-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Total Komisi (Minggu ini)</CardTitle>
            <DollarSign className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-400">Rp 35.6M</div>
            <p className="text-xs text-slate-400 mt-1">
              +12.5% dari minggu lalu
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Total Jam Live</CardTitle>
            <Clock className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">175 Jam</div>
            <p className="text-xs text-slate-400 mt-1">
              Rata-rata 35 jam/streamer
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Total Konversi</CardTitle>
            <TrendingUp className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">2,325 Pesanan</div>
            <p className="text-xs text-slate-400 mt-1">
              Conversion rate: 2.8%
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Total Penonton</CardTitle>
            <Users className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">79,400 Total Viewers</div>
            <p className="text-xs text-slate-400 mt-1">
              Akumulasi sesi live
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-7 mt-8">
        <Card className="col-span-4 bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-200">Master View: List Streamer</CardTitle>
            <CardDescription className="text-slate-400">Ringkasan status operasional seluruh akun</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="rounded-md border border-slate-800 overflow-hidden">
                <Table>
                  <TableHeader className="bg-slate-950">
                    <TableRow className="border-slate-800 hover:bg-slate-950">
                      <TableHead className="text-slate-300">Nama Streamer</TableHead>
                      <TableHead className="text-slate-300 text-right">Jam Live</TableHead>
                      <TableHead className="text-slate-300 text-right">Pesanan</TableHead>
                      <TableHead className="text-slate-300 text-right">Estimasi Komisi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ANALYTICS_DATA.map((row) => (
                      <TableRow key={row.id} className="border-slate-800 hover:bg-slate-800/50 cursor-pointer transition-colors">
                        <TableCell className="font-medium text-white flex items-center gap-2">
                           <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs">
                             {row.name.substring(0,1)}
                           </div>
                           {row.name}
                        </TableCell>
                        <TableCell className="text-right text-slate-300">{row.hours}h</TableCell>
                        <TableCell className="text-right text-slate-300">{row.orders}</TableCell>
                        <TableCell className="text-right font-medium text-emerald-400">
                           <div className="flex items-center justify-end gap-2">
                              {row.trend === 'up' ? <TrendingUp className="w-3 h-3 text-emerald-500" /> : <TrendingUp className="w-3 h-3 text-red-500 rotate-180" />}
                              {row.comm}
                           </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
             </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-200 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-orange-500" />
              Detail View & Trends
            </CardTitle>
            <CardDescription className="text-slate-400">Pilih streamer di tabel untuk melihat detail performa</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-slate-800 rounded-lg bg-slate-950/50 p-6 space-y-4">
               {/* Dummy Chart Placeholder */}
               <div className="flex items-end gap-2 h-32 w-full justify-center px-4">
                  {[40, 20, 60, 80, 50, 90, 70].map((h, i) => (
                    <div key={i} className="w-8 bg-orange-500/50 hover:bg-orange-500 transition-colors rounded-t-sm" style={{ height: `${h}%` }}></div>
                  ))}
               </div>
               <div className="text-center">
                 <p className="text-slate-300 font-medium">Tren Penjualan (7 Hari Terakhir)</p>
                 <p className="text-slate-500 text-xs mt-1">Grafik interaktif akan muncul saat data dipilih</p>
               </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-800">
              <h4 className="text-sm font-medium text-slate-200 mb-3">Produk Konversi Tertinggi</h4>
              <div className="space-y-2">
                 <div className="flex justify-between items-center bg-slate-950 p-2 rounded text-sm">
                    <span className="text-slate-300 truncate w-48">Kaos Distro Oversize...</span>
                    <Badge variant="outline" className="text-emerald-400 border-emerald-500/20 bg-emerald-500/10">142 terjual</Badge>
                 </div>
                 <div className="flex justify-between items-center bg-slate-950 p-2 rounded text-sm">
                    <span className="text-slate-300 truncate w-48">Sepatu Sneakers Putih...</span>
                    <Badge variant="outline" className="text-emerald-400 border-emerald-500/20 bg-emerald-500/10">89 terjual</Badge>
                 </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}

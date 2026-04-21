import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link2, Unlink } from "lucide-react";

const CONNECTED_ACCOUNTS = [
  { id: 1, name: "Jessica Official Shop", platform: "Shopee", status: "Active", linkDate: "12 Oct 2026" },
  { id: 2, name: "Fashion House BDO", platform: "Shopee", status: "Active", linkDate: "15 Oct 2026" },
  { id: 3, name: "Gadget Tech Store", platform: "Shopee", status: "Active", linkDate: "20 Oct 2026" },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Shopfind Settings</h2>
        <p className="text-slate-400 mt-1">Kelola otorisasi akun Shopee dan pengaturan agensi Anda (Multi-Account Binding).</p>
      </div>

      <div className="grid gap-6 mt-8">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-200">Connected Accounts (MCN Binding)</CardTitle>
            <CardDescription className="text-slate-400">
              Otorisasi OAuth 2.0 diperlukan untuk memberikan kontrol Remote Livestream kepada Shopfind.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                 <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <h4 className="font-semibold text-slate-200">Tambah Akun Streamer Baru</h4>
                      <p className="text-sm text-slate-500 mt-1">Anda akan diarahkan ke halaman login Shopee Open API untuk memberikan izin.</p>
                    </div>
                    <Button className="bg-[#ee4d2d] hover:bg-[#d73f21] text-white whitespace-nowrap px-6">
                       <Link2 className="w-4 h-4 mr-2" /> Connect Shopee Account
                    </Button>
                 </div>
              </div>

              <div className="pt-4">
                <h4 className="text-sm font-medium text-slate-300 mb-3">Akun Terhubung ({CONNECTED_ACCOUNTS.length}/50 Kuota)</h4>
                <div className="space-y-3">
                  {CONNECTED_ACCOUNTS.map((acc) => (
                    <div key={acc.id} className="flex flex-col sm:flex-row items-center justify-between p-3 rounded-lg border border-slate-800 bg-slate-900/50">
                       <div className="flex items-center gap-3 w-full sm:w-auto">
                         <div className="w-10 h-10 bg-[#ee4d2d]/10 rounded flex items-center justify-center text-[#ee4d2d] border border-[#ee4d2d]/20">
                            <strong>S</strong>
                         </div>
                         <div>
                           <p className="font-medium text-slate-200 leading-tight">{acc.name}</p>
                           <p className="text-xs text-slate-500 mt-0.5">Tautkan pada: {acc.linkDate}</p>
                         </div>
                       </div>
                       <div className="flex items-center gap-4 mt-3 sm:mt-0 w-full sm:w-auto justify-end">
                         <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/10">Connected</Badge>
                         <Button variant="ghost" size="icon" className="text-slate-500 hover:text-red-400 hover:bg-red-500/10">
                            <Unlink className="w-4 h-4" />
                         </Button>
                       </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

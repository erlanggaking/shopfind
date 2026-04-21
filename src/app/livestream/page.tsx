"use client";

import { useState, useEffect } from "react";
import { Play, Square, Users, Clock, Pin, RadioTower, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/lib/supabase";
import { useStreamerStore, type Streamer } from "@/store/useStreamerStore";

export default function LivestreamManager() {
  const streamers = useStreamerStore((state) => state.streamers);
  const [selectedStreamer, setSelectedStreamer] = useState<Streamer | null>(null);
  const [injectedProducts, setInjectedProducts] = useState<any[]>([]);
  
  // Interactive Drawer States
  const [pinnedItemId, setPinnedItemId] = useState<string | null>(null);
  const [isAutoPinEnabled, setIsAutoPinEnabled] = useState(false);
  const [pinInterval, setPinInterval] = useState(60);

  const fetchInjected = async () => {
    const { data } = await supabase.from('agency_collection').select('*').order('created_at', { ascending: false });
    if (data) {
      setInjectedProducts(data);
      if (data.length > 0 && !pinnedItemId) {
        setPinnedItemId(data[0].id);
      }
    }
  };

  useEffect(() => {
    fetchInjected();

    // 🚀 SUPABASE WEBSOCKET BROADCAST: Triggered by Bulk Inject Queue
    const broadcastChannel = supabase
      .channel('app-events')
      .on('broadcast', { event: 'mock-inject' }, (payload) => {
         // Saat queue Bulk Inject melempar event ini, kita refresh keranjangnya
         // Hal ini memberikan ilusi "push" secara seketika masuk ke stream.
         fetchInjected();
      })
      .subscribe();

    // 🚀 SUPABASE WEBSOCKET: Auto sync keranjang jika ada yang menyimpan koleksi baru
    const channel = supabase
      .channel('db-changes-livestream')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'agency_collection' }, (payload) => {
         fetchInjected();
      })
      .subscribe();

    return () => {
       supabase.removeChannel(channel);
       supabase.removeChannel(broadcastChannel);
    };
  }, []);

  // Auto Pin Effect (Rotates pinned product every X seconds)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoPinEnabled && injectedProducts.length > 0 && selectedStreamer?.isLive) {
      const demoSpeedMultiplier = 100; // Simulated speed fast-forward
      interval = setInterval(() => {
        setPinnedItemId(current => {
          const currentIndex = injectedProducts.findIndex(p => p.id === current);
          const nextIndex = (currentIndex + 1) % injectedProducts.length;
          return injectedProducts[nextIndex].id;
        });
      }, pinInterval * demoSpeedMultiplier); 
    }
    return () => clearInterval(interval);
  }, [isAutoPinEnabled, pinInterval, injectedProducts, selectedStreamer]);

  // Handler for actions
  const handleRemoveFromCart = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setInjectedProducts(prev => {
      const updated = prev.filter(p => p.id !== id);
      if (pinnedItemId === id && updated.length > 0) {
        setPinnedItemId(updated[0].id);
      }
      return updated;
    });
  };

  const handleManualPin = (id: string) => {
    setPinnedItemId(id);
    if (isAutoPinEnabled) setIsAutoPinEnabled(false);
  };

  return (
    <div className="space-y-6 relative pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Livestream Command Center</h2>
          <p className="text-slate-400 mt-1">Pantau dan kendalikan seluruh akun streamer dari satu tempat (Zustand Global State).</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {streamers.map((streamer) => (
          <Drawer key={streamer.id}>
            <DrawerTrigger asChild>
              <Card 
                className={`bg-slate-900 border-slate-800 cursor-pointer transition-all hover:bg-slate-800/80 ${streamer.isLive ? 'border-orange-500/30' : 'opacity-80'}`}
                onClick={() => setSelectedStreamer(streamer)}
              >
                <CardContent className="p-4 flex flex-col items-center text-center relative">
                  {streamer.isLive && (
                    <div className="absolute top-3 right-3 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </div>
                  )}
                  <Avatar className="w-16 h-16 border-2 border-slate-800 mb-3">
                    <AvatarImage src={streamer.avatar} />
                    <AvatarFallback>{streamer.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <h3 className="text-sm font-medium text-slate-200 line-clamp-1 h-5">{streamer.name}</h3>
                  
                  {streamer.isLive ? (
                    <div className="mt-4 w-full flex justify-between text-xs border-t border-slate-800 pt-3">
                       <div className="flex items-center text-emerald-400">
                         <Users className="w-3 h-3 mr-1" />
                         {streamer.ccu.toLocaleString()}
                       </div>
                       <div className="flex items-center text-slate-400">
                         <Clock className="w-3 h-3 mr-1" />
                         {streamer.duration.split(":")[0]}h {streamer.duration.split(":")[1]}m
                       </div>
                    </div>
                  ) : (
                    <div className="mt-4 w-full text-xs text-slate-500 border-t border-slate-800 pt-3 flex justify-center items-center">
                       <RadioTower className="w-3 h-3 mr-1" /> Offline
                    </div>
                  )}

                  {streamer.isLive && (
                    <div className="absolute -left-2 top-8 bg-slate-950 p-1 rounded-r border border-l-0 border-slate-800">
                       <Pin className="w-3 h-3 text-orange-500" />
                    </div>
                  )}
                </CardContent>
              </Card>
            </DrawerTrigger>
            
            <DrawerContent className="bg-slate-950 border-slate-800 text-slate-200">
              <div className="mx-auto w-full max-w-4xl p-6">
                <DrawerHeader className="px-0 pt-0 pb-4 border-b border-slate-800 flex flex-col md:flex-row md:items-start md:justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16 border border-slate-700">
                      <AvatarImage src={selectedStreamer?.avatar} />
                    </Avatar>
                    <div className="text-left">
                      <DrawerTitle className="text-2xl text-white">{selectedStreamer?.name}</DrawerTitle>
                      <DrawerDescription className="flex items-center gap-2 mt-1">
                        {selectedStreamer?.isLive ? (
                          <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                            🔴 LIVE NOW
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-slate-800 text-slate-400 border-slate-700">
                            ⚫ OFFLINE
                          </Badge>
                        )}
                        <span>Master ID: {selectedStreamer?.id}92837482</span>
                      </DrawerDescription>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 flex gap-3">
                    {selectedStreamer?.isLive ? (
                      <Button variant="destructive" className="bg-red-600 hover:bg-red-700 shadow-lg shadow-red-500/20">
                        <Square className="w-4 h-4 mr-2" /> End Session
                      </Button>
                    ) : (
                      <Button className="bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20">
                        <Play className="w-4 h-4 mr-2" /> Start Live
                      </Button>
                    )}
                  </div>
                </DrawerHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  {/* Pinned Items / Bag Section */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg flex items-center">
                      <ShoppingBagIcon className="w-5 h-5 mr-2 text-orange-400" />
                      Keranjang Streamer
                    </h4>
                    <Card className="bg-slate-900 border-slate-800">
                      <CardContent className="p-0">
                         {selectedStreamer?.isLive ? (
                           <div className="divide-y divide-slate-800 max-h-[300px] overflow-y-auto">
                             {injectedProducts.length > 0 ? injectedProducts.map((item, index) => {
                               const isPinned = pinnedItemId === item.id;
                               return (
                               <div key={item.id} className={`p-3 flex items-center gap-3 transition-colors ${isPinned ? 'bg-orange-500/5' : 'hover:bg-slate-800/30'}`}>
                                 <div className="w-12 h-12 bg-slate-800 rounded flex-shrink-0 relative overflow-hidden">
                                   <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                                   <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center font-bold text-white text-xs">P{index + 1}</div>
                                 </div>
                                 <div className="flex-1 min-w-0 pr-2">
                                   <p className={`text-sm font-medium truncate ${isPinned ? 'text-orange-400' : 'text-slate-200'}`} title={item.product_name}>
                                     {item.product_name}
                                   </p>
                                   <p className="text-xs text-emerald-400">Rp {item.price_discount?.toLocaleString('id-ID')}</p>
                                 </div>
                                 <div className="flex items-center gap-1">
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      onClick={() => handleManualPin(item.id)}
                                      className={`text-xs h-7 px-2 border-slate-700 transition-colors ${isPinned ? 'border-orange-500 text-orange-400 bg-orange-500/10' : 'text-slate-400 hover:text-white'}`}
                                    >
                                      {isPinned ? 'Pinned' : 'Pin'}
                                    </Button>
                                    <Button 
                                      size="icon" 
                                      variant="ghost" 
                                      className="h-7 w-7 text-slate-500 hover:text-red-400 hover:bg-slate-800 disabled:opacity-50"
                                      onClick={(e) => handleRemoveFromCart(item.id, e)}
                                      title="Hapus dari Keranjang Streamer"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                 </div>
                               </div>
                               );
                             }) : (
                               <div className="p-6 text-center text-sm text-slate-500">
                                  Belum ada produk yang di-inject. Silakan inject dari menu Koleksi terlebih dahulu.
                               </div>
                             )}
                           </div>
                         ) : (
                           <div className="p-8 text-center text-slate-500 text-sm">
                             Streamer sedang offline. Keranjang tidak tersedia.
                           </div>
                         )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Auto Pin Manager */}
                  <div className="space-y-4">
                     <h4 className="font-semibold text-lg flex items-center">
                      <Pin className="w-5 h-5 mr-2 text-blue-400" />
                      Auto-Pin Manager
                    </h4>
                    <Card className="bg-slate-900 border-slate-800">
                      <CardContent className="p-5 space-y-6">
                         <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <p className="font-medium text-slate-200">Aktifkan Auto-Pin</p>
                              <p className="text-xs text-slate-400">Sistem akan otomatis merotasi produk di keranjang (Simulation Speed: Fast)</p>
                            </div>
                            <Switch 
                              checked={isAutoPinEnabled} 
                              onCheckedChange={setIsAutoPinEnabled}
                              disabled={injectedProducts.length <= 1 || !selectedStreamer?.isLive}
                            />
                         </div>

                         <div className="space-y-3">
                            <p className="text-sm text-slate-300">Interval Rotasi (detik)</p>
                            <div className="flex gap-2">
                              {[60, 180, 300, 600].map((sec) => (
                                <Button 
                                  key={sec} 
                                  variant="outline" 
                                  onClick={() => setPinInterval(sec)}
                                  disabled={!isAutoPinEnabled}
                                  className={`flex-1 border-slate-700 transition-colors ${pinInterval === sec && isAutoPinEnabled ? 'bg-slate-800 border-blue-500 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.2)]' : ''}`}
                                >
                                  {sec}s
                                </Button>
                              ))}
                            </div>
                         </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <DrawerFooter className="px-0 pt-6">
                  <DrawerClose asChild>
                    <Button variant="outline" className="border-slate-800 hover:bg-slate-800 text-slate-300">Tutup Panel</Button>
                  </DrawerClose>
                </DrawerFooter>
              </div>
            </DrawerContent>
          </Drawer>
        ))}
      </div>
    </div>
  );
}

// Inline Icon to keep it fast
function ShoppingBagIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  )
}

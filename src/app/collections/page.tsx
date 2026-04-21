"use client";

import { useEffect, useState } from "react";
import { Search, Grid, List, Link as LinkIcon, Trash2, ExternalLink, Plus, Loader2, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
import { useStreamerStore } from "@/store/useStreamerStore";

type AgencyCollection = {
  id: string;
  product_name: string;
  image_url: string;
  price_discount: number;
  commission_estimate: number;
  affiliate_link: string;
  created_at: string;
};

type QueueItem = { id: number, name: string, status: 'idle'|'processing'|'done', selected: boolean };

export default function Collections() {
  const [collections, setCollections] = useState<AgencyCollection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  
  const streamers = useStreamerStore((state) => state.streamers);
  const liveStreamers = streamers.filter(s => s.isLive);

  // Modal and Queue states
  const [isInjectModalOpen, setIsInjectModalOpen] = useState(false);
  const [injectionQueue, setInjectionQueue] = useState<QueueItem[]>([]);
  const [isInjecting, setIsInjecting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const fetchCollections = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('agency_collection')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setCollections(data);
    }
    setIsLoading(false);
  };

  // Broadcast channel for Cross-Tab Mock Events
  const [broadcastChannel, setBroadcastChannel] = useState<any>(null);

  useEffect(() => {
    fetchCollections();
    
    // Subscribe broadcast for P2P cross-tab events
    const bChannel = supabase.channel('app-events');
    bChannel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        setBroadcastChannel(bChannel);
      }
    });

    // 🚀 SUPABASE WEBSOCKET: Realtime sync across tabs/sources
    const dbChannel = supabase
      .channel('db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'agency_collection' }, (payload) => {
         fetchCollections();
      })
      .subscribe();

    return () => {
       supabase.removeChannel(dbChannel);
       supabase.removeChannel(bChannel);
    };
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const { error } = await supabase.from('agency_collection').delete().eq('id', id);
    if (!error) {
       setCollections(collections.filter((item) => item.id !== id));
       if (selectedItems.has(id)) {
           const newSet = new Set(selectedItems);
           newSet.delete(id);
           setSelectedItems(newSet);
       }
    }
  };

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedItems);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedItems(newSet);
  };

  const openModal = () => {
     // Siapkan antrian dengan status 'idle' dan selected default true
     const initialQueue = liveStreamers.map(s => ({ id: s.id, name: s.name, status: 'idle' as const, selected: true }));
     setInjectionQueue(initialQueue);
     setIsCompleted(false);
     setIsInjectModalOpen(true);
  };

  const toggleTargetStreamer = (id: number) => {
     if (isInjecting || isCompleted) return; // Kunci jika sedang/sudah proses
     setInjectionQueue(prev => prev.map(q => q.id === id ? { ...q, selected: !q.selected } : q));
  };

  const toggleAllStreamers = (checked: boolean) => {
     if (isInjecting || isCompleted) return;
     setInjectionQueue(prev => prev.map(q => ({ ...q, selected: checked })));
  };

  const startQueueInjection = async () => {
    setIsInjecting(true);
    let queue = [...injectionQueue];
    
    // Hanya proses yang dicentang
    const targetsToProcess = queue.filter(q => q.selected);

    for (let i = 0; i < queue.length; i++) {
        if (!queue[i].selected) continue; // Skip yang tidak dicentang

        // update status to processing
        queue[i].status = 'processing';
        setInjectionQueue([...queue]);
        
        // Simulasikan delay network per API call
        await new Promise(res => setTimeout(res, 800));

        // Send Realtime Broadcast to Livestream Tab so they sync Instantly
        if (broadcastChannel) {
           broadcastChannel.send({
             type: 'broadcast',
             event: 'mock-inject',
             payload: { streamerId: queue[i].id }
           });
        }

        // update status to done
        queue[i].status = 'done';
        setInjectionQueue([...queue]);
    }

    // Finished
    setIsInjecting(false);
    setIsCompleted(true);
    
    setTimeout(() => {
       setIsInjectModalOpen(false);
       setSelectedItems(new Set());
    }, 1500);
  };

  // Kalkulasi jumlah target yang aktif dipilih
  const selectedQueueCount = injectionQueue.filter(q => q.selected).length;

  return (
    <div className="space-y-6 relative pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Koleksi Agensi</h2>
          <p className="text-slate-400 mt-1">Daftar produk winning yang sudah divalidasi dan siap di-inject ke streamer.</p>
        </div>
      </div>

      <div className="flex gap-4 items-center">
         <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input 
              placeholder="Cari koleksi..." 
              className="pl-9 bg-slate-900 border-slate-800 h-10"
            />
         </div>
         <Button onClick={fetchCollections} variant="outline" className="h-10 border-slate-700 bg-slate-900 text-slate-300 ml-auto flex gap-2">
            Refresh Data 
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
         </Button>
      </div>

      {isLoading && collections.length === 0 ? (
         <div className="p-12 text-center text-slate-500 animate-pulse">Memuat data secara realtime dari Supabase...</div>
      ) : collections.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-slate-800 rounded-lg bg-slate-900/50">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
               <LinkIcon className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Belum Ada Koleksi</h3>
            <p className="text-slate-400 max-w-sm mb-6">
              Koleksi ini otomatis tersinkronisasi (Realtime) jika Anda menyimpan produk dari menu Product Research di perangkat mana pun.
            </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6 animate-in fade-in">
          {collections.map((item) => {
             const isSelected = selectedItems.has(item.id);
             return (
               <Card 
                 key={item.id} 
                 className={`bg-slate-900 border-slate-800 p-3 flex flex-col gap-3 group relative cursor-pointer transition-colors hover:border-slate-700 ${isSelected ? 'border-orange-500/50 bg-orange-500/10' : ''}`}
                 onClick={() => toggleSelect(item.id)}
               >
                  <div className="absolute top-2 right-2 z-10">
                    <Checkbox 
                      checked={isSelected}
                      className={isSelected ? 'bg-orange-500 border-orange-500' : 'border-slate-600'}
                    />
                  </div>
                  <div className="flex gap-3">
                     <img src={item.image_url} alt={item.product_name} className="w-20 h-20 rounded object-cover bg-slate-800" />
                     <div className="flex-1 min-w-0 flex flex-col justify-between pt-1 pr-6">
                       <p className="text-sm font-medium text-slate-200 line-clamp-2" title={item.product_name}>{item.product_name}</p>
                       <div>
                         <p className="text-xs text-slate-500 line-through">Rp {item.price_discount}</p>
                         <p className="text-sm font-bold text-emerald-400">Komisi: Rp {item.commission_estimate?.toLocaleString()}</p>
                       </div>
                     </div>
                  </div>
                  <div className="flex gap-2">
                     <div className="flex-1 border border-slate-700 bg-slate-950 rounded px-3 py-1.5 flex items-center justify-between group-hover:border-slate-600 transition-colors" onClick={(e) => e.stopPropagation()}>
                        <span className="text-xs text-slate-400 truncate w-full pr-2 font-mono">
                          {item.affiliate_link || "https://shp.ee/..."}
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-500 flex-shrink-0 cursor-pointer hover:text-white" />
                     </div>
                     <Button 
                       variant="destructive" 
                       size="icon" 
                       className="h-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 px-2"
                       onClick={(e) => handleDelete(item.id, e)}
                     >
                       <Trash2 className="w-4 h-4" />
                     </Button>
                  </div>
               </Card>
             );
          })}
        </div>
      )}

      {selectedItems.size > 0 && (
        <div className="fixed bottom-8 right-8 z-50 animate-in slide-in-from-bottom-5">
          <Button 
            className="h-14 rounded-full bg-orange-600 hover:bg-orange-700 shadow-xl shadow-orange-600/30 px-6 font-semibold shadow-[0_0_20px_rgba(234,88,12,0.4)] text-base"
            onClick={openModal}
          >
            <Plus className="w-5 h-5 mr-2" />
            Bulk Inject {selectedItems.size} Produk
          </Button>
        </div>
      )}

      {/* BULK INJECT SELECTION & KANBAN / QUEUE DIALOG */}
      <Dialog open={isInjectModalOpen} onOpenChange={(open) => !isInjecting && setIsInjectModalOpen(open)}>
        <DialogContent className="bg-slate-950 border-slate-800 text-slate-200 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Mengeksekusi Bulk Injection</DialogTitle>
            <DialogDescription className="text-slate-400">
              Pilih streamer target. Sistem akan menempatkan {selectedItems.size} produk secara progresif (Anti Rate-Limit).
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-2">
             {!isInjecting && !isCompleted && (
               <div className="flex items-center space-x-2 pb-3 mb-2 border-b border-slate-800">
                  <Checkbox 
                    id="select-all" 
                    checked={selectedQueueCount === injectionQueue.length && injectionQueue.length > 0} 
                    onCheckedChange={(c) => toggleAllStreamers(!!c)}
                    className="border-slate-500 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500" 
                  />
                  <label htmlFor="select-all" className="text-sm font-medium leading-none text-white cursor-pointer">
                    Pilih Semua Streamer Aktif ({selectedQueueCount} terpilih)
                  </label>
               </div>
             )}

             <div className="space-y-3 max-h-60 overflow-y-auto pr-2 pb-2">
                 {injectionQueue.map((target, idx) => (
                   <div 
                     key={target.id} 
                     className={`flex justify-between items-center p-3 border rounded-lg transition-colors ${!target.selected ? 'bg-slate-900 border-slate-800 opacity-60' : 'bg-slate-900 border-slate-700'}`}
                   >
                      <div className="flex items-center gap-3">
                        {(!isInjecting && !isCompleted) && (
                          <Checkbox 
                            id={`target-${target.id}`} 
                            checked={target.selected}
                            onCheckedChange={() => toggleTargetStreamer(target.id)}
                            className="border-slate-600 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                          />
                        )}
                        <label htmlFor={`target-${target.id}`} className="flex flex-col cursor-pointer">
                          <span className="text-sm font-medium text-slate-200">{target.name}</span>
                          <span className="text-xs text-slate-500">Target #{idx + 1}</span>
                        </label>
                      </div>
                      <div>
                        {target.status === 'idle' && (
                          target.selected ? (
                            <span className="text-xs text-slate-500 uppercase px-2 py-1 bg-slate-800 rounded">Menunggu</span>
                          ) : (
                            <span className="text-xs text-slate-600 uppercase px-2 py-1">Diabaikan</span>
                          )
                        )}
                        {target.status === 'processing' && (
                           <div className="flex items-center text-xs text-blue-400 bg-blue-500/10 px-2 py-1 rounded">
                             <Loader2 className="w-3 h-3 mr-1 animate-spin" /> Pushing
                           </div>
                        )}
                        {target.status === 'done' && (
                           <div className="flex items-center text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                             <CheckCircle2 className="w-3 h-3 mr-1" /> Success
                           </div>
                        )}
                      </div>
                   </div>
                 ))}
             </div>
          </div>

          <div className="flex justify-end gap-3 mt-2 border-t border-slate-800 pt-4">
             <Button 
               variant="outline" 
               onClick={() => setIsInjectModalOpen(false)} 
               disabled={isInjecting || isCompleted}
               className="border-slate-800 text-slate-300 bg-transparent hover:bg-slate-900 border hover:text-white"
             >
               Batal
             </Button>
             <Button 
               className="bg-orange-600 hover:bg-orange-700 min-w-32"
               disabled={isInjecting || isCompleted || selectedQueueCount === 0}
               onClick={startQueueInjection}
             >
               {isInjecting ? "Memproses Job..." : isCompleted ? "Selesai Berhasil" : `Inject ke ${selectedQueueCount} Target`}
             </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

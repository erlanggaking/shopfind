import { create } from 'zustand';

export type Streamer = {
  id: number;
  name: string;
  isLive: boolean;
  ccu: number;
  duration: string;
  avatar: string;
};

const INITIAL_STREAMERS: Streamer[] = [
  { id: 1, name: "Jessica Official Shop", isLive: true, ccu: 1250, duration: "02:15:30", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica" },
  { id: 2, name: "Fashion House BDO", isLive: true, ccu: 342, duration: "01:05:10", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bella" },
  { id: 3, name: "Gadget Tech Store", isLive: true, ccu: 4890, duration: "04:30:00", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tech" },
  { id: 4, name: "Beauty Care ID", isLive: false, ccu: 0, duration: "00:00:00", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Beauty" },
  { id: 5, name: "Sneakers Zone", isLive: false, ccu: 0, duration: "00:00:00", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Shoes" },
  { id: 6, name: "Mom & Baby Shop", isLive: true, ccu: 89, duration: "00:15:20", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mom" },
  { id: 7, name: "OOTD Men Outfit", isLive: false, ccu: 0, duration: "00:00:00", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Men" },
  { id: 8, name: "Promo Elektronik", isLive: true, ccu: 2100, duration: "03:45:12", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Promo" },
].sort((a, b) => Number(b.isLive) - Number(a.isLive));

type StreamerStore = {
  streamers: Streamer[];
  setStreamers: (streamers: Streamer[]) => void;
  updateCCU: (id: number, newCCU: number) => void;
};

export const useStreamerStore = create<StreamerStore>((set) => ({
  streamers: INITIAL_STREAMERS,
  setStreamers: (streamers) => set({ streamers }),
  updateCCU: (id, newCCU) =>
    set((state) => ({
      streamers: state.streamers.map((s) => (s.id === id ? { ...s, ccu: newCCU } : s)),
    })),
}));

import { create } from 'zustand';

export type Streamer = {
  id: number;
  name: string;
  isLive: boolean;
  ccu: number;
  duration: string;
  avatar: string;
  studio: string;
};

const generateDummyStreamers = () => {
  const studios = ["Studio Alpha (Fashion)", "Studio Beta (Tech)", "Studio Gamma (Beauty)", "Studio Delta (F&B)", "Studio Epsilon (Lifestyle)"];
  const names = ["Jessica", "Bella", "Tech", "Beauty", "Shoes", "Mom", "Men", "Promo", "Gadget", "Home", "Kitchen", "Sports", "Kids", "Toys", "Pets"];
  
  const streamers: Streamer[] = [];
  let id = 1;

  studios.forEach(studio => {
    // Generate 50 streamers per studio
    for (let i = 0; i < 50; i++) {
      const isLive = Math.random() > 0.3; // 70% chance to be live
      const seedName = names[Math.floor(Math.random() * names.length)];
      
      streamers.push({
        id: id++,
        name: `${seedName} Host ${i+1}`,
        isLive,
        ccu: isLive ? Math.floor(Math.random() * 5000) : 0,
        duration: isLive ? `0${Math.floor(Math.random() * 5)}:${Math.floor(Math.random() * 50) + 10}:00` : "00:00:00",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${studio.replace(/\s+/g, '')}${id}`,
        studio: studio
      });
    }
  });

  return streamers.sort((a, b) => Number(b.isLive) - Number(a.isLive));
};

const INITIAL_STREAMERS: Streamer[] = generateDummyStreamers();

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

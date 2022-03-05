import create from 'zustand';

type Store = {
  region: any;
  setRegion: (region: any) => void;
};

export const useStore = create<Store>((set) => ({
  region: null,
  setRegion: (region) => set((state) => ({ region })),
}));

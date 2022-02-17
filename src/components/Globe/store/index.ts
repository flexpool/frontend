import create from 'zustand';

type Store = {
  region: any;
  setRegion: (region: any) => void;
  mouse: any;
  setMouse: (mouse: any) => void;
};

export const useStore = create<Store>((set) => ({
  region: null,
  setRegion: (region) => set((state) => ({ region })),
  mouse: { x: 0, y: 0 },
  setMouse: (mouse) => set((state) => ({ mouse })),
}));

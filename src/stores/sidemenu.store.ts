import { create } from "zustand";

type Store = {
  open: boolean;
  updateMode: boolean;
  show: () => void;
  hide: () => void;
};

const useStore = create<Store>()((set) => ({
  open: false,
  updateMode: false,
  show: () => set({ open: true }),
  hide: () => set({ open: false }),
}));

export default useStore;

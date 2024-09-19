import { create } from "zustand";
import { Map } from "ol";

type Store = {
  mapRef: React.RefObject<HTMLDivElement>;
  map: Map | null;
  setMapRef: (mapRef) => void;
};

const useMapStore = create<Store>((set, get) => {
  return {
    mapRef: null,
    map: null,

    setMapRef: (mapRef) => {
      set({ mapRef: mapRef });
    },
  };
});

export default useMapStore;

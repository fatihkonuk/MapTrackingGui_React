import { create } from "zustand";
import { IFeature } from "../models/types";
import { FeatureModel, MapModel } from "../models";

type Store = {
  feature: IFeature;
  featureList: IFeature[];
  setFeature: (feature) => void;
  getFeatureById: (id) => IFeature;
  setFeatureList: (featureList) => void;
  fetchFeatures: () => void;
};

const useFeatureStore = create<Store>((set, get) => {
  return {
    feature: {
      id: 0,
      name: "",
      wkt: "",
      userId: 0,
    },
    featureList: [],

    setFeature: (feature) => set((state) => (state.feature = feature)),
    getFeatureById: (id) => {
      const { featureList } = get();
      return featureList.find((e) => e.id == id);
    },
    setFeatureList: (featureList) =>
      set((state) => (state.featureList = featureList)),

    fetchFeatures: async () => {
      try {
        const result = await FeatureModel.getAll();
        set({ featureList: result.data });
        MapModel.featureList = result.data;
      } catch (error) {
        console.log(error);
      }
    },
  };
});

export default useFeatureStore;

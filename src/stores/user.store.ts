import { create } from "zustand";
import { IUser } from "../models/types";
import { UserModel } from "../models";

type Store = {
  user: IUser;
  userList: IUser[];
  setUser: (user: IUser) => void;
  getUserById: (id: number) => IUser;
  setUserList: (featureList) => void;
  fetchUsers: () => void;
};

const useFeatureStore = create<Store>((set, get) => {
  return {
    user: {
      id: 0,
      fullname: "",
      username: "",
      role: "",
    },
    userList: [],

    setUser: (user: IUser) => set({ user: user }),
    getUserById(id) {
      const { userList } = get();
      return userList.find((e) => e.id == id);
    },
    setUserList: (userList) => set((state) => (state.userList = userList)),

    async fetchUsers() {
      try {
        const result = await UserModel.getAll();
        set({ userList: result.data });
      } catch (error) {
        console.log(error);
      }
    },
  };
});

export default useFeatureStore;

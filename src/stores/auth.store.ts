import { create } from "zustand";
import IAuth from "../models/types/auth.type";
import JwtService from "../services/jwt.service";

type Store = {
  user: IAuth;
  setUser: (auth: IAuth) => void;
  getUser: () => void;
  setAuth: (auth: IAuth) => void;
  purgeAuth: () => void;
  init: () => void;
};

const useAuthStore = create<Store>()((set, get) => ({
  user: null,
  setUser: (auth: IAuth) => set({ user: auth }),
  getUser: () => get().user,
  setAuth: (auth: IAuth) => {
    JwtService.setAuth(auth);
    set({ user: auth });
  },
  purgeAuth: () => {
    JwtService.removeAuth();
    set({ user: null });
  },
  init: () => {
    const { setAuth, purgeAuth } = get();
    const auth = JwtService.getAuth();
    if (auth) {
      setAuth(auth);
    } else {
      purgeAuth();
    }
  },
}));

export default useAuthStore;

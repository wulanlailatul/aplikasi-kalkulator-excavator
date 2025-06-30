import { create } from "zustand";

export interface LoginStore {
  email: string;
  password: string;
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
}

export const usehandleLogin = create<LoginStore>((set)=>({
    email: "",
    password: "",
    isLoggedIn: false,
    setIsLoggedIn: (isLoggedIn: boolean) => set({ isLoggedIn }),
    setEmail: (value: string) => set({ email:value }),
    setPassword: (value: string) => set({ password:value }),
})) 
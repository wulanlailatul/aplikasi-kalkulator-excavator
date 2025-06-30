import { create } from "zustand"

interface StoreState {
  summary: boolean
  setSummary: (value: boolean) => void
}

export const useStoreState = create<StoreState>((set) => ({
  summary: false,
  setSummary: (value) => set({ summary: value }),
}))

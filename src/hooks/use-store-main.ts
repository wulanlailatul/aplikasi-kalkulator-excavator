import { create } from "zustand"

export interface TypeStore {
  type: string | null
  setType: (type: string | null) => void

  bucket: number | null
  setBucket: (bucket: number | string | null) => void // menerima number atau string dari input manual

  method: string | null
  setMethod: (method: string | null) => void

  resetMain: () => void
}

export const useStoreMain = create<TypeStore>((set) => ({
  type: null,
  setType: (value) => set({ type: value }),

  bucket: null,
  setBucket: (value) => {
    // Jika string kosong, kosongkan state
    if (value === "" || value === null) {
      set({ bucket: null })
      return
    }

    // Ubah string ke number, hanya jika valid
    const parsed = typeof value === "string" ? parseFloat(value) : value
    set({ bucket: isNaN(parsed) ? null : parsed })
  },

  method: null,
  setMethod: (value) => set({ method: value }),

  resetMain: () =>
    set({
      type: null,
      bucket: null,
      method: null,
    }),
}))

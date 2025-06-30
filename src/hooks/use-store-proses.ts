import {create} from 'zustand';

type LogEntry = {
  category: string;
  item: string;
  durasi: number;
  fillFactor: number;
};
type ProductionResult = {
  totalProduksi: number;
  totalDurasiDetik: number;
  totalDurasiMenit: string;
  cycleTimeRata2: string;
  efisiensi: string;
  totalPrimary: number;
  totalSecondary: number;
  dumpCount: number;
  produksiPerJam: number;
  avgFill: number;
};

type Log = {
  logs: LogEntry[];
  productionResult: ProductionResult | null;
  setLogs: (logs: LogEntry[] | ((prev: LogEntry[]) => LogEntry[])) => void;
  setProductionResult: (result: ProductionResult) => void;
};

export const useStoreProcess = create<Log>((set) => ({
  logs: [],
  productionResult: null,
  setLogs: (logs) =>
    typeof logs === 'function' ? set((state) => ({ logs: logs(state.logs) })) : set({ logs }),
   setProductionResult: (productionResult) => set({ productionResult }),
}));

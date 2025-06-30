// 📁 screen/(tabs)/summary/_hooks/useSummaryLogic.ts
import { useStoreProcess } from "@/hooks/use-store-proses";
import { useStoreMain } from "@/hooks/use-store-main";
import { hitungProduktivitas } from "../../main/_hooks/logika";

export const useSummaryLogic = () => {
  const { logs } = useStoreProcess();
  const { type, bucket, method } = useStoreMain();

  const totalDurasi = logs.reduce((acc, cur) => acc + Number(cur.durasi || 0), 0);
  const totalFillFactor = logs.reduce((acc, cur) => acc + Number(cur.fillFactor || 0), 0);
  const rataFillFactor = logs.length > 0 ? totalFillFactor / logs.length : 0;

  const durasiPrimary = logs
    .filter((l) => l.category?.toLowerCase().includes("primary"))
    .reduce((acc, cur) => acc + Number(cur.durasi || 0), 0);

  const durasiSecondary = logs
    .filter((l) => l.category?.toLowerCase().includes("secondary"))
    .reduce((acc, cur) => acc + Number(cur.durasi || 0), 0);

  const efisiensi = totalDurasi > 0 ? (durasiPrimary / totalDurasi) * 100 : 0;
  const cycleTime = logs.length > 0 ? totalDurasi / logs.length : 0;

  const produksi = hitungProduktivitas({
    type: type ?? "",
    method: method ?? "",
    bucket: Number(bucket),
    durasi: totalDurasi,
    fillFactor: rataFillFactor,
  });

  const pieData = [
    {
      name: "Primary Work",
      population: durasiPrimary,
      color: "#4285F4",
      legendFontColor: "#000",
      legendFontSize: 10,
    },
    {
      name: "Secondary Work",
      population: durasiSecondary,
      color: "#FBBC05",
      legendFontColor: "#000",
      legendFontSize: 10,
    },
  ];

  return {
    logs,
    type,
    bucket,
    method,
    durasiPrimary,
    durasiSecondary,
    efisiensi,
    cycleTime,
    produksi,
    pieData,
    totalDurasi,
    rataFillFactor,
  };
};

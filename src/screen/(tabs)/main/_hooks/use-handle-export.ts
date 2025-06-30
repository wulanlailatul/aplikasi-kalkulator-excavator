import { useStoreMain } from "@/hooks/use-store-main"
import { useStoreProcess } from "@/hooks/use-store-proses"
import { exportToPDF } from "./exportToPDF"
import { exportToExcel } from "./exportToExcel"
import { Alert } from "react-native"




const useHandleExport = () => {
const { type, bucket, method } = useStoreMain()
  const { logs } = useStoreProcess()

  const totalDurasi = logs.reduce((acc, cur) => acc + Number(cur.durasi || 0), 0)
  const durasiPrimary = logs
    .filter((l) => l.category?.toLowerCase().includes("primary"))
    .reduce((acc, cur) => acc + Number(cur.durasi || 0), 0)
  const durasiSecondary = totalDurasi - durasiPrimary

  const efisiensi = totalDurasi > 0 ? (durasiPrimary / totalDurasi) * 100 : 0
  const cycleTime = logs.length > 0 ? totalDurasi / logs.length : 0
  const rataFillFactor =
    logs.length > 0
      ? logs.reduce((acc, cur) => acc + Number(cur.fillFactor || 0), 0) / logs.length
      : 0
  const produksi =
    cycleTime > 0 ? (Number(bucket) * rataFillFactor * 3600) / cycleTime : 0

  const handleExportPDF = async () => {
    try {
      await exportToPDF({
        alat: type ?? "Tidak diset",
        metode: method ?? "Tidak diset",
        bucket: bucket ?? "Tidak diset",
        efisiensi: efisiensi.toFixed(1) + "%",
        produksi: produksi.toFixed(2) + " m³/jam",
        cycleTime: cycleTime.toFixed(1) + " detik",
        logs,
      })
    } catch (error) {
      console.error("❌ Export PDF Error:", error)
      Alert.alert("Gagal Export PDF", String(error))
    }
  }

  const handleExportExcel = async () => {
    try {
      await exportToExcel({
        alat: type ?? "Tidak diset",
        metode: method ?? "Tidak diset",
        bucket: bucket ?? "Tidak diset",
        efisiensi: efisiensi.toFixed(1) + "%",
        produksi: produksi.toFixed(2) + " m³/jam",
        cycleTime: cycleTime.toFixed(1) + " detik",
        logs,
      })
    } catch (error) {
      Alert.alert("Gagal Export Excel", String(error))
    }
  }
 return{handleExportExcel,handleExportPDF,durasiPrimary,durasiSecondary,efisiensi,cycleTime,produksi,logs}
}

export default useHandleExport
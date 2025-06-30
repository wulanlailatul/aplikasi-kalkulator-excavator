
// hooks/use-process-logic.ts
import { useEffect, useState } from "react"
import { Alert } from "react-native"
import { useStoreMain } from "@/hooks/use-store-main"
import { useStoreProcess } from "@/hooks/use-store-proses"
import { useStoreState } from "@/hooks/use-store-state"


type LogEntry = {
  category: string
  item: string
  durasi: number
  fillFactor: number
}

type ProductionResult = {
  totalProduksi: number
  totalDurasiDetik: number
  totalDurasiMenit: string
  cycleTimeRata2: string
  efisiensi: string
  totalPrimary: number
  totalSecondary: number
  dumpCount: number
  produksiPerJam: number
  avgFill: number
}

export const useProcessLogic = () => {
  const { bucket: kapasitasBucket, method, type } = useStoreMain()
  const { logs, setLogs, setProductionResult } = useStoreProcess()
  const { setSummary } = useStoreState()

  const [currentFill, setCurrentFill] = useState<number>(1)
  const [lastTime, setLastTime] = useState<number | null>(null)
  const [elapsedTime, setElapsedTime] = useState<number>(0)
  const [lastLabel, setLastLabel] = useState<{ category: string; item: string } | null>(null)
  const [activeButton, setActiveButton] = useState<string | null>(null)
  const [showSummary, setShowSummary] = useState(false)
  const [productionResult, setLocalProductionResult] = useState<ProductionResult | null>(null)

  const primaryWork: string[] = ["Dig to Load", "Swing Loaded", "Dump", "Swing Empty"]
  const secondaryWork: string[] = ["Dig to Prepare", "Wait to Dump", "Idle", "Cleaning", "Positioning", "Others"]
  const fillFactors: number[] = [0.7, 0.8, 0.9, 1.0, 1.1, 1.2]

  const isFillFactorActive = () =>
    lastLabel?.item === "Dig to Load" || lastLabel?.item === "Swing Loaded"

  const addStep = (category: string, item: string) => {
    const now = Date.now()
    if (lastTime !== null && lastLabel !== null) {
      const durasi = (now - lastTime) / 1000
      setLogs((prev) => [
        ...prev,
        { category: lastLabel.category, item: lastLabel.item, durasi, fillFactor: currentFill },
      ])
    }
    setLastTime(now)
    setElapsedTime(0)
    setLastLabel({ category, item })
    setActiveButton(item)
    setShowSummary(false)
  }

  const finishSession = () => {
    if (lastTime !== null && lastLabel !== null) {
      const now = Date.now()
      const durasi = (now - lastTime) / 1000
      setLogs((prev) => [
        ...prev,
        { category: lastLabel.category, item: lastLabel.item, durasi, fillFactor: currentFill },
      ])
      setSummary(true)
    }
    setLastTime(null)
    setElapsedTime(0)
    setActiveButton(null)
    setShowSummary(true)

    const result = hitungProduksi(logs)
    setLocalProductionResult(result)
    setProductionResult(result)
  }

  const resetSession = () => {
    Alert.alert("Reset Session", "Apakah Anda yakin ingin mereset semua data?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Reset",
        style: "destructive",
        onPress: () => {
          setLogs([])
          setLastTime(null)
          setElapsedTime(0)
          setLastLabel(null)
          setActiveButton(null)
          setShowSummary(false)
          setCurrentFill(1)
        },
      },
    ])
  }

  useEffect(() => {
    if (lastTime === null) return
    const timer = setInterval(() => {
      const now = Date.now()
      setElapsedTime((now - lastTime) / 1000)
    }, 1000)
    return () => clearInterval(timer)
  }, [lastTime])

  const hitungProduksi = (logs: LogEntry[]): ProductionResult => {
    if (logs.length === 0) {
      return {
        totalProduksi: 0,
        totalDurasiDetik: 0,
        totalDurasiMenit: "0.00",
        cycleTimeRata2: "0.00",
        efisiensi: "0.00",
        totalPrimary: 0,
        totalSecondary: 0,
        dumpCount: 0,
        produksiPerJam: 0,
        avgFill: 0,
      }
    }

    const primary = logs.filter((log) => log.category === "Primary Work")
    const secondary = logs.filter((log) => log.category === "Secondary Work")
    const totalDurasiDetik = logs.reduce((sum, log) => sum + log.durasi, 0)
    const totalDurasiMenit = totalDurasiDetik / 60
    const totalPrimary = primary.reduce((sum, log) => sum + log.durasi, 0)
    const totalSecondary = secondary.reduce((sum, log) => sum + log.durasi, 0)
    const dumpCount = primary.filter((log) => log.item === "Dump").length
    const cycleTimeRata2 = dumpCount > 0 ? totalPrimary / dumpCount : 0
    const efficiency = totalDurasiDetik > 0 ? totalPrimary / totalDurasiDetik : 0
    const avgFill = logs.reduce((sum, log) => sum + log.fillFactor, 0) / logs.length
    const produksiPerJam =
      cycleTimeRata2 > 0 ? ((kapasitasBucket ?? 0) * avgFill * 3600 * efficiency) / cycleTimeRata2 : 0

    return {
      totalProduksi: dumpCount,
      totalDurasiDetik,
      totalDurasiMenit: totalDurasiMenit.toFixed(0),
      cycleTimeRata2: cycleTimeRata2.toFixed(0),
      efisiensi: (efficiency * 100).toFixed(0),
      totalPrimary,
      totalSecondary,
      dumpCount,
      produksiPerJam,
      avgFill,
    }
  }

  return {
    logs,
    method,
    type,
    kapasitasBucket,
    fillFactors,
    primaryWork,
    secondaryWork,
    currentFill,
    setCurrentFill,
    lastLabel,
    elapsedTime,
    addStep,
    finishSession,
    resetSession,
    isFillFactorActive,
    activeButton,
    showSummary,
  }
}

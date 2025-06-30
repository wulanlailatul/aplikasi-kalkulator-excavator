import { useState, useEffect } from "react"
import { View, Text, TouchableOpacity, ScrollView, Alert, Button } from "react-native"
import { useNavigation } from "@react-navigation/core"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import type { MainStackParamList } from "../navigator"
import { useStoreMain } from "@/hooks/use-store-main"
import { useStoreProcess } from "@/hooks/use-store-proses"
import { SafeAreaView } from "react-native-safe-area-context"
import { useStoreState } from "./home"


type ProcessProps = NativeStackNavigationProp<MainStackParamList>

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

const Process = () => {
  const navigation = useNavigation<ProcessProps>()
  const { bucket: kapasitasBucket, method, type } = useStoreMain()
  const { logs, setLogs, setProductionResult } = useStoreProcess()
  const [currentFill, setCurrentFill] = useState<number>(1)
  const [lastTime, setLastTime] = useState<number | null>(null)
  const [elapsedTime, setElapsedTime] = useState<number>(0)
  const [lastLabel, setLastLabel] = useState<{ category: string; item: string } | null>(null)
  const [activeButton, setActiveButton] = useState<string | null>(null)
  const [showSummary, setShowSummary] = useState(false)
  const [productionResult, setLocalProductionResult] = useState<ProductionResult | null>(null)
  const { setSummary } = useStoreState()
  

  const primaryWork: string[] = ["Dig to Load", "Swing Loaded", "Dump", "Swing Empty"]
  const secondaryWork: string[] = ["Dig to Prepare", "Wait to Dump", "Idle", "Cleaning", "Positioning", "Others"]

  const fillFactors: number[] = [0.7, 0.8, 0.9, 1.0, 1.1, 1.2]

  const isFillFactorActive = () => lastLabel?.item === "Dig to Load" || lastLabel?.item === "Swing Loaded"

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
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
    <ScrollView
    className="flex-1 bg-gray-50"
    contentContainerStyle={{ paddingBottom: 80 }} // ⬅️ Tambahan penting agar tidak tertutup tab bar
    showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-0py-0 rounded-b-3xl ">
        <View className="items-center">
          <View className="bg-white/10 rounded-full p-4 mb-4">
          </View>
          <Text className="text-3xl font-bold text-black text-center mb-5">Proses Pengukuran</Text>
          <Text className="text-blue-900 text-center text-base">Monitor aktivitas excavator secara real-time</Text>
        </View>
      </View>

      <View className="px-6 py-6">
        {/* Equipment Info */}
        <View className="bg-white rounded-2xl p-6 mb-6  border border-gray-100">
          <Text className="text-lg font-bold text-gray-800 mb-4">📋 Informasi Alat</Text>
          <View className="space-y-3">
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Type Alat:</Text>
              <Text className="font-semibold text-gray-800">{type || "Tidak diset"}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Kapasitas Bucket:</Text>
              <Text className="font-semibold text-gray-800">
                {kapasitasBucket ? `${kapasitasBucket} m³` : "Tidak diset"}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Metode Loading:</Text>
              <Text className="font-semibold text-gray-800">{method || "Tidak diset"}</Text>
            </View>
          </View>
        </View>

        {/* Current Activity Status */}
        {lastLabel && (
          <View className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 mb-6 ">
            <Text className="text-black text-lg font-bold mb-2">🔄 Aktivitas Saat Ini</Text>
            <Text className="text-blue-800 text-xl font-bold">
              {lastLabel.category} - {lastLabel.item}
            </Text>
            <Text className="text-green-900 text-lg mt-2">⏱️ Durasi: {elapsedTime.toFixed(0)} detik</Text>
          </View>
        )}

        {/* Primary Work Section */}
        <View className="bg-white rounded-2xl p-6 mb-6  border border-gray-100">
          <Text className="text-xl font-bold text-blue-600 mb-4">🔧 Primary Work</Text>
          <View className="flex-row flex-wrap justify-between">
            {primaryWork.map((item) => (
              <View key={item} className="mb-3 w-[48%]">
                <TouchableOpacity
                  className={`py-3 px-4 rounded-lg border-2 ${
                    activeButton === item ? "bg-blue-600 border-blue-700" : "bg-blue-100 border-blue-300"
                  }`}
                  onPress={() => addStep("Primary Work", item)}
                  activeOpacity={0.8}
                >
                  <Text
                    className={`text-center font-semibold ${activeButton === item ? "text-white" : "text-blue-700"}`}
                    numberOfLines={2}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Secondary Work Section */}
        <View className="bg-white rounded-2xl p-6 mb-6  border border-gray-100">
          <Text className="text-xl font-bold text-orange-600 mb-4">⚡ Secondary Work</Text>
          <View className="flex-row flex-wrap justify-between">
            {secondaryWork.map((item) => (
              <View key={item} className="mb-3 w-[48%]">
                <TouchableOpacity
                  className={`py-3 px-4 rounded-lg border-2 ${
                    activeButton === item ? "bg-orange-500 border-orange-600" : "bg-orange-100 border-orange-300"
                  }`}
                  onPress={() => addStep("Secondary Work", item)}
                  activeOpacity={0.8}
                >
                  <Text
                    className={`text-center font-semibold ${activeButton === item ? "text-white" : "text-orange-700"}`}
                    numberOfLines={2}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Fill Factor Section */}
        <View className="bg-white rounded-2xl p-6 mb-6  border border-gray-100">
          <Text className="text-xl font-bold text-green-600 mb-2">📊 Bucket Fill Factor</Text>
          <Text className="text-gray-600 mb-2">
            Saat ini: {currentFill} ({(currentFill * 100)}%)
          </Text>

          {/* Perbaikan: tampilkan status aktif/tidak aktif */}
          {!isFillFactorActive() && (
            <View className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <Text className="text-yellow-800 text-sm text-center">
                ⚠️ Fill Factor hanya aktif untuk "Dig to Load" atau "Swing Loaded"
              </Text>
            </View>
          )}

          <View className="flex-row flex-wrap justify-between">
            {fillFactors.map((factor) => (
              <View key={factor.toString()} className="mb-3 w-[30%]">
                <TouchableOpacity
                  className={`py-3 px-2 rounded-lg border-2 ${
                    !isFillFactorActive()
                      ? "bg-gray-100 border-gray-300"
                      : currentFill === factor
                        ? "bg-green-600 border-green-700"
                        : "bg-green-100 border-green-300"
                  }`}
                  onPress={() => {
                    if (isFillFactorActive()) {
                      setCurrentFill(factor)
                    } else {
                      Alert.alert(
                        "Fill Factor Tidak Aktif",
                        "Fill Factor hanya dapat diubah saat aktivitas 'Dig to Load' atau 'Swing Loaded'",
                      )
                    }
                  }}
                  activeOpacity={0.8}
                  disabled={!isFillFactorActive()}
                >
                  <Text
                    className={`text-center font-semibold ${
                      !isFillFactorActive() ? "text-gray-500" : currentFill === factor ? "text-white" : "text-green-700"
                    }`}
                  >
                    {factor}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Statistics */}
        {logs.length > 0 && (
          <View className="bg-blue-50 rounded-2xl p-6 mb-6 border border-blue-200">
            <Text className="text-lg font-bold text-blue-800 mb-3">📈 Statistik Sementara</Text>
            <View className="space-y-2">
              <View className="flex-row justify-between">
                <Text className="text-blue-700">Total Aktivitas:</Text>
                <Text className="font-semibold text-blue-900">{logs.length}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-blue-700">Total Durasi:</Text>
                <Text className="font-semibold text-blue-900">
                  {(logs.reduce((sum, log) => sum + log.durasi, 0)).toFixed(2)} detik
                </Text>
              </View>
            </View>
          </View>
        )}

       {/* Action Buttons */}
<View className="space-y-4 mt-6">
  {/* Finish Session Button - Only show when there's an active session */}
  {lastLabel && (
    <View className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl overflow-hidden">
      <Button
        title="✅ Selesai Session"
        onPress={() => {
          Alert.alert("Selesai Session", "Apakah Anda yakin ingin menyelesaikan session ini?", [
            { text: "Batal", style: "cancel" },
            {
              text: "Selesai",
              style: "default",
              onPress: finishSession,
            },
          ])
        }}
      />
    </View>
  )}

  <View className="bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-2xl overflow-hidden">
    <Button
      title="📈 Lihat Summary"
      onPress={() => {setSummary(true)}}
      color="black"
    />
  </View>

  {logs.length > 0 && (
    <View className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl overflow-hidden">
      <Button title="🗑️ Reset Session" onPress={resetSession} />
    </View>
  )}
</View>

        {/* Help Section */}
        <View className="bg-yellow-50 rounded-2xl p-6 mt-6 border border-yellow-200">
          <Text className="text-lg font-bold text-yellow-800 mb-3">💡 Petunjuk Penggunaan</Text>
          <View className="space-y-2">
            <Text className="text-yellow-700 text-sm">• Pilih jenis aktivitas yang sedang dilakukan excavator</Text>
            <Text className="text-yellow-700 text-sm">
              • Fill Factor hanya dapat diubah saat "Dig to Load" atau "Swing Loaded"
            </Text>
            <Text className="text-yellow-700 text-sm">• Timer akan berjalan otomatis untuk setiap aktivitas</Text>
            <Text className="text-yellow-700 text-sm">
              • Tekan "Selesai Session" untuk mengakhiri pengukuran saat ini
            </Text>
            <Text className="text-yellow-700 text-sm">• Lihat Summary untuk analisis produktivitas lengkap</Text>
          </View>
        </View>
      </View>
    </ScrollView>
    </SafeAreaView>
  )
}

export default Process

// File: screen/(tabs)/summary/component/RingkasanKinerja.tsx
import { View, Text } from "react-native"
import { FC } from "react"

interface Props {
  durasiPrimary: number
  durasiSecondary: number
  efisiensi: number
  cycleTime: number
  produksi: number
}

const RingkasanKinerja: FC<Props> = ({ durasiPrimary, durasiSecondary, efisiensi, cycleTime, produksi }) => {
  return (
    <View className="mb-6 p-4 bg-yellow-50 rounded-xl shadow-lg border border-yellow-200">
      <Text className="text-lg font-bold mb-3 text-blue-800">📈 Ringkasan Kinerja</Text>
      <View className="flex-row flex-wrap">
        <View className="w-1/2 pr-2 mb-3">
          <Text className="text-xs text-gray-600">Total Primary</Text>
          <Text className="text-lg font-bold text-blue-600">{durasiPrimary.toFixed(1)}s</Text>
        </View>
        <View className="w-1/2 pl-2 mb-3">
          <Text className="text-xs text-gray-600">Total Secondary</Text>
          <Text className="text-lg font-bold text-orange-600">{durasiSecondary.toFixed(1)}s</Text>
        </View>
        <View className="w-1/2 pr-2 mb-3">
          <Text className="text-xs text-gray-600">Efficiency</Text>
          <Text className="text-lg font-bold text-green-600">{efisiensi.toFixed(1)}%</Text>
        </View>
        <View className="w-1/2 pl-2 mb-3">
          <Text className="text-xs text-gray-600">Cycle Time</Text>
          <Text className="text-lg font-bold text-purple-600">{cycleTime.toFixed(1)}s</Text>
        </View>
        <View className="w-full">
          <Text className="text-xs text-gray-600">Produksi</Text>
          <Text className="text-2xl font-bold text-indigo-600">{produksi.toFixed(2)} m³/jam</Text>
        </View>
      </View>
    </View>
  )
}

export default RingkasanKinerja
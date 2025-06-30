import { View, Text, ScrollView, Dimensions } from "react-native"
import { useStoreProcess } from "@/hooks/use-store-proses"

const screenWidth = Dimensions.get("window").width

const TabelLog = () => {
  const { logs } = useStoreProcess()

  return (
    <View className="mb-6">
      <Text className="text-lg font-bold mb-3 text-gray-800">📋 Summary Langkah</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="border border-gray-300 rounded-lg overflow-hidden" style={{ minWidth: screenWidth - 32 }}>
          <View className="flex-row bg-gray-100">
            <Text className="w-24 p-3 font-semibold text-xs text-center border-r border-gray-300">Category</Text>
            <Text className="w-24 p-3 font-semibold text-xs text-center border-r border-gray-300">Item</Text>
            <Text className="w-20 p-3 font-semibold text-xs text-center border-r border-gray-300">Durasi (s)</Text>
            <Text className="w-20 p-3 font-semibold text-xs text-center">Fill Factor</Text>
          </View>
          {logs.map((log, index) => (
            <View key={index} className="flex-row border-t border-gray-300 bg-white">
              <Text className="w-24 p-3 text-xs text-center border-r border-gray-300" numberOfLines={2}>
                {log.category}
              </Text>
              <Text className="w-24 p-3 text-xs text-center border-r border-gray-300" numberOfLines={2}>
                {log.item}
              </Text>
              <Text className="w-20 p-3 text-xs text-center border-r border-gray-300">
                {Number(log.durasi).toFixed(1)}
              </Text>
              <Text className="w-20 p-3 text-xs text-center">{Number(log.fillFactor).toFixed(1)}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  )
}

export default TabelLog

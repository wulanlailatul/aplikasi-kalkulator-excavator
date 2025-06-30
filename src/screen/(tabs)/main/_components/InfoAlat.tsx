// File: screen/(tabs)/summary/component/InfoAlat.tsx
import { View, Text } from "react-native"
import { FC } from "react"

interface InfoAlatProps {
  type?: string | null
  bucket?: number | string | null
  method?: string | null
}

const InfoAlat: FC<InfoAlatProps> = ({ type, bucket, method }) => {
  const isValid = (value: string | number | null | undefined) =>
    value !== null && value !== undefined && value !== ""

  return (
    <View className="mb-6 p-4 bg-white rounded-xl shadow-lg border border-gray-100">
      <Text className="text-lg font-bold mb-3 text-gray-800">📋 Informasi Alat</Text>
      <View className="space-y-2">
        <View className="flex-row justify-between items-center">
          <Text className="text-sm text-gray-600">Type Alat:</Text>
          <Text className="text-sm font-semibold text-gray-800">
            {isValid(type) ? type : "Tidak diset"}
          </Text>
        </View>
        <View className="flex-row justify-between items-center">
          <Text className="text-sm text-gray-600">Kapasitas Bucket:</Text>
          <Text className="text-sm font-semibold text-gray-800">
            {isValid(bucket) ? `${bucket} m³` : "Tidak diset"}
          </Text>
        </View>
        <View className="flex-row justify-between items-center">
          <Text className="text-sm text-gray-600">Metode Loading:</Text>
          <Text className="text-sm font-semibold text-gray-800">
            {isValid(method) ? method : "Tidak diset"}
          </Text>
        </View>
      </View>
    </View>
  )
}

export default InfoAlat

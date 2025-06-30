import React, { FC } from 'react'
import { View, Text } from 'react-native'

interface Props {
  efisiensi: number
  logs: any[]
}

const ResumeOperasi: FC<Props> = ({ efisiensi, logs }) => {
  return (
    <View className="bg-yellow-50 border border-yellow-300 rounded-xl p-4 mb-6 shadow-lg">
      <Text className="font-bold mb-2 text-yellow-800">⚠️ Resume Pengoperasian:</Text>
      <View className="space-y-1">
        {efisiensi < 85 && (
          <Text className="text-sm text-yellow-700">
            • Primary work {"<"} 85%. Tingkatkan efisiensi penggalian.
          </Text>
        )}

        {logs.some((log) => log.item?.toLowerCase() === 'dump' && Number(log.durasi) > 6) && (
          <Text className="text-sm text-yellow-700">
            • Dump {">"} 6 detik. Perbaiki posisi dump truck atau bench.
          </Text>
        )}

        {efisiensi >= 85 &&
          !logs.some((log) => log.item?.toLowerCase() === 'dump' && Number(log.durasi) > 6) && (
            <Text className="text-sm text-green-700">✅ Operasi berjalan dengan baik!</Text>
          )}
      </View>
    </View>
  )
}

export default ResumeOperasi

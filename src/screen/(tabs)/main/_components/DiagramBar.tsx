import { View, Text, ScrollView, Dimensions } from "react-native"
import { BarChart } from "react-native-chart-kit"
import { useStoreProcess } from "@/hooks/use-store-proses"

const screenWidth = Dimensions.get("window").width
const chartWidth = Math.min(screenWidth - 32, 350)
const barChartHeight = 250

const DiagramBar = () => {
  const { logs } = useStoreProcess()

  const totalDurasi = logs.reduce((acc, cur) => acc + Number(cur.durasi || 0), 0)
  const rataDurasi = logs.length > 0 ? totalDurasi / logs.length : 0

  const labels = logs.map((log) => {
    const label = log.item || ""
    return label.length > 8 ? label.substring(0, 6) + ".." : label
  })

  const data = logs.map((log) => Number(log.durasi || 0))
  const barWidth = 40
  const dynamicChartWidth = Math.max(chartWidth, data.length * (barWidth + 10))

  return (
    <View className="items-center mb-6 p-4 bg-white rounded-xl shadow-lg">
      <Text className="text-lg font-bold mb-2 text-gray-800">📊 Rata-rata Durasi per Aktivitas</Text>
      <Text className="text-sm text-gray-600 mb-2">
        Total Durasi: <Text className="font-semibold text-gray-800">{totalDurasi.toFixed(2)} detik</Text>
      </Text>
      <Text className="text-sm text-gray-600 mb-4">
        Rata-rata Durasi: <Text className="font-semibold text-gray-800">{rataDurasi.toFixed(2)} detik</Text>
      </Text>

      {logs.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ width: dynamicChartWidth }}>
            {/* Overlay nilai durasi manual */}
            <View style={{ position: "absolute", top: 10, left: 0, right: 0, flexDirection: "row", justifyContent: "flex-start" }}>
              {data.map((val, index) => {
                const leftPos = index * (barWidth + 10) + barWidth / 4
                return (
                  <Text
                    key={index}
                    style={{
                      position: "absolute",
                      left: leftPos,
                      color: "#16a34a",
                      fontSize: 12,
                      fontWeight: "bold",
                    }}
                  >
                    {val.toFixed(1)}
                  </Text>
                )
              })}
            </View>

            <BarChart
              data={{
                labels,
                datasets: [{ data }],
              }}
              width={dynamicChartWidth}
              height={barChartHeight}
              fromZero
              showBarTops={false}
              withInnerLines={false}
              yAxisLabel=""
              yAxisSuffix="s"
              chartConfig={{
                backgroundColor: "#fff",
                backgroundGradientFrom: "#fff",
                backgroundGradientTo: "#fff",
                decimalPlaces: 1,
                color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`,
                labelColor: () => "#374151",
                barPercentage: 0.7,
                propsForLabels: {
                  fontSize: 10,
                },
              }}
              verticalLabelRotation={30}
              style={{
                marginVertical: 8,
                borderRadius: 8,
              }}
            />
          </View>
        </ScrollView>
      ) : (
        <Text className="text-gray-500 text-center py-8">Tidak ada data untuk ditampilkan</Text>
      )}
    </View>
  )
}

export default DiagramBar

import { View, Text, Dimensions } from "react-native"
import { PieChart } from "react-native-chart-kit"

const screenWidth = Dimensions.get("window").width
const screenHeight = Dimensions.get("window").height
const chartWidth = Math.min(screenWidth - 32, 350)
const pieChartHeight = Math.min(screenHeight * 0.3, 220)

const DiagramPie = ({ pieData }: { pieData: any[] }) => {
  // Format angka ke dua angka di belakang koma
  const formattedData = pieData.map((item) => ({
    ...item,
    population: Number(item.population.toFixed(2)), // dua desimal
  }))

  return (
    <View className="items-center mb-6 p-4 bg-white rounded-xl shadow-lg">
      <Text className="text-lg font-bold mb-4 text-gray-800">Distribusi Waktu Kerja</Text>
      <View className="flex-row justify-center mb-4 flex-wrap">
        <View className="flex-row items-center mr-4 mb-2">
          <View style={{ width: 12, height: 12, backgroundColor: "#4285F4", marginRight: 6, borderRadius: 2 }} />
          <Text className="text-sm font-medium">Primary Work</Text>
        </View>
        <View className="flex-row items-center mb-2">
          <View style={{ width: 12, height: 12, backgroundColor: "#FBBC05", marginRight: 6, borderRadius: 2 }} />
          <Text className="text-sm font-medium">Secondary Work</Text>
        </View>
      </View>
      {formattedData.some((item) => item.population > 0) ? (
        <View style={{ overflow: "hidden", width: chartWidth, alignSelf: "center" }}>
          <PieChart
            data={formattedData}
            width={chartWidth}
            height={pieChartHeight}
            chartConfig={{
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="0"
            absolute
            hasLegend={true}
            center={[10, 0]}
          />
        </View>
      ) : (
        <Text className="text-gray-500 text-center py-8">Tidak ada data untuk ditampilkan</Text>
      )}
    </View>
  )
}

export default DiagramPie

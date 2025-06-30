import { SafeAreaView,ScrollView, } from "react-native"
import InfoAlat from "./InfoAlat"
import RingkasanKinerja from "./RingkasanKinerja"
import ResumeOperasi from "./ResumeOperasi"
import TabelLog from "./TabelLog"
import DiagramBar from "./DiagramBar"
import DiagramPie from "./DiagramPie"
import { View,Button } from "react-native"
import useHandleExport from "../_hooks/use-handle-export"
import { useStoreMain } from "@/hooks/use-store-main"
import { StyleSheet } from "react-native"


export const Summary = () => {
  const {handleExportExcel,handleExportPDF,cycleTime,durasiPrimary,durasiSecondary,efisiensi,logs,produksi} = useHandleExport()
  const {bucket,method,type} = useStoreMain()
  
  return (
    <SafeAreaView  style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <InfoAlat type={type} bucket={bucket} method={method} />
        <RingkasanKinerja
          durasiPrimary={durasiPrimary}
          durasiSecondary={durasiSecondary}
          efisiensi={efisiensi}
          cycleTime={cycleTime}
          produksi={produksi}
        />
        <ResumeOperasi efisiensi={efisiensi} logs={logs} />
        <TabelLog />

        {/* Menampilkan chart hanya untuk UI, tidak ikut export */}
        <DiagramPie
          pieData={[
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
          ]}
        />

        <DiagramBar />

        <View style={styles.buttonContainer}>
          <Button title="Export PDF" onPress={handleExportPDF} color="#3B82F6" />
          <View style={{ height: 12 }} />
          <Button title="Export Excel" onPress={handleExportExcel} color="#10B981" />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
  },
  buttonContainer: {
    marginTop: 24,
  },
})

import { View, Text, TextInput, TouchableOpacity, Alert, Dimensions, StyleSheet } from "react-native"
import DropDownPicker from "react-native-dropdown-picker"
import { useState, useEffect } from "react"
import { useNavigation } from "@react-navigation/core"
import type { MainStackParamList } from "../navigator"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useStoreMain } from "@/hooks/use-store-main"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { create } from "zustand"

type NavigationProp = NativeStackNavigationProp<MainStackParamList>
type AlatType = "PC1250" | "PC2000" | "PC3400"

interface storeState {
  start : boolean,
  summary: boolean
  setState : (state: boolean) => void
  setSummary: (state: boolean) => void
}

export const useStoreState = create<storeState>((set) => ({
  start: false,
  summary: false,
  setState: (state) => set({ start: state }),
  setSummary: (state) => set({ summary: state }),

}))



const EXCAVATOR_DATA = [
  { label: "PC1250", data: [{ id: "6.7", name: 6.7 }, { id: "7.5", name: 7.5 }] },
  { label: "PC2000", data: [{ id: "12", name: 12 }, { id: "14", name: 14 }] },
  { label: "PC3400", data: [{ id: "18", name: 18 }, { id: "19.7", name: 19.7 }] },
]

const METHOD_DATA = [
  { label: "Top loading", value: "Top loading" },
  { label: "Bench loading", value: "Bench loading" },
  { label: "Double Bench loading", value: "Double Bench loading" },
]

// Mapping alat ke kapasitas yang tersedia
const ALAT_KAPASITAS_MAP: Record<AlatType, string[]> = {
  PC1250: ["6.7", "7.5"],
  PC2000: ["12", "14"],
  PC3400: ["18", "19.7"],
}

const Home = () => {
  const navigation = useNavigation<NavigationProp>()
  
  // Dropdown states
  const [openType, setOpenType] = useState(false)
  const [openBucket, setOpenBucket] = useState(false)
  const [openMethod, setOpenMethod] = useState(false)

  // Store states
  const { bucket, method, type, setBucket, setMethod, setType } = useStoreMain()

  // State untuk input manual
  const [isManualTypeAlat, setIsManualTypeAlat] = useState<boolean>(false)
  const [isManualKapasitas, setIsManualKapasitas] = useState<boolean>(false)
  const [manualTypeAlat, setManualTypeAlat] = useState<string>("")
  const [manualKapasitas, setManualKapasitas] = useState<string>("")

  // TAMBAHAN: State untuk menampilkan/menyembunyikan panduan
  const [showUsageGuide, setShowUsageGuide] = useState(false)

  const screenWidth = Dimensions.get("window").width - 40

  // Available kapasitas berdasarkan type alat yang dipilih
  const [availableKapasitas, setAvailableKapasitas] = useState<string[]>([])

  // Dropdown items
  const [typeItems] = useState([
    ...EXCAVATOR_DATA.map((item) => ({ label: item.label, value: item.label })),
    { label: "✏️ Input Manual", value: "manual" },
  ])
  const [bucketItems, setBucketItems] = useState<{ label: string; value: any }[]>([])
  const [methodItems] = useState(METHOD_DATA)

  // Effect untuk auto-set manual kapasitas ketika type alat manual
  useEffect(() => {
    if (isManualTypeAlat) {
      // Jika type alat manual, otomatis set kapasitas juga manual
      setIsManualKapasitas(true)
      setBucket("")
      setBucketItems([]) // Clear bucket items karena tidak diperlukan
      setAvailableKapasitas([])
    } else if (type && type !== "manual" && ALAT_KAPASITAS_MAP[type as AlatType]) {
      // Jika type alat dari dropdown, set kapasitas ke dropdown juga
      setIsManualKapasitas(false)
      setManualKapasitas("")
      
      const kapasitasList = ALAT_KAPASITAS_MAP[type as AlatType]
      setAvailableKapasitas(kapasitasList)
      
      // Update bucket items
      const items = kapasitasList.map((k) => ({ label: `${k} m³`, value: k.toString() }))
      setBucketItems([...items, { label: "✏️ Input Manual", value: "manual" }])
      
      // Reset bucket selection
      setBucket(null)
    } else {
      // No type selected
      setAvailableKapasitas([])
      setBucketItems([])
      setBucket(null)
    }
  }, [type, isManualTypeAlat])

  // Reset manual inputs when switching away from manual
  useEffect(() => {
    if (!isManualTypeAlat) {
      setManualTypeAlat("")
    }
  }, [isManualTypeAlat])

  useEffect(() => {
    if (!isManualKapasitas) {
      setManualKapasitas("")
    }
  }, [isManualKapasitas])

  // Check if form is filled
  const isFormFilled = () => {
    const finalTypeAlat = isManualTypeAlat ? manualTypeAlat : type
    const finalKapasitas = isManualKapasitas ? manualKapasitas : bucket
    return finalTypeAlat !== "" && finalTypeAlat !== null && 
           finalKapasitas !== "" && finalKapasitas !== null && 
           method !== "" && method !== null
  }

  // Get final values for type alat and kapasitas
  const getFinalTypeAlat = () => (isManualTypeAlat ? manualTypeAlat : type)
  const getFinalKapasitas = () => (isManualKapasitas ? manualKapasitas : bucket)

  // Handle type alat change
  const handleTypeAlatChange = (value: string) => {
    if (value === "manual") {
      setIsManualTypeAlat(true)
      setType("")
      // OTOMATIS SET KAPASITAS JUGA MANUAL
      setIsManualKapasitas(true)
      setBucket("")
    } else {
      setIsManualTypeAlat(false)
      setType(value)
      setManualTypeAlat("")
      // OTOMATIS SET KAPASITAS KEMBALI KE DROPDOWN
      setIsManualKapasitas(false)
      setManualKapasitas("")
    }
    
    // FIXED: Hanya tutup dropdown bucket, biarkan method tetap bisa dibuka
    setOpenBucket(false)
    // Jangan tutup method dropdown secara otomatis
  }

  // Handle kapasitas change (hanya untuk dropdown mode)
  const handleKapasitasChange = (value: string) => {
    // Hanya bisa digunakan jika type alat bukan manual
    if (!isManualTypeAlat) {
      if (value === "manual") {
        setIsManualKapasitas(true)
        setBucket("")
      } else {
        setIsManualKapasitas(false)
        setBucket(value.toString())
        setManualKapasitas("")
      }
    }
    
    // FIXED: Hanya tutup dropdown type, biarkan method tetap bisa dibuka
    setOpenType(false)
    // Jangan tutup method dropdown secara otomatis
  }

  // FIXED: Handle method change - lebih sederhana
  const handleMethodChange = (value: string) => {
    setMethod(value)
    // Tutup dropdown lain hanya jika diperlukan
    setOpenType(false)
    setOpenBucket(false)
  }

  // FIXED: Handle method dropdown open
  const handleMethodOpen = () => {
    // Pastikan dropdown lain tertutup saat method dibuka
    setOpenType(false)
    setOpenBucket(false)
    setOpenMethod(true)
  }

  // Handle navigation
  const handleNavigate = () => {
    const finalTypeAlat = getFinalTypeAlat()
    const finalKapasitas = getFinalKapasitas()
    const finalMethod = method

    // Validation
    if (!finalTypeAlat) {
      Alert.alert("Peringatan", "Silakan pilih atau masukkan Type Alat")
      return
    }

    if (!finalKapasitas) {
      Alert.alert("Peringatan", "Silakan pilih atau masukkan Kapasitas Bucket")
      return
    }

    // Validate numeric value for kapasitas
    const numericKapasitas = parseFloat(finalKapasitas.toString())
    if (isNaN(numericKapasitas) || numericKapasitas <= 0) {
      Alert.alert("Peringatan", "Kapasitas Bucket harus berupa angka yang valid dan lebih dari 0")
      return
    }

    if (!finalMethod) {
      Alert.alert("Peringatan", "Silakan pilih Metode Loading")
      return
    }

    // Update store with final values
    setType(finalTypeAlat)
    setBucket(numericKapasitas.toString())
    setMethod(finalMethod)
    useStoreState.getState().setState(true) 
  }

  // Get display values
  const getDisplayValue = (field: "type" | "bucket" | "method") => {
    switch (field) {
      case "type":
        return getFinalTypeAlat() || "Belum dipilih"
      case "bucket":
        const kapasitas = getFinalKapasitas()
        return kapasitas ? `${kapasitas} m³` : "Belum dipilih"
      case "method":
        return method || "Belum dipilih"
      default:
        return "Belum dipilih"
    }
  }

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ 
        flexGrow: 1, 
        paddingHorizontal: 16, 
        paddingBottom: 110, 
        backgroundColor: "#f9fafb" 
      }}
      enableOnAndroid
      extraScrollHeight={20}
      keyboardShouldPersistTaps="handled"
    >
      <View className="items-center w-full">
        <Text className="text-3xl font-black text-center mb-8 text-gray-800 mt-10">
          Kalkulator Produktivitas Excavator
        </Text>

        {/* TAMBAHAN: Tombol Panduan Penggunaan */}
        <TouchableOpacity 
          className="w-full bg-blue-100 rounded-lg p-3 mb-4 border border-blue-200"
          onPress={() => setShowUsageGuide(!showUsageGuide)}
          activeOpacity={0.7}
        >
          <Text className="text-center text-blue-700 font-semibold">
            {showUsageGuide ? "🔼 Sembunyikan" : "🔽 Tampilkan"} Cara Penggunaan
          </Text>
        </TouchableOpacity>

        {/* TAMBAHAN: Panel Panduan Penggunaan */}
        {showUsageGuide && (
          <View className="w-full bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
            <Text className="text-lg font-bold text-blue-800 mb-3">📖 Cara Penggunaan</Text>
            
            <View className="space-y-3">
              <View>
                <Text className="font-bold text-blue-700 mb-1">🎯 Mode Dropdown (Rekomendasi):</Text>
                <Text className="text-blue-600 text-sm leading-5">
                  • Pilih Type Alat dari daftar yang tersedia{'\n'}
                  • Pilih Kapasitas Bucket sesuai type alat{'\n'}
                  • Pilih Metode Loading yang diinginkan{'\n'}
                  • Urutan pengisian bebas
                </Text>
              </View>
              
              <View className="border-t border-blue-200 pt-3">
                <Text className="font-bold text-red-700 mb-1">⚠️ Mode Input Manual (PENTING):</Text>
                <Text className="text-red-600 text-sm leading-5 font-medium">
                  1️⃣ WAJIB pilih Metode Loading terlebih dahulu{'\n'}
                  2️⃣ Baru pilih "✏️ Input Manual" pada Type Alat{'\n'}
                  3️⃣ Kapasitas otomatis jadi input manual{'\n'}
                  4️⃣ Isi Type Alat dan Kapasitas secara manual
                </Text>
              </View>
              
              <View className="bg-yellow-100 rounded-lg p-3 border border-yellow-300">
                <Text className="font-bold text-yellow-800 mb-1">💡 Tips Penting:</Text>
                <Text className="text-yellow-700 text-sm leading-5">
                  • Jika menggunakan input manual, SELALU pilih Metode Loading dulu{'\n'}
                  • Type Alat manual otomatis membuat Kapasitas jadi manual{'\n'}
                  • Pastikan semua field terisi sebelum melanjutkan
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Type Alat Section */}
        <View className="w-full mb-6" style={{ zIndex: 3000 }}>
          <Text className="text-lg font-bold mb-2 text-gray-700">Type Alat</Text>
          
          {!isManualTypeAlat ? (
            <DropDownPicker
              open={openType}
              value={type}
              items={typeItems}
              setOpen={setOpenType}
              setValue={(val) => {
                const value = typeof val === "function" ? val(type) : val
                handleTypeAlatChange(value)
              }}
              onOpen={() => {
                setOpenBucket(false)
                setOpenMethod(false)
              }}
              placeholder="-- Pilih Type Alat --"
              listMode="SCROLLVIEW"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              textStyle={styles.dropdownText}
              placeholderStyle={styles.placeholderText}
              zIndex={3000}
              zIndexInverse={1000}
            />
          ) : (
            <View>
              <TextInput
                style={styles.textInput}
                placeholder="Masukkan type alat secara manual (contoh: PC400)"
                value={manualTypeAlat}
                onChangeText={(text) => {
                  // Auto-format dengan PC prefix
                  if (text.length > 0 && !text.toUpperCase().startsWith('PC')) {
                    setManualTypeAlat('PC' + text.replace(/[^0-9]/g, ''))
                  } else {
                    setManualTypeAlat(text.toUpperCase())
                  }
                }}
                autoCapitalize="characters"
                maxLength={10}
              />
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => {
                  setIsManualTypeAlat(false)
                  setManualTypeAlat("")
                  // Reset kapasitas juga kembali ke dropdown
                  setIsManualKapasitas(false)
                  setManualKapasitas("")
                }}
              >
                <Text style={styles.backButtonText}>← Kembali ke Dropdown</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Kapasitas Bucket Section */}
        <View className="w-full mb-6" style={{ zIndex: 2000 }}>
          <Text className="text-lg font-bold mb-2 text-gray-700">Kapasitas Bucket (m³)</Text>
          
          {!isManualKapasitas ? (
            <DropDownPicker
              open={openBucket}
              value={bucket?.toString()}
              items={bucketItems}
              setOpen={setOpenBucket}
              setValue={(val) => {
                const value = typeof val === "function" ? val(bucket) : val
                handleKapasitasChange(value)
              }}
              onOpen={() => {
                setOpenType(false)
                setOpenMethod(false)
              }}
              placeholder={
                isManualTypeAlat 
                  ? "Otomatis input manual karena Type Alat manual"
                  : type 
                    ? "-- Pilih Kapasitas --" 
                    : "Pilih Type Alat terlebih dahulu"
              }
              disabled={!type && !isManualTypeAlat || isManualTypeAlat}
              listMode="SCROLLVIEW"
              style={{
                ...styles.dropdown,
                backgroundColor: isManualTypeAlat ? "#f9fafb" : (type ? "#ffffff" : "#f3f4f6"),
                borderColor: isManualTypeAlat ? "#e5e7eb" : (type ? "#d1d5db" : "#e5e7eb"),
                opacity: isManualTypeAlat ? 0.5 : (type ? 1 : 0.6),
              }}
              dropDownContainerStyle={styles.dropdownContainer}
              textStyle={{
                ...styles.dropdownText,
                color: isManualTypeAlat ? "#9ca3af" : (type ? "#374151" : "#9ca3af"),
              }}
              placeholderStyle={styles.placeholderText}
              zIndex={2000}
              zIndexInverse={2000}
            />
          ) : (
            <View>
              <TextInput
                style={styles.textInput}
                placeholder="Masukkan kapasitas bucket (m³)"
                value={manualKapasitas}
                onChangeText={(text) => {
                  // Only allow numbers and decimal point
                  const cleanText = text.replace(/[^0-9.]/g, '')
                  // Prevent multiple decimal points
                  const parts = cleanText.split('.')
                  if (parts.length > 2) {
                    setManualKapasitas(parts[0] + '.' + parts.slice(1).join(''))
                  } else {
                    setManualKapasitas(cleanText)
                  }
                }}
                keyboardType="decimal-pad"
                maxLength={6}
              />
              {/* HANYA TAMPILKAN TOMBOL KEMBALI JIKA TYPE ALAT BUKAN MANUAL */}
              {!isManualTypeAlat && (
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => {
                    setIsManualKapasitas(false)
                    setManualKapasitas("")
                  }}
                >
                  <Text style={styles.backButtonText}>← Kembali ke Dropdown</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          
          {!type && !isManualTypeAlat && (
            <Text className="text-sm text-orange-600 mt-1">
              ⚠️ Pilih type alat terlebih dahulu
            </Text>
          )}
          
          {isManualTypeAlat && (
            <Text className="text-sm text-blue-600 mt-1">
              ℹ️ Kapasitas otomatis input manual karena Type Alat diinput manual
            </Text>
          )}
        </View>

        {/* FIXED: Metode Loading Section - Improved z-index and handling */}
        <View className="w-full mb-8" style={{ zIndex: 1000 }}>
          <Text className="text-lg font-bold mb-2 text-gray-700">Metode Loading</Text>
          
          {/* DEBUG: Tambahkan tombol test untuk memastikan method bisa diklik */}
          <TouchableOpacity 
            style={styles.debugButton}
            onPress={() => Alert.alert("Debug", "Method section dapat diklik!")}
          >
            <Text style={styles.debugButtonText}>🔧 Test Klik Method</Text>
          </TouchableOpacity>
          
          <DropDownPicker
            open={openMethod}
            value={method}
            items={methodItems}
            setOpen={setOpenMethod}
            setValue={(val) => {
              const value = typeof val === "function" ? val(method) : val
              handleMethodChange(value)
            }}
            onOpen={handleMethodOpen} // FIXED: Gunakan handler khusus
            placeholder="-- Pilih Metode --"
            listMode="SCROLLVIEW"
            style={{
              ...styles.dropdown,
              // FIXED: Pastikan style tidak terpengaruh manual input
              backgroundColor: "#ffffff",
              borderColor: "#d1d5db",
              opacity: 1, // Selalu aktif
            }}
            dropDownContainerStyle={{
              ...styles.dropdownContainer,
              // FIXED: Pastikan dropdown container selalu terlihat
              zIndex: 1000,
            }}
            textStyle={styles.dropdownText}
            placeholderStyle={styles.placeholderText}
            zIndex={1000}
            zIndexInverse={4000} // FIXED: Tingkatkan zIndexInverse
            disabled={false} // FIXED: Pastikan tidak pernah disabled
          />
          
          {/* FIXED: Tambahkan indikator status */}
          <Text className="text-xs text-gray-500 mt-1">
            Status: {openMethod ? "🔓 Terbuka" : "🔒 Tertutup"} | 
            Value: {method || "Belum dipilih"} | 
            Manual Mode: {isManualTypeAlat ? "✅" : "❌"}
          </Text>
        </View>

        {/* Ringkasan */}
        {(type || isManualTypeAlat || bucket || isManualKapasitas || method) && (
          <View className="w-full bg-yellow-50 rounded-lg p-4 mb-6 border border-yellow-200">
            <Text className="text-lg font-bold text-blue-800 mb-3">📋 Ringkasan Pilihan</Text>
            <View className="space-y-2">
              <SummaryRow label="Type Alat" value={getDisplayValue("type")} />
              <SummaryRow label="Kapasitas" value={getDisplayValue("bucket")} />
              <SummaryRow label="Metode" value={getDisplayValue("method")} />
            </View>
            
            {/* TAMPILKAN STATUS INPUT */}
            <View className="mt-3 pt-3 border-t border-yellow-300">
              <Text className="text-sm text-blue-700">
                📝 Mode Input: {isManualTypeAlat ? "Manual" : "Dropdown"} (Type) | {isManualKapasitas ? "Manual" : "Dropdown"} (Kapasitas)
              </Text>
            </View>
          </View>
        )}

        {/* Tombol */}
        <TouchableOpacity
          className={`w-full rounded-lg py-4 ${
            isFormFilled() ? "bg-yellow-400" : "bg-gray-400"
          }`}
          onPress={handleNavigate}
          activeOpacity={0.8}
          disabled={!isFormFilled()}
        >
          <Text className="text-center font-bold text-white text-lg">
            {isFormFilled() ? "🚀 Mulai Hitung" : "📝 Lengkapi Data"}
          </Text>
        </TouchableOpacity>

        {/* UPDATED: Pesan bawah dengan penekanan pada urutan input manual */}
        <View className="w-full bg-red-50 rounded-lg p-4 mt-4 border border-red-200">
          <Text className="text-sm text-red-800 text-center font-semibold">
            ⚠️ PENTING: Jika menggunakan input manual, WAJIB pilih Metode Loading terlebih dahulu!
          </Text>
        </View>
      </View>
    </KeyboardAwareScrollView>
  )
}

const SummaryRow = ({ label, value }: { label: string; value?: string }) => (
  <View className="flex-row justify-between">
    <Text className="text-blue-700">{label}:</Text>
    <Text className="font-semibold text-blue-900">{value ?? "Belum dipilih"}</Text>
  </View>
)

const styles = StyleSheet.create({
  dropdown: {
    backgroundColor: "#ffffff",
    borderColor: "#d1d5db",
    borderWidth: 1,
    borderRadius: 8,
    minHeight: 50,
  },
  dropdownContainer: {
    backgroundColor: "#ffffff",
    borderColor: "#d1d5db",
    borderWidth: 1,
    borderRadius: 8,
  },
  dropdownText: {
    fontSize: 16,
    color: "#374151",
  },
  placeholderText: {
    color: "#9ca3af",
    fontSize: 16,
  },
  textInput: {
    backgroundColor: "#ffffff",
    borderColor: "#d1d5db",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: "#374151",
    marginTop: 4,
  },
  backButton: {
    backgroundColor: "#f3f4f6",
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 8,
    alignSelf: "flex-start",
  },
  backButtonText: {
    color: "#6b7280",
    fontSize: 14,
    fontWeight: "500",
  },
  // FIXED: Tambahkan style untuk debug button
  debugButton: {
    backgroundColor: "#e0f2fe",
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginBottom: 8,
    alignSelf: "flex-start",
  },
  debugButtonText: {
    color: "#0369a1",
    fontSize: 12,
    fontWeight: "500",
  },
})

export default Home
import XLSX from "xlsx";
import RNFS from "react-native-fs";
import { PermissionsAndroid, Platform, Alert } from "react-native";

interface ExportToExcelParams {
  alat: string;
  metode: string;
  bucket: string | number;
  efisiensi: string;
  produksi: string;
  cycleTime: string;
  logs: {
    category: string;
    item: string;
    durasi: number;
    fillFactor: number;
  }[];
}

export const exportToExcel = async ({
  alat,
  metode,
  bucket,
  efisiensi,
  produksi,
  cycleTime,
  logs,
}: ExportToExcelParams) => {
  try {
    // 🔐 Permission untuk Android
    if (Platform.OS === "android") {
      const sdkInt = parseInt(Platform.Version.toString(), 10);
      if (sdkInt < 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: "Izin Akses Penyimpanan",
            message: "Aplikasi memerlukan izin untuk menyimpan file Excel.",
            buttonPositive: "OK",
            buttonNegative: "Batal",
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert("Izin Ditolak", "Tidak dapat menyimpan file tanpa izin.");
          return;
        }
      }
    }

    const totalDurasi = logs.reduce((acc, cur) => acc + Number(cur.durasi || 0), 0);
    const rataDurasi = logs.length > 0 ? totalDurasi / logs.length : 0;

    const summarySheetData = [
      ["📋 Informasi Alat"],
      ["Type Alat", alat],
      ["Kapasitas Bucket", `${bucket} m³`],
      ["Metode Loading", metode],
      [],
      ["📈 Ringkasan Kinerja"],
      ["Efisiensi", efisiensi],
      ["Produksi", produksi],
      ["Cycle Time", cycleTime],
      ["Total Durasi", `${totalDurasi.toFixed(1)} detik`],
      ["Rata-rata Durasi", `${rataDurasi.toFixed(1)} detik`],
      ["Jumlah Log", logs.length],
    ];

    const logSheetData = [
      ["Category", "Item", "Durasi (s)", "Fill Factor"],
      ...logs.map((log) => [
        log.category,
        log.item,
        log.durasi.toFixed(1),
        log.fillFactor.toFixed(1),
      ]),
    ];

    const wsSummary = XLSX.utils.aoa_to_sheet(summarySheetData);
    const wsLog = XLSX.utils.aoa_to_sheet(logSheetData);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, wsSummary, "Ringkasan");
    XLSX.utils.book_append_sheet(wb, wsLog, "Log Pengoperasian");

    const wbout = XLSX.write(wb, { type: "binary", bookType: "xlsx" });

    // 🕓 Tambahkan timestamp agar tidak tertimpa
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const fileName = `summary-produktivitas-${timestamp}.xlsx`;

    const tempPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
    const downloadPath = `${RNFS.DownloadDirectoryPath}/${fileName}`;

    await RNFS.writeFile(tempPath, wbout, "ascii");
    await RNFS.copyFile(tempPath, downloadPath);

    Alert.alert("Sukses", `File Excel disimpan di:\n${downloadPath}`);
    console.log("✅ Excel saved to:", downloadPath);
  } catch (error: any) {
    console.error("❌ Export Excel error:", error);
    Alert.alert("Gagal", `Export gagal: ${error.message || error}`);
  }
};

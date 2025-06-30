// exportToPDF.ts
import RNHTMLtoPDF from "react-native-html-to-pdf";
import RNFS from "react-native-fs";
import { Platform, PermissionsAndroid, Alert } from "react-native";

interface ExportToPDFProps {
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

export const exportToPDF = async ({
  alat,
  metode,
  bucket,
  efisiensi,
  produksi,
  cycleTime,
  logs,
}: ExportToPDFProps) => {
  try {
    if (Platform.OS === "android") {
      const sdkInt = parseInt(Platform.Version.toString(), 10);
      if (sdkInt < 33) {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        ]);
        if (
          granted[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] !==
            PermissionsAndroid.RESULTS.GRANTED ||
          granted[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE] !==
            PermissionsAndroid.RESULTS.GRANTED
        ) {
          Alert.alert("Izin Ditolak", "Tidak bisa menyimpan file tanpa izin.");
          return;
        }
      }
    }

    // Buat nama file unik agar tidak tertimpa
    const timestamp = new Date().getTime();
    const fileName = `summary-produktivitas-${timestamp}.pdf`;

    // 2) Siapkan data dan HTML
    const currentDate = new Date().toLocaleString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const totalDurasi = logs.reduce((sum, log) => sum + log.durasi, 0);
    const durasiPrimary = logs
      .filter((log) => log.category.toLowerCase().includes("primary"))
      .reduce((sum, log) => sum + log.durasi, 0);
    const durasiSecondary = totalDurasi - durasiPrimary;
    const totalDurasiDisplay = totalDurasi === 0 ? 1 : totalDurasi;
    const degreePrimary = ((durasiPrimary / totalDurasiDisplay) * 360).toFixed(2);

    const logTableRows = logs
      .map(
        (log) => `
        <tr>
          <td>${log.category}</td>
          <td>${log.item}</td>
          <td>${log.durasi.toFixed(2)}</td>
          <td>${log.fillFactor.toFixed(2)}</td>
        </tr>`
      )
      .join("");

    const pieChartHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;margin-top:16px;">
        <div style="
          width: 160px;
          height: 160px;
          border-radius: 80px;
          background: conic-gradient(
            #4285F4 0deg ${degreePrimary}deg,
            #FBBC05 ${degreePrimary}deg 360deg
          );
          border: 6px solid #fff;
          box-shadow: 0 0 4px rgba(0,0,0,0.1);
          position: relative;
        "></div>
        <div style="display:flex;justify-content:center;margin-top:12px;font-size:12px">
          <div style="margin-right:16px;display:flex;align-items:center">
            <div style="width:12px;height:12px;background:#4285F4;margin-right:6px"></div>
            <span>Primary Work (${durasiPrimary.toFixed(2)}s)</span>
          </div>
          <div style="display:flex;align-items:center">
            <div style="width:12px;height:12px;background:#FBBC05;margin-right:6px"></div>
            <span>Secondary Work (${durasiSecondary.toFixed(2)}s)</span>
          </div>
        </div>
      </div>`;

    const maxDurasi = Math.max(...logs.map((l) => l.durasi || 1), 1);
    const barChartHTML = `
      <div>
        <h2 style="font-size:16px;text-align:center;">📊 Rata-rata Durasi per Aktivitas</h2>
        <p style="text-align:center;margin:0;font-size:14px;">
          Total Durasi: <strong>${totalDurasi.toFixed(2)}s</strong>
        </p>
        <p style="text-align:center;margin:0 0 10px;font-size:14px;">
          Rata-rata: <strong>${(totalDurasi / logs.length).toFixed(2)}s</strong>
        </p>
        <div style="padding:12px;border:1px solid #ccc;border-radius:12px;width:100%;box-sizing:border-box;">
          <div style="display:flex;align-items:flex-end;justify-content:center;gap:12px;height:150px;">
            ${logs
              .map((log) => {
                const heightPx = Math.max((log.durasi / maxDurasi) * 130, 4).toFixed(2);
                const label =
                  log.item.length > 6 ? log.item.slice(0, 5) + "…" : log.item;
                return `
                  <div style="display:flex;flex-direction:column;align-items:center;width:32px;">
                    <div style="font-size:12px;color:#6B7280;">${log.durasi.toFixed(
                      2
                    )}s</div>
                    <div style="height:${heightPx}px;width:100%;background-color:#D1FAE5;border-radius:6px 6px 0 0;"></div>
                    <div style="font-size:11px;color:#4B5563;transform:rotate(-30deg);margin-top:6px;">${label}</div>
                  </div>`;
              })
              .join("")}
          </div>
        </div>
      </div>`;

    const htmlContent = `
      <!DOCTYPE html>
      <html><head><meta charset="UTF-8">
        <style>
          body { font-family:Arial,sans-serif; padding:16px; color:#333; }
          h1 { text-align:center; color:#222; }
          .section { margin-bottom:28px; }
          .section h2 { font-size:18px; border-bottom:1px solid #ccc; margin-bottom:8px; color:#444; }
          table { width:100%; border-collapse:collapse; font-size:12px; }
          th, td { border:1px solid #ccc; padding:6px; text-align:center; }
          th { background-color:#f0f0f0; }
        </style>
      </head><body>
        <h1>📊 Summary Produktivitas</h1>
        <p style="text-align:center;font-size:12px;color:#666;">Tanggal: ${currentDate}</p>
        <div class="section">
          <h2>📋 Info Alat</h2>
          <p><strong>Alat:</strong> ${alat}</p>
          <p><strong>Bucket:</strong> ${bucket} m³</p>
          <p><strong>Metode:</strong> ${metode}</p>
        </div>
        <div class="section">
          <h2>📈 Ringkasan Kinerja</h2>
          <p><strong>Efisiensi:</strong> ${efisiensi}</p>
          <p><strong>Produksi:</strong> ${produksi}</p>
          <p><strong>Cycle Time:</strong> ${cycleTime}</p>
        </div>
        <div class="section">
          <h2>📋 Log Pengoperasian</h2>
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Item</th>
                <th>Durasi (s)</th>
                <th>Fill Factor</th>
              </tr>
            </thead>
            <tbody>${logTableRows}</tbody>
          </table>
        </div>
        ${pieChartHTML}
        ${barChartHTML}
      </body></html>`;

   // Generate ke folder sandbox sementara
    const sandboxPDF = await RNHTMLtoPDF.convert({
      html: htmlContent,
      fileName: `temp-${timestamp}`,
      base64: false,
    });

    if (!sandboxPDF?.filePath) throw new Error("PDF gagal dibuat.");

    // Target path permanen di folder Download
    const targetPath = `${RNFS.DownloadDirectoryPath}/${fileName}`;
    await RNFS.copyFile(sandboxPDF.filePath, targetPath);

    Alert.alert("Sukses", `PDF berhasil disimpan di:\n${targetPath}`);
    console.log("✅ PDF saved to:", targetPath);
  } catch (err: any) {
    console.error("❌ Error PDF:", err);
    Alert.alert("Gagal", `Gagal menyimpan PDF: ${err.message || err}`);
  }
};

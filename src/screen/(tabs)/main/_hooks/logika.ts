export const hitungProduktivitas = ({
  bucket,
  durasi,
  fillFactor,
  method,
  type,
}: {
  bucket: number;
  durasi: number;
  fillFactor: number;
  method: string;
  type: string;
}): number => {
  const getEfisiensi = (method: string, type: string): number => {
    if (method === 'Overburden') {
      return type === 'PC200' ? 0.75 : 0.8;
    } else if (method === 'Coal Getting') {
      return type === 'PC400' ? 0.85 : 0.8;
    }
    return 0.8; // default
  };

  const efisiensi = getEfisiensi(method, type);
  const jamKerja = durasi / 60; // konversi durasi (menit) ke jam
  const produktivitas = bucket * fillFactor * jamKerja * efisiensi;
  return produktivitas;
};

import { supabase } from "../lib/supabase";

export async function getLaporan(periodeId: number) {
  const { data, error } = await supabase
    .from("transaksi")
    .select(`
      *,
      warga (
        nama
      ),
      periode (
        id,
        nama_periode,
        kuota_liter,
        jenis_bbm (
          nama,
          harga
        )
      )
    `)
    .eq("periode_id", periodeId)
    .order("tanggal", { ascending: true });

  if (error) throw error;

  return data;
}
export async function getLabaRugi(periodeId: number) {
  // Ambil periode dan pembelian BBM
  const { data: periode, error: periodeError } = await supabase
    .from("periode")
    .select(`
      id,
      nama_periode,
      kuota_liter,
      pembelian_bbm (
        id,
        jumlah_liter,
        harga_modal_per_liter,
        total_modal
      )
    `)
    .eq("id", periodeId)
    .single();

  if (periodeError) throw periodeError;

  // Ambil total penjualan
  const { data: transaksi, error: transaksiError } = await supabase
    .from("transaksi")
    .select("liter, total")
    .eq("periode_id", periodeId);

  if (transaksiError) throw transaksiError;

  // Ambil total pengeluaran periode
  const { data: pengeluaran, error: pengeluaranError } =
    await supabase
      .from("pengeluaran")
      .select("jumlah")
      .eq("periode_id", periodeId);

  if (pengeluaranError) throw pengeluaranError;

  const totalLiterTerjual = (transaksi || []).reduce(
    (total, item) => total + Number(item.liter || 0),
    0
  );

  const totalPenjualan = (transaksi || []).reduce(
    (total, item) => total + Number(item.total || 0),
    0
  );

  const pembelian = Array.isArray(periode.pembelian_bbm)
    ? periode.pembelian_bbm[0]
    : periode.pembelian_bbm;

  const hargaModalPerLiter = Number(
    pembelian?.harga_modal_per_liter || 0
  );

  const totalModal = totalLiterTerjual * hargaModalPerLiter;

  const labaKotor = totalPenjualan - totalModal;

  const totalPengeluaran = (pengeluaran || []).reduce(
    (total, item) => total + Number(item.jumlah || 0),
    0
  );

  const labaBersih = labaKotor - totalPengeluaran;

  return {
    periode,
    totalLiterTerjual,
    totalPenjualan,
    hargaModalPerLiter,
    totalModal,
    labaKotor,
    totalPengeluaran,
    labaBersih,
  };
}
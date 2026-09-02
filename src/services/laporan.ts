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
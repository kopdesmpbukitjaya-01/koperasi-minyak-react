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
        nama_periode
      )
    `)
    .eq("periode_id", periodeId)
    .order("tanggal", { ascending: true });

  if (error) throw error;

  return data;
}
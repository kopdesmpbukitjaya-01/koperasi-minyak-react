import { supabase } from "../lib/supabase";

export async function getDashboardBBM() {
  const { data, error } = await supabase
    .from("transaksi")
    .select(`
      liter,
      warga_id,
      periode (
        id,
        nama_periode
      ),
      jenis_bbm (
        id,
        nama
      )
    `);

  if (error) {
    throw error;
  }

  const hasil: any = {};

  data.forEach((t: any) => {
    const key = `${t.periode.id}-${t.jenis_bbm.id}`;

    if (!hasil[key]) {
      hasil[key] = {
        periode: t.periode.nama_periode,
        jenis_bbm: t.jenis_bbm.nama,
        jumlah_kk: 0,
        liter: 0,
      };
    }

    hasil[key].jumlah_kk += 1;
    hasil[key].liter += Number(t.liter);
  });

  return Object.values(hasil);
}
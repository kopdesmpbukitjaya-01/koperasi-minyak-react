import { supabase } from "../lib/supabase";

export async function getTransaksi() {
  const { data, error } = await supabase
    .from("transaksi")
    .select(`
      *,
      warga (
        id,
        nama
      ),
      periode (
        id,
        nama_periode
      ),
      jenis_bbm (
        id,
        nama,
        harga
      )
    `)
    .order("tanggal", { ascending: false });

  if (error) throw error;

  return data;
}

export async function addTransaksi(
  warga_id: number,
  periode_id: number,
  jenis_bbm_id: number,
  tanggal: string,
  liter: number
) {
  // Ambil harga dari tabel jenis_bbm
  const { data: bbm, error: errBBM } = await supabase
    .from("jenis_bbm")
    .select("harga")
    .eq("id", jenis_bbm_id)
    .single();

  if (errBBM) throw errBBM;

  const harga = Number(bbm.harga);
  const total = harga * liter;

  const { error } = await supabase
    .from("transaksi")
    .insert([
      {
        warga_id,
        periode_id,
        jenis_bbm_id,
        tanggal,
        liter,
        harga,
        total,
      },
    ]);

  if (error) throw error;
}

export async function updateTransaksi(
  id: number,
  warga_id: number,
  periode_id: number,
  jenis_bbm_id: number,
  tanggal: string,
  liter: number
) {
  const { data: bbm, error: errBBM } = await supabase
    .from("jenis_bbm")
    .select("harga")
    .eq("id", jenis_bbm_id)
    .single();

  if (errBBM) throw errBBM;

  const harga = Number(bbm.harga);
  const total = harga * liter;

  const { error } = await supabase
    .from("transaksi")
    .update({
      warga_id,
      periode_id,
      jenis_bbm_id,
      tanggal,
      liter,
      harga,
      total,
    })
    .eq("id", id);

  if (error) throw error;
}

export async function deleteTransaksi(id: number) {
  const { error } = await supabase
    .from("transaksi")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
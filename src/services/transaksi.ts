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
  // =====================================================
  // CEK TRANSAKSI YANG SUDAH ADA
  // =====================================================

  const sudahAda = await cekTransaksiWarga(
    warga_id,
    periode_id
  );

  if (sudahAda) {
    throw new Error(
      "Warga ini sudah melakukan pengambilan BBM pada periode tersebut."
    );
  }

  // =====================================================
  // AMBIL HARGA BBM
  // =====================================================

  const { data: bbm, error: errBBM } = await supabase
    .from("jenis_bbm")
    .select("harga")
    .eq("id", jenis_bbm_id)
    .single();

  if (errBBM) throw errBBM;

  const harga = Number(bbm.harga);
  const total = harga * liter;

  // =====================================================
  // SIMPAN TRANSAKSI
  // =====================================================

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

  // =====================================================
  // DATABASE MENOLAK DUPLIKAT
  // UNIQUE (warga_id, periode_id)
  // =====================================================

  if (error) {
    if (error.code === "23505") {
      throw new Error(
        "Warga ini sudah melakukan pengambilan BBM pada periode tersebut."
      );
    }

    throw error;
  }
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
export async function cekTransaksiWarga(
  warga_id: number,
  periode_id: number
) {
  const { data, error } = await supabase
    .from("transaksi")
    .select("id")
    .eq("warga_id", warga_id)
    .eq("periode_id", periode_id)
    .limit(1);

  if (error) throw error;

  return (data?.length ?? 0) > 0;
}
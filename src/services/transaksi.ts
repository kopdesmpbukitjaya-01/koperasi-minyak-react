import { supabase } from "../lib/supabase";

const HARGA_PER_LITER = 15700;

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
      )
    `)
    .order("tanggal", { ascending: false });

  if (error) throw error;

  return data;
}

export async function addTransaksi(
  warga_id: number,
  periode_id: number,
  tanggal: string,
  liter: number
) {
  const harga = HARGA_PER_LITER;
  const total = harga * liter;

  const { error } = await supabase
    .from("transaksi")
    .insert([
      {
        warga_id,
        periode_id,
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
  tanggal: string,
  liter: number
) {
  const harga = HARGA_PER_LITER;
  const total = harga * liter;

  const { error } = await supabase
    .from("transaksi")
    .update({
      warga_id,
      periode_id,
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
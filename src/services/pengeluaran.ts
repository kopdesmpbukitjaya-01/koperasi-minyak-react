import { supabase } from "../lib/supabase";

// =====================================================
// AMBIL SEMUA DATA PENGELUARAN
// =====================================================

export async function getPengeluaran() {
  const { data, error } = await supabase
    .from("pengeluaran")
    .select("*")
    .order("tanggal", { ascending: false });

  if (error) throw error;

  return data;
}

// =====================================================
// TAMBAH PENGELUARAN
// =====================================================

export async function addPengeluaran(
  tanggal: string,
  periode_id: number | null,
  keterangan: string,
  jumlah: number
) {
  const { error } = await supabase
    .from("pengeluaran")
    .insert([
      {
        tanggal,
        periode_id,
        keterangan,
        jumlah,
      },
    ]);

  if (error) throw error;
}

// =====================================================
// UPDATE PENGELUARAN
// =====================================================

export async function updatePengeluaran(
  id: number,
  tanggal: string,
  periode_id: number | null,
  keterangan: string,
  jumlah: number
) {
  const { error } = await supabase
    .from("pengeluaran")
    .update({
      tanggal,
      periode_id,
      keterangan,
      jumlah,
    })
    .eq("id", id);

  if (error) throw error;
}

// =====================================================
// HAPUS PENGELUARAN
// =====================================================

export async function deletePengeluaran(id: number) {
  const { error } = await supabase
    .from("pengeluaran")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
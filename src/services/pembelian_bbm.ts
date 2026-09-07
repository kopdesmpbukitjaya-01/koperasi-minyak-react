import { supabase } from "../lib/supabase";

// =====================================================
// AMBIL SEMUA DATA PEMBELIAN BBM
// =====================================================

export async function getPembelianBBM() {
  const { data, error } = await supabase
    .from("pembelian_bbm")
    .select(`
      *,
      jenis_bbm (
        id,
        nama,
        harga
      )
    `)
    .order("tanggal_pembelian", { ascending: false });

  if (error) throw error;

  return data;
}

// =====================================================
// TAMBAH PEMBELIAN BBM
// =====================================================

export async function addPembelianBBM(
  tanggal_pembelian: string,
  jenis_bbm_id: number,
  jumlah_liter: number,
  harga_modal_per_liter: number,
  keterangan: string
) {
  const { error } = await supabase
    .from("pembelian_bbm")
    .insert([
      {
        tanggal_pembelian,
        jenis_bbm_id,
        jumlah_liter,
        harga_modal_per_liter,
        keterangan,
      },
    ]);

  if (error) throw error;
}

// =====================================================
// UPDATE PEMBELIAN BBM
// =====================================================

export async function updatePembelianBBM(
  id: number,
  tanggal_pembelian: string,
  jenis_bbm_id: number,
  jumlah_liter: number,
  harga_modal_per_liter: number,
  keterangan: string
) {
  const { error } = await supabase.rpc(
    "update_pembelian_bbm_dengan_periode",
    {
      p_id: id,
      p_tanggal_pembelian: tanggal_pembelian,
      p_jenis_bbm_id: jenis_bbm_id,
      p_jumlah_liter: jumlah_liter,
      p_harga_modal_per_liter: harga_modal_per_liter,
      p_keterangan: keterangan,
    }
  );

  if (error) throw error;
}

// =====================================================
// HAPUS PEMBELIAN BBM
// =====================================================

export async function deletePembelianBBM(id: number) {
  const { error } = await supabase
    .from("pembelian_bbm")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
import { supabase } from "../lib/supabase";


// Ambil daftar anggota koperasi
export async function getAnggotaKoperasi() {

  const { data, error } = await supabase
    .from("warga")
    .select("*")
    .eq("status", "Anggota")
    .order("nama", {
      ascending: true,
    });


  if (error) throw error;

  return data;
}



// Tambah simpanan
export async function addSimpanan(
  warga_id: number,
  tanggal_setor: string,
  simpanan_pokok: number,
  simpanan_wajib: number,
  simpanan_sukarela: number
) {

  const { data, error } = await supabase
    .from("simpanan_anggota")
    .insert([
      {
        warga_id,
        tanggal_setor,
        simpanan_pokok,
        simpanan_wajib,
        simpanan_sukarela,
      },
    ])
    .select();


  if (error) throw error;


  return data;

}



// Ambil rekap simpanan anggota
export async function getSimpananAnggota(
  warga_id: number
) {

  const { data, error } = await supabase
    .from("simpanan_anggota")
    .select(`
      *,
      warga (
        nama,
        no_kk,
        kode_warga
      )
    `)
    .eq("warga_id", warga_id)
    .order("tanggal_setor", {
      ascending: false,
    });


  if (error) throw error;


  return data;

}



// Update simpanan
export async function updateSimpanan(
  id: number,
  tanggal_setor: string,
  simpanan_pokok: number,
  simpanan_wajib: number,
  simpanan_sukarela: number
) {


  const { error } = await supabase
    .from("simpanan_anggota")
    .update({
      tanggal_setor,
      simpanan_pokok,
      simpanan_wajib,
      simpanan_sukarela,
    })
    .eq("id", id);


  if (error) throw error;


}



// Hapus simpanan
export async function deleteSimpanan(
  id: number
) {


  const { error } = await supabase
    .from("simpanan_anggota")
    .delete()
    .eq("id", id);


  if (error) throw error;


}
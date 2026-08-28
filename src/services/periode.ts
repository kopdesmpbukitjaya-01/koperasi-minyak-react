import { supabase } from "../lib/supabase";

// =========================
// GET PERIODE
// =========================
export async function getPeriode() {
  const { data, error } = await supabase
    .from("periode")
    .select(`
      *,
      jenis_bbm (
        id,
        nama
      )
    `)
    .order("id", { ascending: false });

  if (error) throw error;

  return data ?? [];
}


// =========================
// ADD PERIODE
// =========================
export async function addPeriode(
  nama_periode: string,
  jenis_bbm_id: number,
  kuota_liter: number,
  aktif: boolean
) {
  // Jika periode baru dijadikan aktif,
  // nonaktifkan periode aktif sebelumnya terlebih dahulu.
  if (aktif) {
    const { error: deactivateError } = await supabase
      .from("periode")
      .update({ aktif: false })
      .eq("aktif", true);

    if (deactivateError) {
      throw deactivateError;
    }
  }

  // Insert periode baru
  const { data, error } = await supabase
    .from("periode")
    .insert({
      nama_periode,
      jenis_bbm_id,
      kuota_liter,
      aktif,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}


// =========================
// UPDATE PERIODE
// =========================
export async function updatePeriode(
  id: number,
  nama_periode: string,
  jenis_bbm_id: number,
  kuota_liter: number,
  aktif: boolean
) {
  // Jika periode ini dijadikan aktif,
  // nonaktifkan periode aktif lainnya.
  if (aktif) {
    const { error: deactivateError } = await supabase
      .from("periode")
      .update({ aktif: false })
      .eq("aktif", true)
      .neq("id", id);

    if (deactivateError) throw deactivateError;
  }

  const { error } = await supabase
    .from("periode")
    .update({
      nama_periode,
      jenis_bbm_id,
      kuota_liter,
      aktif,
    })
    .eq("id", id);

  if (error) throw error;
}


// =========================
// DELETE PERIODE
// =========================
export async function deletePeriode(id: number) {
  const { error } = await supabase
    .from("periode")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
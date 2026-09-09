import { supabase } from "../lib/supabase";
import {
  simpanSemuaPeriodeOffline,
  ambilSemuaPeriodeOffline,
} from "./offline_db";

// =========================
// GET PERIODE
// =========================
export async function getPeriode() {
  try {
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

    const periode = data ?? [];

    // Simpan data periode terbaru ke IndexedDB
    await simpanSemuaPeriodeOffline(periode);

    return periode;
  } catch (error) {
    console.warn(
      "Tidak dapat mengambil data periode dari server. Menggunakan data lokal.",
      error
    );

    // Jika offline, gunakan data yang tersimpan di IndexedDB
    const periodeOffline = await ambilSemuaPeriodeOffline();

    if (periodeOffline.length === 0) {
      throw new Error(
        "Data periode belum tersedia secara offline. Buka aplikasi saat online terlebih dahulu."
      );
    }

    return periodeOffline.sort(
      (a, b) => Number(b.id) - Number(a.id)
    );
  }
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
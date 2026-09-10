import { supabase } from "../lib/supabase";
import {
  simpanSemuaJenisBBMOffline,
  ambilSemuaJenisBBMOffline,
} from "./offline_db";
export async function getJenisBBM() {
  try {
    const { data, error } = await supabase
      .from("jenis_bbm")
      .select("*")
      .order("id");

    console.log("DATA JENIS BBM =", data);
    console.log("ERROR JENIS BBM =", error);

    if (error) throw error;

    const jenisBBM = data ?? [];

    // Simpan data terbaru ke IndexedDB
    await simpanSemuaJenisBBMOffline(jenisBBM);

    return jenisBBM;
  } catch (error) {
    console.warn(
      "Tidak dapat mengambil Jenis BBM dari server. Menggunakan data lokal.",
      error
    );

    // Jika offline, gunakan data dari IndexedDB
    const jenisBBMOffline = await ambilSemuaJenisBBMOffline();

    if (jenisBBMOffline.length === 0) {
      throw new Error(
        "Data Jenis BBM belum tersedia secara offline. Buka aplikasi saat online terlebih dahulu."
      );
    }

    return jenisBBMOffline.sort(
      (a, b) => Number(a.id) - Number(b.id)
    );
  }
}
import { supabase } from "../lib/supabase";


export async function getWarga() {
  const { data, error } = await supabase
    .from("warga")
    .select("*");

  if (error) throw error;

  return (data ?? []).sort((a, b) => {
    const statusA = String(a.status ?? "").trim().toLowerCase();
    const statusB = String(b.status ?? "").trim().toLowerCase();

    const isAnggotaA = statusA === "anggota";
    const isAnggotaB = statusB === "anggota";

    // Anggota selalu di atas
    if (isAnggotaA && !isAnggotaB) {
      return -1;
    }

    if (!isAnggotaA && isAnggotaB) {
      return 1;
    }

    // Dalam kelompok yang sama, urut berdasarkan nama
    return String(a.nama ?? "").localeCompare(
      String(b.nama ?? ""),
      "id",
      { sensitivity: "base" }
    );
  });
}

export async function addWarga(
  no_kk: string,
  nama: string,
  status: string,
  alamat: string,
  no_hp: string
) {
  const { error } = await supabase
    .from("warga")
    .insert([
  {
    no_kk,
    nama,
    status,
    alamat,
    no_hp,
  },
])

  if (error) throw error;
}

export async function updateWarga(
  id: number,
  no_kk: string,
  nama: string,
  status: string,
  alamat: string,
  no_hp: string
) {
  const { error } = await supabase
    .from("warga")
    .update({
  no_kk,
  nama,
  status,
  alamat,
  no_hp,
})
    .eq("id", id);

  if (error) throw error;
}

export async function deleteWarga(id: number) {
  const { error } = await supabase
    .from("warga")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

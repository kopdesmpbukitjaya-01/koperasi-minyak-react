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
  const namaNormal = nama.trim().toLowerCase();
  const noKKNormal = no_kk.trim();

  // Cek apakah warga dengan Nama + No. KK yang sama sudah ada
  const { data: wargaSudahAda, error: cekError } = await supabase
    .from("warga")
    .select("id, kode_warga, nama, no_kk")
    .ilike("nama", namaNormal)
    .eq("no_kk", noKKNormal)
    .limit(1);

  if (cekError) throw cekError;

  // Jika sudah ada, jangan membuat record baru
  if (wargaSudahAda && wargaSudahAda.length > 0) {
    throw new Error(
      `Warga sudah terdaftar dengan kode ${wargaSudahAda[0].kode_warga}.`
    );
  }

  // Jika belum ada, simpan warga baru
  const { error } = await supabase
    .from("warga")
    .insert([
      {
        no_kk: noKKNormal,
        nama: nama.trim(),
        status,
        alamat,
        no_hp,
      },
    ]);

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
  const namaNormal = nama.trim().toLowerCase();
  const noKKNormal = no_kk.trim();

  // Cek apakah Nama + No. KK sudah dimiliki warga lain
  const { data: wargaSudahAda, error: cekError } = await supabase
    .from("warga")
    .select("id, kode_warga, nama, no_kk")
    .ilike("nama", namaNormal)
    .eq("no_kk", noKKNormal)
    .neq("id", id)
    .limit(1);

  if (cekError) throw cekError;

  // Jangan izinkan edit yang menghasilkan duplikat
  if (wargaSudahAda && wargaSudahAda.length > 0) {
    throw new Error(
      `Data tidak dapat diupdate. Nama dan No. KK tersebut sudah digunakan oleh ${wargaSudahAda[0].kode_warga}.`
    );
  }

  const { error } = await supabase
    .from("warga")
    .update({
      no_kk: noKKNormal,
      nama: nama.trim(),
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
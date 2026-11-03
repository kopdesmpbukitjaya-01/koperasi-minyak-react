import { supabase } from "../lib/supabase";
import {
  simpanSemuaWargaOffline,
  ambilSemuaWargaOffline,
} from "./offline_db";
export async function uploadFotoWarga(
file: File,
kodeWarga:string
){

const ext =
file.name.split(".").pop();


const fileName =
`${kodeWarga}-${Date.now()}.${ext}`;



const {error:uploadError}=await supabase
.storage
.from("foto-warga")
.upload(
fileName,
file,
{
cacheControl:"3600",
upsert:true
}
);



if(uploadError)
throw uploadError;



const {data}=supabase
.storage
.from("foto-warga")
.getPublicUrl(fileName);



return data.publicUrl;


}
export async function getWarga() {
  try {
    const { data, error } = await supabase
      .from("warga")
      .select("*");

    if (error) throw error;

    const warga = (data ?? []).sort((a, b) => {
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

    // Simpan data warga terbaru ke IndexedDB
    await simpanSemuaWargaOffline(warga);

    return warga;
  } catch (error) {
    console.warn(
      "Tidak dapat mengambil data warga dari server. Menggunakan data lokal.",
      error
    );

    // Jika offline, gunakan data yang tersimpan di IndexedDB
    const wargaOffline = await ambilSemuaWargaOffline();

    if (wargaOffline.length === 0) {
      throw new Error(
        "Data warga belum tersedia secara offline. Buka aplikasi saat online terlebih dahulu."
      );
    }

    return wargaOffline.sort((a, b) => {
      const statusA = String(a.status ?? "").trim().toLowerCase();
      const statusB = String(b.status ?? "").trim().toLowerCase();

      const isAnggotaA = statusA === "anggota";
      const isAnggotaB = statusB === "anggota";

      if (isAnggotaA && !isAnggotaB) {
        return -1;
      }

      if (!isAnggotaA && isAnggotaB) {
        return 1;
      }

      return String(a.nama ?? "").localeCompare(
        String(b.nama ?? ""),
        "id",
        { sensitivity: "base" }
      );
    });
  }
}
export async function addWarga(
  no_kk: string,
  nama: string,
  status: string,
  alamat: string,
  no_hp: string,
  foto: string = ""
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
    foto,
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
  no_hp: string,
  foto: string = ""
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


  if (wargaSudahAda && wargaSudahAda.length > 0) {

    throw new Error(
      `Data tidak dapat diupdate. Nama dan No. KK tersebut sudah digunakan oleh ${wargaSudahAda[0].kode_warga}.`
    );

  }



  const updateData:any = {

    no_kk: noKKNormal,
    nama: nama.trim(),
    status,
    alamat,
    no_hp,

  };


  // hanya update foto jika upload foto baru
  if(foto){

    updateData.foto = foto;

  }



  const { error } = await supabase

    .from("warga")

    .update(updateData)

    .eq("id", id);



  if(error) throw error;

}

export async function deleteWarga(id: number) {
  const { error } = await supabase
    .from("warga")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
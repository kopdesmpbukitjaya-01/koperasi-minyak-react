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
// Rekap semua anggota koperasi
export async function getRekapSemuaAnggota() {

  const { data, error } = await supabase
    .from("simpanan_anggota")
    .select(`
      id,
      simpanan_pokok,
      simpanan_wajib,
      simpanan_sukarela,
      warga (
        id,
        nama,
        kode_warga,
        no_kk
      )
    `)
    .order("id", {
      ascending: false,
    });


  if (error) throw error;


  return data;

}
// LOGIN PORTAL ANGGOTA
export async function getPortalAnggota(
  kode_warga:string,
  nama:string
){

const {data:warga,error:wargaError}=await supabase
.from("warga")
.select(`
id,
nama,
kode_warga,
no_kk
`)
.eq("kode_warga",kode_warga)
.ilike("nama",nama)
.eq("status","Anggota")
.single();


if(wargaError){

console.error(
"WARGA ERROR:",
wargaError
);

throw wargaError;

}


const {data:simpanan,error:simpananError}=await supabase
.from("simpanan_anggota")
.select(`
simpanan_pokok,
simpanan_wajib,
simpanan_sukarela
`)
.eq(
"warga_id",
warga.id
);



if(simpananError){

console.error(
"SIMPNAN ERROR:",
simpananError
);

throw simpananError;

}



let pokok=0;
let wajib=0;
let sukarela=0;



simpanan?.forEach((item:any)=>{


pokok += Number(
item.simpanan_pokok || 0
);


wajib += Number(
item.simpanan_wajib || 0
);


sukarela += Number(
item.simpanan_sukarela || 0
);


});



return {

id:warga.id,

kode_warga:warga.kode_warga,

nama:warga.nama,

pokok,

wajib,

sukarela,

shu:""

};


}
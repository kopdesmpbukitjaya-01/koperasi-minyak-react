import { supabase } from "../lib/supabase";


// ambil struktur organisasi aktif
export async function getStrukturOrganisasi(
  tahun:number
){

const {data,error}=await supabase
.from("struktur_organisasi")
.select(`
  id,
  tahun,
  jabatan,
  kategori,
  aktif,
  warga_id,
  warga (
    nama,
    no_kk,
    kode_warga
  )
`)
.eq("tahun",tahun)
.eq("aktif",true)
.order("id");


if(error)
throw error;


return data;

}



// simpan struktur organisasi
export async function simpanStrukturOrganisasi(
data:any[]
){

const {error}=await supabase
.from("struktur_organisasi")
.insert(data);


if(error)
throw error;


return true;

}



// nonaktifkan struktur lama
export async function nonaktifkanStruktur(
tahun:number
){

const {error}=await supabase
.from("struktur_organisasi")
.update({
aktif:false
})
.eq("tahun",tahun);


if(error)
throw error;


return true;

}
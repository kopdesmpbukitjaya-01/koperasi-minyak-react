import { supabase } from "../lib/supabase";


// Ambil daftar anggota koperasi
export async function getAnggotaKoperasi() {

  const { data, error } = await supabase
    .from("warga")
    .select("*")
    .in(
  "status",
  [
    "Anggota",
    "Pengurus",
    "Pengawas"
  ]
)
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

console.log("MASUK GET PORTAL ANGGOTA");


const {data:warga,error:wargaError}=await supabase
.from("warga")
.select(`
id,
nama,
kode_warga,
no_kk,
status
`)
.eq(
"kode_warga",
kode_warga
)
.ilike(
"nama",
`%${nama}%`
)
.in(
"status",
[
"Anggota",
"Pengurus",
"Pengawas"
]
)
.single();



if(wargaError){

console.error(
"WARGA ERROR",
wargaError
);

throw wargaError;

}


// ===============================
// SIMPANAN
// ===============================


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



if(simpananError)
throw simpananError;



let pokok=0;
let wajib=0;
let sukarela=0;



simpanan?.forEach((item:any)=>{

pokok += Number(item.simpanan_pokok || 0);

wajib += Number(item.simpanan_wajib || 0);

sukarela += Number(item.simpanan_sukarela || 0);

});



// ===============================
// SHU ANGGOTA
// ===============================
let shuJasa = 0;
let shuSimpanan = 0;
let shuPengurus = 0;
let shuPengawas = 0;
let tahunSHU = null;

const {data:shuAnggotaData,error:shuAnggotaError}=await supabase
.from("shu_anggota")
.select(`
shu,
shu_jasa,
shu_simpanan,
tahun,
warga_id
`)
.eq(
"warga_id",
warga.id
)
.order(
"tahun",
{
ascending:false
}
)
.limit(1);


console.log(
"DATA SHU ANGGOTA:",
shuAnggotaData
);



console.log(
"ERROR SHU ANGGOTA:",
shuAnggotaError
);



if(
shuAnggotaData &&
shuAnggotaData.length > 0
){


const shuData = shuAnggotaData[0];



shuJasa =
Number(
shuData.shu_jasa || 0
);


shuSimpanan =
Number(
shuData.shu_simpanan || 0
);


tahunSHU =
shuData.tahun;


}
console.log(
"CEK DETAIL SHU PORTAL:",
{
nama:warga.nama,
shuJasa,
shuSimpanan,
shuPengurus,
shuPengawas,
tahunSHU
}
);
// ===============================
// SHU PENGURUS / PENGAWAS
// ===============================


console.log(
"CEK STATUS STRUKTUR:",
{
nama:warga.nama,
status:warga.status
}
);


if(
warga.status==="Pengurus" ||
warga.status==="Pengawas"
){


const {data:shuStrukturData,error:shuStrukturError}=await supabase
.from("shu_pengurus_pengawas")
.select(`
kategori,
jabatan,
shu,
tahun,
nama
`)
.eq(
"nama",
warga.nama
)
.eq(
"tahun",
2026
)
.order(
"id",
{
ascending:false
}
)
.limit(1);



console.log(
"DATA SHU STRUKTUR:",
shuStrukturData
);
console.log(
"CEK JUMLAH STRUKTUR:",
shuStrukturData?.length
);


if(shuStrukturError){

console.log(
"ERROR SHU STRUKTUR:",
shuStrukturError
);

}



if(
shuStrukturData &&
shuStrukturData.length > 0
){


const struktur =
shuStrukturData[0];



console.log(
"STRUKTUR TERPILIH:",
struktur
);



if(
struktur.kategori==="Pengurus"
){

shuPengurus =
Number(
struktur.shu || 0
);

console.log(
"SET SHU PENGURUS:",
shuPengurus
);

}


if(
struktur.kategori==="Pengawas"
){

shuPengawas =
Number(
struktur.shu || 0
);

console.log(
"SET SHU PENGAWAS:",
shuPengawas
);

}


}



}




// ===============================
// TOTAL SHU
// ===============================

const totalSHU =
shuJasa
+
shuSimpanan
+
shuPengurus
+
shuPengawas;

console.log(
"CEK SEBELUM RETURN:",
{
nama:warga.nama,
shuJasa,
shuSimpanan,
shuPengurus,
shuPengawas,
totalSHU
}
);
return {

id:warga.id,

nama:warga.nama,

kode_warga:warga.kode_warga,

status:warga.status,

pokok,

wajib,

sukarela,

shu_jasa:shuJasa,

shu_simpanan:shuSimpanan,

shu_pengurus:shuPengurus,

shu_pengawas:shuPengawas,

total_shu:totalSHU,

tahunSHU

};

}

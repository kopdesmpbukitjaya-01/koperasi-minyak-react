import { supabase } from "../lib/supabase";


export async function getAlokasiSHU(
tahun:number
){

const {data,error}=await supabase
.from("alokasi_shu")
.select("*")
.eq("tahun",tahun)
.single();


if(error)
throw error;


return data;

}



export async function simpanAlokasiSHU(
data:any
){

const {error}=await supabase
.from("alokasi_shu")
.upsert(
data,
{
onConflict:"tahun"
}
);


if(error)
throw error;


return true;

}
// ============================
// RESET PEMBAGIAN SHU
// ============================

export async function resetPembagianSHU(
tahun:number
){

// hapus SHU anggota
const {error:errorAnggota}=await supabase
.from("shu_anggota")
.delete()
.eq("tahun",tahun);


if(errorAnggota)
throw errorAnggota;


// hapus SHU pengurus
const {error:errorPengurus}=await supabase
.from("shu_pengurus")
.delete()
.eq("tahun",tahun);


if(errorPengurus)
throw errorPengurus;


// hapus SHU pengurus & pengawas
const {error:errorPengurusPengawas}=await supabase
.from("shu_pengurus_pengawas")
.delete()
.eq("tahun",tahun);


if(errorPengurusPengawas)
throw errorPengurusPengawas;


return true;

}
// ============================
// RESET PERSENTASE ALOKASI SHU
// ============================

export async function resetAlokasiSHU(
tahun:number
){

const {error}=await supabase
.from("alokasi_shu")
.update({

cadangan:0,

jasa_anggota:0,

jasa_pengurus:0,

jasa_pengawas:0,

dana_pendidikan:0,

dana_sosial:0,

dana_pembangunan:0

})
.eq(
"tahun",
tahun
);


if(error)
throw error;


return true;

}

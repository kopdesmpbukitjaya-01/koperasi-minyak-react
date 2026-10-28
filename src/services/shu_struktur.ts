import { supabase } from "../lib/supabase";


export async function simpanSHUStruktur(
data:any[],
tahun:number
){

// hapus data tahun tersebut dulu
const {error:deleteError}=await supabase
.from("shu_pengurus_pengawas")
.delete()
.eq("tahun",tahun);


if(deleteError)
throw deleteError;



const insertData =
data.map((item:any)=>({

struktur_id:item.id,

tahun,

kategori:item.kategori,

nama:item.nama,

jabatan:item.jabatan,

shu:item.shu

}));



const {error}=await supabase
.from("shu_pengurus_pengawas")
.insert(insertData);



if(error)
throw error;


return true;

}
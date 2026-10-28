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
import { supabase } from "../lib/supabase";


// Ambil semua laporan RAT
export async function getLaporanRat(){

const {data,error}=await supabase
.from("laporan_rat")
.select("*")
.order("tahun",{
ascending:false
});


if(error) throw error;


return data;

}



// Tambah laporan RAT
export async function addLaporanRat(
data:any
){

const {data:hasil,error}=await supabase
.from("laporan_rat")
.insert([
data
])
.select();


if(error) throw error;


return hasil;

}



// Update laporan RAT
export async function updateLaporanRat(
id:number,
data:any
){

const {error}=await supabase
.from("laporan_rat")
.update(data)
.eq("id",id);


if(error) throw error;


}



// Hapus laporan RAT
export async function deleteLaporanRat(
id:number
){

const {error}=await supabase
.from("laporan_rat")
.delete()
.eq("id",id);


if(error) throw error;


}
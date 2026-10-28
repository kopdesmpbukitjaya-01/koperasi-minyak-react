import { supabase } from "../lib/supabase";


export async function getPembagianSHUPengurus(
totalSHU:number,
tahun:number
){


const {data:alokasi,error:alokasiError}=await supabase
.from("alokasi_shu")
.select("*")
.eq(
"tahun",
tahun
)
.single();


if(alokasiError)
throw alokasiError;



const {data:struktur,error}=await supabase
.from("struktur_organisasi")
.select(`
id,
nama,
jabatan,
kategori
`)
.eq(
"tahun",
tahun
)
.eq(
"aktif",
true
);



if(error)
throw error;



const pengurus =
struktur?.filter(
(item:any)=>
item.kategori==="Pengurus"
)
|| [];



const totalJasaPengurus =
totalSHU *
(
Number(alokasi.jasa_pengurus)
/100
);



const nilaiPerOrang =
pengurus.length
?
totalJasaPengurus / pengurus.length
:
0;



return pengurus.map(
(item:any)=>({

id:item.id,

nama:item.nama,

jabatan:item.jabatan,

kategori:item.kategori,

shu:nilaiPerOrang

})
);


}





export async function getPembagianSHUPengawas(
totalSHU:number,
tahun:number
){


const {data:alokasi,error:alokasiError}=await supabase
.from("alokasi_shu")
.select("*")
.eq(
"tahun",
tahun
)
.single();



if(alokasiError)
throw alokasiError;



const {data:struktur,error}=await supabase
.from("struktur_organisasi")
.select(`
id,
nama,
jabatan,
kategori
`)
.eq(
"tahun",
tahun
)
.eq(
"aktif",
true
);



if(error)
throw error;



const pengawas =
struktur?.filter(
(item:any)=>
item.kategori==="Pengawas"
)
|| [];



const totalJasaPengawas =
totalSHU *
(
Number(alokasi.jasa_pengawas)
/100
);



const nilaiPerOrang =
pengawas.length
?
totalJasaPengawas / pengawas.length
:
0;



return pengawas.map(
(item:any)=>({

id:item.id,

nama:item.nama,

jabatan:item.jabatan,

kategori:item.kategori,

shu:nilaiPerOrang

})
);


}
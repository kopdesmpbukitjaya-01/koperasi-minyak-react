import { supabase } from "../lib/supabase";


export async function getPembagianSHUAnggota(
totalSHUAnggota:number,
tahun:number
){


const {data:anggota,error}=await supabase
.from("warga")
.select(`
id,
nama,
no_kk,
status
`)
.in(
"status",
[
"Anggota",
"Pengurus",
"Pengawas"
]
);



if(error)
throw error;

const {data:alokasi,error:alokasiError}=await supabase
.from("alokasi_shu")
.select("*")
.eq("tahun",tahun)
.single();


if(alokasiError)
throw alokasiError;

const {data:simpanan}=await supabase
.from("simpanan_anggota")
.select(`
warga_id,
simpanan_pokok,
simpanan_wajib,
simpanan_sukarela
`);



const {data:transaksi}=await supabase
.from("transaksi")
.select(`
warga_id,
total
`);



const totalSimpanan =
simpanan?.reduce(
(a,b)=>
a+
Number(b.simpanan_pokok||0)+
Number(b.simpanan_wajib||0)+
Number(b.simpanan_sukarela||0)
,0
)||0;



const totalTransaksi =
transaksi?.reduce(
(a,b)=>
a+
Number(b.total||0)
,0
)||0;



return anggota?.map((item:any)=>{


const simpananAnggota =
simpanan
?.filter(
(s:any)=>s.warga_id===item.id
)
.reduce(
(a,b)=>
a+
Number(b.simpanan_pokok||0)+
Number(b.simpanan_wajib||0)+
Number(b.simpanan_sukarela||0)
,0
)||0;



const transaksiAnggota =
transaksi
?.filter(
(t:any)=>t.warga_id===item.id
)
.reduce(
(a,b)=>
a+
Number(b.total||0)
,0
)||0;



const totalJasaAnggota =
totalSHUAnggota *
(Number(alokasi.jasa_anggota)/100);


const bagianSimpanan =
totalJasaAnggota *
0.5;


const bagianTransaksi =
totalJasaAnggota *
0.5;



const jasaModal =
totalSimpanan
?
(simpananAnggota/totalSimpanan)
*
bagianSimpanan
:
0;



const jasaUsaha =
totalTransaksi
?
(transaksiAnggota/totalTransaksi)
*
bagianTransaksi
:
0;



return {

id:item.id,

nama:item.nama,

status:item.status,

simpanan:simpananAnggota,

transaksi:transaksiAnggota,

shu:
jasaModal+jasaUsaha

};



});


}
export async function simpanSHUAnggota(
tahun:number,
data:any[]
){

const insertData = data.map((item:any)=>({

warga_id:item.id,

tahun,

shu:item.shu

}));


const {error}=await supabase
.from("shu_anggota")
.insert(insertData);


if(error)
throw error;


return true;

}
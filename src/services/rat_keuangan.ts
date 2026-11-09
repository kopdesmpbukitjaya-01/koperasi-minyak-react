import { supabase } from "../lib/supabase";


export async function getRingkasanRat(){


// ============================
// JUMLAH ANGGOTA
// ============================

const {count:jumlahAnggota,error:anggotaError}
=
await supabase
.from("warga")
.select(
"id",
{
count:"exact",
head:true
}
)
.in(
"status",
[
"Anggota",
"Pengurus",
"Pengawas"
]
);


if(anggotaError)
throw anggotaError;




// ============================
// SIMPANAN ANGGOTA
// ============================


const {data:simpanan,error:simpananError}
=
await supabase
.from("simpanan_anggota")
.select(`
simpanan_pokok,
simpanan_wajib,
simpanan_sukarela
`);



if(simpananError)
throw simpananError;



let totalPokok = 0;
let totalWajib = 0;
let totalSukarela = 0;



simpanan?.forEach((item:any)=>{


totalPokok += Number(
item.simpanan_pokok || 0
);


totalWajib += Number(
item.simpanan_wajib || 0
);


totalSukarela += Number(
item.simpanan_sukarela || 0
);


});




// ============================
// USAHA BBM
// ============================


const {data:transaksi,error:transaksiError}
=
await supabase
.from("transaksi")
.select(`
liter,
total,
jenis_bbm_id
`);


if(transaksiError)
throw transaksiError;



const {data:dataPembelian,error:pembelianError}
=
await supabase
.from("pembelian_bbm")
.select(`
jenis_bbm_id,
harga_modal_per_liter,
jumlah_liter,
tanggal_pembelian
`)
.order(
"tanggal_pembelian",
{
 ascending:false
}
);


if(pembelianError)
throw pembelianError;



let omzetPenjualan = 0;
let modalBBM = 0;



for(const item of transaksi || []){


const modal =
dataPembelian
?.filter(
(p:any)=>
Number(p.jenis_bbm_id)
===
Number(item.jenis_bbm_id)
)
[0];


const hargaModal =
Number(
modal?.harga_modal_per_liter || 0
);

console.log(
"CEK MODAL BBM",
{
jenis:item.jenis_bbm_id,
modal,
hargaModal
}
);

const hargaJual =
Number(
item.total || 0
)
/
Number(
item.liter || 1
);

console.log(
"DETAIL LABA BBM",
{
bbm:item.jenis_bbm_id,
liter:item.liter,
total:item.total,
hargaJual,
hargaModal,
laba:
Number(item.liter) *
(hargaJual-hargaModal)
}
);

omzetPenjualan += Number(
item.total || 0
);



modalBBM +=

Number(item.liter || 0)

*

hargaModal;



}



const labaKotor =
omzetPenjualan -
modalBBM;
(
dataPembelian?.reduce(
(total,item)=>{

return total +
(
Number(item.harga_modal_per_liter || 0)
*
Number(item.jumlah_liter || 0)
);

},0
) || 0
);





// ============================
// PENGELUARAN
// ============================


const {data:pengeluaran,error:pengeluaranError}
=
await supabase
.from("pengeluaran")
.select(`
jumlah
`);



if(pengeluaranError)
throw pengeluaranError;



let totalPengeluaran = 0;



pengeluaran?.forEach((item:any)=>{


totalPengeluaran += Number(
item.jumlah || 0
);


});



const shuBersih =
labaKotor - totalPengeluaran;
console.log(
"DEBUG RAT KEUANGAN",
{
 omzetPenjualan,
 modalBBM,
 totalPengeluaran,
 transaksi,
 dataPembelian
}
);

console.log("OMZET :", omzetPenjualan);
console.log("MODAL BBM :", modalBBM);
console.log("PENGELUARAN :", totalPengeluaran);
console.log("LABA KOTOR :", labaKotor);
console.log("SHU BERSIH :", shuBersih);



return {


jumlahAnggota:
jumlahAnggota || 0,


simpananPokok:
totalPokok,


simpananWajib:
totalWajib,


simpananSukarela:
totalSukarela,



// USAHA

omzetPenjualan,

modalBBM,


labaKotor,



// BIAYA

pengeluaran:
totalPengeluaran,


// SHU

shuBersih


};


}
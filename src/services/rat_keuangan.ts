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
.eq(
"status",
"Anggota"
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
harga_modal_per_liter
`);


if(pembelianError)
throw pembelianError;



let omzetPenjualan = 0;
let totalModalBBM = 0;



for(const item of transaksi || []){


omzetPenjualan += Number(
item.total || 0
);



const modal =
dataPembelian?.find(
(p:any)=>
p.jenis_bbm_id === item.jenis_bbm_id
);



const hargaModal =
Number(
modal?.harga_modal_per_liter || 0
);



totalModalBBM +=

Number(item.liter || 0)

*

hargaModal;



}



const labaKotor =
omzetPenjualan - totalModalBBM;





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


console.log("OMZET :", omzetPenjualan);
console.log("MODAL BBM :", totalModalBBM);
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

totalModalBBM,

labaKotor,



// BIAYA

pengeluaran:
totalPengeluaran,


// SHU

shuBersih


};


}
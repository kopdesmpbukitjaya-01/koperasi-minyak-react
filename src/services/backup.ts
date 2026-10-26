import { supabase } from "../lib/supabase";


export async function getBackupData(){

const warga =
await supabase
.from("warga")
.select("*");


const transaksi =
await supabase
.from("transaksi")
.select(`
*,
warga(
nama,
no_kk
),
periode(
nama_periode
),
jenis_bbm(
nama
)
`);


const pembelian =
await supabase
.from("pembelian_bbm")
.select(`
*,
jenis_bbm(
nama
)
`);


const pengeluaran =
await supabase
.from("pengeluaran")
.select("*");


const simpanan =
await supabase
.from("simpanan_anggota")
.select("*");


const rat =
await supabase
.from("laporan_rat")
.select("*");



return {

warga:warga.data || [],

transaksi:transaksi.data || [],

pembelian:pembelian.data || [],

pengeluaran:pengeluaran.data || [],

simpanan:simpanan.data || [],

rat:rat.data || []

};


}
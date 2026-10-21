import { supabase } from "../lib/supabase";


// ===============================
// JUMLAH ANGGOTA KOPERASI
// ===============================
export async function getJumlahAnggota() {

  const { count, error } = await supabase
    .from("warga")
    .select("*", {
      count: "exact",
      head: true
    })
    .eq("status", "Anggota");


  if (error) throw error;


  return count || 0;

}



// ===============================
// REKAP PENJUALAN BBM PER PERIODE
// ===============================
export async function getRekapPenjualanBBM() {


  const { data, error } = await supabase
    .from("periode")
    .select(`
      id,
      nama_periode,
      kuota_liter,
      jenis_bbm (
        nama
      ),
      transaksi (
        tanggal,
        liter,
        total
      )
    `)
    .order("id", {
      ascending: true
    });



  if (error) {

    console.error(
      "Gagal mengambil rekap penjualan BBM",
      error
    );

    throw error;

  }



  return data.map((item:any)=>{


    const totalTerjual =
      item.transaksi?.reduce(
        (sum:number, trx:any)=>
          sum + Number(trx.liter || 0),
        0
      ) || 0;



    const jumlah =
      item.transaksi?.reduce(
        (sum:number, trx:any)=>
          sum + Number(trx.total || 0),
        0
      ) || 0;



    return {


      periode:
      item.nama_periode || "-",


      tanggal:
      item.transaksi?.[0]?.tanggal || "-",


      jenis:
      item.jenis_bbm?.nama || "-",


      jumlahLiter:
      Number(item.kuota_liter || 0),


      terjual:
      totalTerjual,


      sisa:
      Number(item.kuota_liter || 0)
      -
      totalTerjual,


      jumlah

    };


  });


}



// ===============================
// TOTAL PENJUALAN PERTALITE
// ===============================
export async function getTotalPertalite(){


  const data =
    await getRekapPenjualanBBM();


  return data
    .filter(
      item =>
      item.jenis === "Pertalite"
    )
    .reduce(
      (sum,item)=>
      sum + item.terjual,
      0
    );

}



// ===============================
// TOTAL PENJUALAN PERTAMAX
// ===============================
export async function getTotalPertamax(){


  const data =
    await getRekapPenjualanBBM();


  return data
    .filter(
      item =>
      item.jenis === "Pertamax"
    )
    .reduce(
      (sum,item)=>
      sum + item.terjual,
      0
    );

}



// ===============================
// LABA BERSIH
// Penjualan - Modal BBM - Pengeluaran
// ===============================
export async function getLabaBersih() {

  // Total Penjualan
  const { data: transaksi, error: errorTransaksi } =
    await supabase
      .from("transaksi")
      .select("total");

  if (errorTransaksi) throw errorTransaksi;

  const totalPenjualan =
    transaksi?.reduce(
      (sum, item) => sum + Number(item.total || 0),
      0
    ) || 0;


  // Total Modal BBM
  const {
    data: pembelian,
    error: errorPembelian
  } = await supabase
    .from("pembelian_bbm")
    .select("total_modal");

  if (errorPembelian) throw errorPembelian;

  const totalModal =
    pembelian?.reduce(
      (sum, item) =>
        sum + Number(item.total_modal || 0),
      0
    ) || 0;


  // Total Pengeluaran
  const {
    data: pengeluaran,
    error: errorPengeluaran
  } = await supabase
    .from("pengeluaran")
    .select("jumlah");

  if (errorPengeluaran) throw errorPengeluaran;

  const totalPengeluaran =
    pengeluaran?.reduce(
      (sum, item) =>
        sum + Number(item.jumlah || 0),
      0
    ) || 0;


  return (
    totalPenjualan -
    totalModal -
    totalPengeluaran
  );
}

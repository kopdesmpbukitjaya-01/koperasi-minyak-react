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
    .in(
      "status",
      [
        "Anggota",
        "Pengurus",
        "Pengawas"
      ]
    );


  if (error) {

    console.error(
      "ERROR WARGA PUBLIC:",
      error.message,
      error.details,
      error.hint
    );

    throw error;

  }


  console.log(
    "TOTAL ANGGOTA KOPERASI:",
    count
  );


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
 ascending:false
})



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

// ===============================
// LABA USAHA
// Laba Penjualan BBM - Pengeluaran
// ===============================
export async function getLabaBersih() {

  


  // Ambil transaksi BBM yang sudah terjual
  const { data: transaksi, error: transaksiError } =
    await supabase
      .from("transaksi")
      .select(`
        liter,
        total,
        jenis_bbm_id
      `);


  if (transaksiError)
    throw transaksiError;



  // Ambil harga modal berdasarkan jenis BBM
  const { data: pembelian, error: pembelianError } =
    await supabase
      .from("pembelian_bbm")
      .select(`
        jenis_bbm_id,
        harga_modal_per_liter
      `);


  if (pembelianError)
    throw pembelianError;



  let totalPenjualan = 0;
  let totalModalTerjual = 0;



  (transaksi || []).forEach((trx:any)=>{


    const liter =
      Number(trx.liter || 0);


    totalPenjualan +=
      Number(trx.total || 0);



    const modal =
      pembelian?.find(
        (item:any)=>
          item.jenis_bbm_id === trx.jenis_bbm_id
      );


    totalModalTerjual +=
      liter *
      Number(
        modal?.harga_modal_per_liter || 0
      );


  });



  // Ambil pengeluaran koperasi
  const {
    data: pengeluaran,
    error: pengeluaranError
  } =
    await supabase
      .from("pengeluaran")
      .select("jumlah");


  if (pengeluaranError)
    throw pengeluaranError;



  const totalPengeluaran =
    (pengeluaran || [])
      .reduce(
        (sum,item)=>
          sum + Number(item.jumlah || 0),
        0
      );



  const labaUsaha =
    totalPenjualan -
    totalModalTerjual -
    totalPengeluaran;

return labaUsaha;

}

  

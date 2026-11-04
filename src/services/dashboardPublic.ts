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
let semuaTransaksi:any[] = [];

let offset = 0;
const limit = 1000;

while (true) {

  const {
    data,
    error
  } = await supabase
    .from("transaksi")
    .select(`
      tanggal,
      liter,
      total,
      jenis_bbm_id
    `)
    .range(offset, offset + limit - 1);


  if (error)
    throw error;


  if (!data || data.length === 0)
    break;


  semuaTransaksi.push(...data);


  if (data.length < limit)
    break;


  offset += limit;

}


const transaksi = semuaTransaksi;


console.log(
  "TOTAL TRANSAKSI SEMUA:",
  transaksi.length
);
    console.log(
  "JUMLAH TRANSAKSI DARI SUPABASE:",
  transaksi?.length
);


const cekPertalite =
(transaksi || [])
.filter(
(item:any)=>item.jenis_bbm_id === 3
)
.reduce(
(sum:number,item:any)=>
sum + Number(item.liter || 0),
0
);


console.log(
  "PERTALITE DARI SERVICE:",
  cekPertalite
);
console.log(
  "TOTAL DATA TRANSAKSI:",
  transaksi?.length
);


console.log(
  "TOTAL LITER PERTALITE:",
  (transaksi || [])
    .filter(
      (item:any)=> item.jenis_bbm_id === 3
    )
    .reduce(
      (sum:number,item:any)=>
        sum + Number(item.liter || 0),
      0
    )
);




console.log(
  "========================================"
);

  // Ambil harga modal berdasarkan jenis BBM
  const {
  data: pembelian,
  error: pembelianError
} =
  await supabase
    .from("pembelian_bbm")
    .select(`
      tanggal_pembelian,
      jenis_bbm_id,
      harga_modal_per_liter
    `);


if (pembelianError)
  throw pembelianError;


  if (pembelianError)
    throw pembelianError;

console.log(
  "========== CEK MODAL BBM =========="
);

console.table(
  pembelian
);

console.log(
  "=================================="
);

  let totalPenjualan = 0;
  let totalModalTerjual = 0;



  (transaksi || []).forEach((trx:any)=>{




const liter =
Number(trx.liter || 0);


totalPenjualan +=
Number(trx.total || 0);





    const modal =
pembelian
?.filter(
(item:any)=>
item.jenis_bbm_id === trx.jenis_bbm_id &&
new Date(item.tanggal_pembelian) <=
new Date(trx.tanggal)
)
.sort(
(a:any,b:any)=>
new Date(b.tanggal_pembelian).getTime()
-
new Date(a.tanggal_pembelian).getTime()
)[0];

    const modalTerpakai =
  liter *
  Number(
    modal?.harga_modal_per_liter || 0
  );


console.log(
  "DETAIL HITUNG MODAL",
  {
    tanggal: trx.tanggal,
    jenis: trx.jenis_bbm_id,
    liter: liter,
    hargaModal: modal?.harga_modal_per_liter,
    totalModal: modalTerpakai
  }
);


totalModalTerjual += modalTerpakai;
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

console.log(
"TOTAL LITER TERJUAL:",
(transaksi || [])
.reduce(
(sum:any,item:any)=>
sum + Number(item.liter || 0),
0
)
);


const labaUsaha =
  totalPenjualan -
  totalModalTerjual -
  totalPengeluaran;


console.log(
  "TOTAL PENJUALAN:",
  totalPenjualan
);


console.log(
  "TOTAL MODAL TERJUAL:",
  totalModalTerjual
);


console.log(
  "TOTAL PENGELUARAN:",
  totalPengeluaran
);


console.log(
  "LABA BERSIH:",
  labaUsaha
);



return labaUsaha;

}

  

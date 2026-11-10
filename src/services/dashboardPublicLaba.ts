import { supabase } from "../lib/supabase";


export async function getLabaDashboardBBM() {

  try {

    // total penjualan BBM
    const { data: transaksi, error } =
      await supabase
        .from("transaksi")
        .select(`
          total,
          liter,
          jenis_bbm(
            harga
          )
        `);


    if (error) {
      throw error;
    }


    let totalPenjualan = 0;
    let totalModal = 0;


    transaksi?.forEach((item:any)=>{


      const harga =
        Number(
          item.jenis_bbm?.harga || 0
        );


      const liter =
        Number(
          item.liter || 0
        );


      const total =
        Number(
          item.total || 0
        );


      totalPenjualan += total;


      totalModal +=
        liter * harga;


    });



    const labaKotor =
      totalPenjualan -
      totalModal;



    // sementara pengeluaran ambil dari tabel pengeluaran
    const { data: pengeluaran } =
      await supabase
      .from("pengeluaran")
      .select("jumlah");


    const totalPengeluaran =
      pengeluaran?.reduce(
        (
          total,
          item:any
        ) =>
          total +
          Number(
            item.jumlah || 0
          ),
        0
      ) || 0;



    const labaBersih =
      labaKotor -
      totalPengeluaran;



    return {

      totalPenjualan,

      totalModalTerjual:
        totalModal,

      totalPengeluaran,

      labaKotor,

      labaBersih

    };


  } catch(error){

    console.error(
      "Gagal mengambil laba dashboard:",
      error
    );


    return {

      totalPenjualan:0,
      totalModalTerjual:0,
      totalPengeluaran:0,
      labaKotor:0,
      labaBersih:0

    };

  }

}
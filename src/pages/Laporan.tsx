import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import logo from "../assets/logo_crop.png";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
  getPeriode
} from "../services/periode";

import {
  getLaporan,
  getLabaRugi
} from "../services/laporan";


  export default function Laporan() {
  const navigate = useNavigate();

  // ==============================
  // STATE
  // ==============================

  const [periode, setPeriode] = useState<any[]>([]);
  const [periodeId, setPeriodeId] = useState("");

  const [data, setData] = useState<any[]>([]);

  const [petugas, setPetugas] = useState("");

  const [labaRugi, setLabaRugi] = useState<any>(null);


  // ==============================
  // LOAD AWAL
  // ==============================

  useEffect(() => {
    loadPeriode();
  }, []);



  // ==============================
  // AMBIL DATA PERIODE
  // ==============================

  async function loadPeriode() {

    try {

      const hasil = await getPeriode();

      setPeriode(hasil);

    } catch (err) {

      console.error(err);

      alert(
        "Gagal memuat data periode."
      );

    }

  }



  // ==============================
  // TAMPILKAN LAPORAN
  // ==============================

  async function tampilkan() {


    if (!periodeId) {

      alert(
        "Silakan pilih periode."
      );

      return;

    }


    try {


      const hasil =
        await getLaporan(
          Number(periodeId)
        );


      const hasilLabaRugi =
        await getLabaRugi(
          Number(periodeId)
        );



      setData(hasil);


      setLabaRugi(
        hasilLabaRugi
      );



      if (hasil.length === 0) {

        alert(
          "Tidak ada data pada periode ini."
        );

      }


    } catch (err) {


      console.error(err);


      alert(
        "Gagal mengambil data laporan."
      );


    }

  }



  // =====================================================
  // DOWNLOAD PDF
  // =====================================================


  async function downloadPdf() {


    if (!periodeId) {


      alert(
        "Silakan pilih periode terlebih dahulu."
      );


      return;


    }



    try {


      const hasil =
        await getLaporan(
          Number(periodeId)
        );



      const hasilLabaRugi =
        await getLabaRugi(
          Number(periodeId)
        );



      if (
        !hasil ||
        hasil.length === 0
      ) {


        alert(
          "Tidak ada data pada periode ini."
        );


        return;


      }



      const doc =
        new jsPDF(
          "p",
          "mm",
          "a4"
        );



      const namaPeriode =
        hasil[0]?.periode?.nama_periode || "-";



      const namaBBM =
        hasil[0]?.periode?.jenis_bbm?.nama || "-";



      const kuotaLiter =
        Number(
          hasil[0]?.periode?.kuota_liter || 0
        );



      let totalLiter = 0;

      let totalRupiah = 0;



      hasil.forEach(
        (item:any)=>{


          totalLiter +=
            Number(item.liter) || 0;


          totalRupiah +=
            Number(item.total) || 0;


        }
      );



      const sisaKuota =
        kuotaLiter -
        totalLiter;



      const totalPenjualan =
        Number(
          hasilLabaRugi.totalPenjualan
        ) || 0;



      const totalModal =
        Number(
          hasilLabaRugi.totalModal
        ) || 0;



      const labaKotor =
        Number(
          hasilLabaRugi.labaKotor
        ) || 0;



      const totalPengeluaran =
        Number(
          hasilLabaRugi.totalPengeluaran
        ) || 0;



      const labaBersih =
        Number(
          hasilLabaRugi.labaBersih
        ) || 0;



      const pengeluaran =
        hasilLabaRugi.pengeluaran || [];
              // =====================================================
      // LOAD LOGO
      // =====================================================

      const logoImg = new Image();


      await new Promise<void>(
        (resolve, reject) => {

          logoImg.onload = () =>
            resolve();


          logoImg.onerror = () =>
            reject(
              new Error(
                "Logo gagal dimuat"
              )
            );


          logoImg.src = logo;

        }
      );



      // =====================================================
      // HALAMAN 1 - HEADER
      // =====================================================


      doc.addImage(
        logoImg,
        "PNG",
        18,
        6,
        24,
        24
      );



      doc.setFont(
        "helvetica",
        "bold"
      );


      doc.setFontSize(17);


      doc.text(
        "KOPERASI DESA MERAH PUTIH",
        105,
        15,
        {
          align:"center"
        }
      );



      doc.setFontSize(16);


      doc.text(
        "BUKIT JAYA",
        105,
        23,
        {
          align:"center"
        }
      );



      doc.setFontSize(13);


      doc.text(
        "PERTASHOP",
        105,
        30,
        {
          align:"center"
        }
      );



      doc.setFontSize(15);


      doc.text(
        "LAPORAN PENGAMBILAN BBM",
        105,
        40,
        {
          align:"center"
        }
      );



      doc.setFont(
        "helvetica",
        "normal"
      );


      doc.setFontSize(10);



      doc.text(
        `Periode: ${namaPeriode}`,
        105,
        47,
        {
          align:"center"
        }
      );



      doc.line(
        15,
        52,
        195,
        52
      );



      // =====================================================
      // RINGKASAN LAPORAN
      // =====================================================


      autoTable(doc, {


        startY:56,


        theme:"grid",


        head:[
          [
            "Keterangan",
            "Nilai"
          ]
        ],



        body:[


          [
            "Periode",
            namaPeriode
          ],


          [
            "Jenis BBM",
            namaBBM
          ],


          [
            "Kuota",
            `${kuotaLiter.toLocaleString(
              "id-ID"
            )} L`
          ],



          [
            "Terjual",
            `${totalLiter.toLocaleString(
              "id-ID"
            )} L`
          ],



          [
            "Sisa Kuota",
            `${sisaKuota.toLocaleString(
              "id-ID"
            )} L`
          ],



          [
            "Total Penjualan",
            `Rp ${totalPenjualan.toLocaleString(
              "id-ID"
            )}`
          ],



          [
            "Modal BBM",
            `Rp ${totalModal.toLocaleString(
              "id-ID"
            )}`
          ],



          [
            "Laba Kotor",
            `Rp ${labaKotor.toLocaleString(
              "id-ID"
            )}`
          ],



          [
            "Total Pengeluaran",
            `Rp ${totalPengeluaran.toLocaleString(
              "id-ID"
            )}`
          ],



          [
            "Laba Bersih",
            `Rp ${labaBersih.toLocaleString(
              "id-ID"
            )}`
          ],


        ],



        styles:{

          fontSize:9,

          cellPadding:3,

        },



        headStyles:{

          fillColor:[
            185,
            28,
            28
          ],

          textColor:255,

          fontStyle:"bold",

        },



        columnStyles:{

          0:{
            cellWidth:55
          },


          1:{
            cellWidth:115
          }

        }


      });





      // =====================================================
      // RINCIAN PENGELUARAN
      // =====================================================


      let y =
        (doc as any)
        .lastAutoTable
        .finalY + 8;



      doc.setFont(
        "helvetica",
        "bold"
      );


      doc.setFontSize(11);



      doc.text(
        "RINCIAN PENGELUARAN",
        15,
        y
      );



      y += 4;



      const pengeluaranData =

        pengeluaran.length > 0

        ?

        pengeluaran.map(
          (
            item:any,
            index:number
          )=>[

            index + 1,

            item.tanggal || "-",

            item.keterangan || "-",

            `Rp ${Number(
              item.jumlah || 0
            ).toLocaleString(
              "id-ID"
            )}`

          ]
        )

        :

        [
          [
            "",
            "",
            "Tidak ada pengeluaran",
            "Rp 0"
          ]
        ];




      autoTable(doc, {


        startY:y + 2,


        theme:"grid",



        head:[

          [
            "No",
            "Tanggal",
            "Keterangan",
            "Jumlah"
          ]

        ],



        body:
          pengeluaranData,



        styles:{

          fontSize:8,

          cellPadding:2.5

        },



        headStyles:{

          fillColor:[
            185,
            28,
            28
          ],

          textColor:255,

          fontStyle:"bold",

          halign:"center"

        },



        columnStyles:{


          0:{
            cellWidth:12,
            halign:"center"
          },


          1:{
            cellWidth:30,
            halign:"center"
          },


          2:{
            cellWidth:83
          },


          3:{
            cellWidth:45,
            halign:"right"
          }


        }


      });
      // =====================================================
// TOTAL PENGELUARAN
// =====================================================

y =
  (doc as any)
    .lastAutoTable
    .finalY + 7;


doc.setFont(
  "helvetica",
  "bold"
);

doc.setFontSize(10);


doc.text(
  `TOTAL PENGELUARAN: Rp ${totalPengeluaran.toLocaleString(
    "id-ID"
  )}`,
  195,
  y,
  {
    align:"right"
  }
);



// =====================================================
// TANDA TANGAN
// =====================================================


y += 10;


doc.setFont(
  "helvetica",
  "normal"
);

doc.setFontSize(10);



// PETUGAS PENCATAT

doc.text(
  "Petugas Pencatat",
  50,
  y,
  {
    align:"center"
  }
);


y += 18;


doc.text(
  "________________________",
  50,
  y,
  {
    align:"center"
  }
);



y += 5;


doc.setFont(
  "helvetica",
  "bold"
);


doc.text(
  petugas || "__________________",
  50,
  y,
  {
    align:"center"
  }
);



// WAKIL KETUA

const signatureY =
  y - 23;


doc.setFont(
  "helvetica",
  "normal"
);



doc.text(
  "Wakil Ketua Bidang Usaha KDMP",
  155,
  signatureY,
  {
    align:"center"
  }
);



doc.text(
  "Bukit Jaya Kecamatan Bulik Timur",
  155,
  signatureY + 5,
  {
    align:"center"
  }
);



doc.text(
  "________________________",
  155,
  signatureY + 22,
  {
    align:"center"
  }
);



doc.setFont(
  "helvetica",
  "bold"
);



doc.text(
  "H. Eko Supriadi",
  155,
  signatureY + 27,
  {
    align:"center"
  }
);




// MENGETAHUI

const mengetahuiY =
  y + 13;


doc.setFont(
  "helvetica",
  "normal"
);



doc.text(
  "Mengetahui:",
  105,
  mengetahuiY,
  {
    align:"center"
  }
);



doc.setFont(
  "helvetica",
  "bold"
);



doc.text(
  "Ketua Koperasi Merah Putih Bukit Jaya",
  105,
  mengetahuiY + 5,
  {
    align:"center"
  }
);



doc.text(
  "Kecamatan Bulik Timur",
  105,
  mengetahuiY + 10,
  {
    align:"center"
  }
);



doc.text(
  "________________________",
  105,
  mengetahuiY + 27,
  {
    align:"center"
  }
);



doc.text(
  "IQOM MUKHIQOM",
  105,
  mengetahuiY + 32,
  {
    align:"center"
  }
);





// =====================================================
// HALAMAN 2 - DAFTAR TRANSAKSI
// =====================================================


doc.addPage();



doc.setFont(
  "helvetica",
  "bold"
);


doc.setFontSize(14);



doc.text(
  "DAFTAR TRANSAKSI PENGAMBILAN BBM",
  105,
  15,
  {
    align:"center"
  }
);



doc.setFont(
  "helvetica",
  "normal"
);


doc.setFontSize(10);



doc.text(
  `Periode: ${namaPeriode}`,
  105,
  22,
  {
    align:"center"
  }
);



doc.line(
  15,
  27,
  195,
  27
);





// =====================================================
// TABEL TRANSAKSI
// =====================================================


const tableData = hasil.map(
  (
    item:any,
    index:number
  )=>[

    index + 1,

    item.warga?.nama || "-",

    item.tanggal || "-",


    `${Number(
      item.liter || 0
    ).toLocaleString(
      "id-ID"
    )} L`,



    item.metode_pembayaran

      ? item.metode_pembayaran.toUpperCase()

      : "-",



    `Rp ${Number(
      item.harga || 0
    ).toLocaleString(
      "id-ID"
    )}`,



    `Rp ${Number(
      item.total || 0
    ).toLocaleString(
      "id-ID"
    )}`

  ]
);



autoTable(
  doc,
  {


    startY:32,


    head:[

      [
        "No",
        "Nama Warga",
        "Tanggal",
        "Liter",
        "Pembayaran",
        "Harga/Liter",
        "Total"
      ]

    ],



    body:
      tableData,



    theme:"grid",



    styles:{

      fontSize:8,

      cellPadding:2.5

    },



    headStyles:{

      fillColor:[
        185,
        28,
        28
      ],

      textColor:255,

      fontStyle:"bold",

      halign:"center"

    },


    columnStyles:{


      0:{
        cellWidth:10,
        halign:"center"
      },


      1:{
        cellWidth:45
      },


      2:{
        cellWidth:25,
        halign:"center"
      },


      3:{
        cellWidth:18,
        halign:"center"
      },


      4:{
        cellWidth:25,
        halign:"center",
        fontStyle:"bold"
      },


      5:{
        cellWidth:32,
        halign:"right"
      },


      6:{
        cellWidth:35,
        halign:"right"
      }


    }


  }
);





// =====================================================
// TOTAL TRANSAKSI
// =====================================================


y =
  (doc as any)
  .lastAutoTable
  .finalY + 8;



doc.setFont(
  "helvetica",
  "bold"
);


doc.setFontSize(10);



doc.text(
  `TOTAL PENGAMBILAN: ${totalLiter.toLocaleString(
    "id-ID"
  )} L`,
  15,
  y
);



doc.text(
  `TOTAL NILAI: Rp ${totalRupiah.toLocaleString(
    "id-ID"
  )}`,
  195,
  y,
  {
    align:"right"
  }
);





// =====================================================
// FOOTER SEMUA HALAMAN
// =====================================================


const jumlahHalaman =
  doc.getNumberOfPages();



for(
  let i = 1;
  i <= jumlahHalaman;
  i++
){


  doc.setPage(i);



  doc.setFont(
    "helvetica",
    "normal"
  );


  doc.setFontSize(8);



  doc.text(
    "Dokumen Laporan Pengambilan BBM - KDMP Bukit Jaya",
    105,
    287,
    {
      align:"center"
    }
  );



  doc.text(
    `Halaman ${i} dari ${jumlahHalaman}`,
    195,
    287,
    {
      align:"right"
    }
  );


}





// =====================================================
// DOWNLOAD
// =====================================================


const namaFile =
  `Laporan_${namaPeriode
    .replace(/\s+/g,"_")
    .replace(/[^\w-]/g,"")}.pdf`;



doc.save(
  namaFile
);
    } catch (err) {

      console.error(err);

      alert(
        "Gagal membuat PDF."
      );

    }

  }



  return (

    <div
      style={{
        padding:20,
        minHeight:"100vh",
        background:
          "linear-gradient(135deg,#020617,#111827,#1e1b4b)",
        color:"#fff"
      }}
    >


      <h1
        style={{
          fontSize:28,
          fontWeight:"bold",
          marginBottom:20
        }}
      >
        📄 Laporan Pengambilan BBM
      </h1>



      <button

        onClick={() =>
          navigate("/dashboard")
        }

        style={{
          padding:"10px 18px",
          borderRadius:10,
          border:"1px solid #38bdf8",
          background:
            "linear-gradient(135deg,#0f172a,#1e40af)",
          color:"#fff",
          cursor:"pointer"
        }}

      >
        ← Kembali Dashboard

      </button>



      <hr
        style={{
          margin:"20px 0",
          borderColor:"#334155"
        }}
      />




      {/* FILTER */}

      <div

        style={{

          display:"flex",

          gap:12,

          flexWrap:"wrap",

          alignItems:"center",

          padding:20,

          borderRadius:16,

          background:
            "rgba(15,23,42,.8)",

          border:
            "1px solid #334155",

          boxShadow:
            "0 0 20px rgba(56,189,248,.15)"

        }}

      >



        <select

          value={periodeId}

          onChange={(e)=>
            setPeriodeId(
              e.target.value
            )
          }


          style={{

            padding:10,

            minWidth:240,

            borderRadius:10,

            background:"#020617",

            color:"#fff",

            border:
              "1px solid #38bdf8"

          }}

        >


          <option value="">

            Pilih Periode

          </option>



          {periode.map(
            (p)=>(
              
              <option

                key={p.id}

                value={p.id}

              >

                {p.nama_periode}

              </option>

            )
          )}


        </select>





        <button

          onClick={tampilkan}

          style={{

            padding:"10px 18px",

            borderRadius:10,

            background:
              "linear-gradient(135deg,#22c55e,#16a34a)",

            color:"#fff",

            border:"none",

            cursor:"pointer"

          }}

        >

          🔍 Tampilkan

        </button>





        <button

          onClick={()=>

            window.open(

              `/print-laporan?periode=${periodeId}&petugas=${encodeURIComponent(
                petugas
              )}`,

              "_blank"

            )

          }


          style={{

            padding:"10px 18px",

            borderRadius:10,

            background:
              "linear-gradient(135deg,#2563eb,#1d4ed8)",

            color:"#fff",

            border:"none",

            cursor:"pointer"

          }}

        >

          🖨 Cetak

        </button>





        <button

          onClick={downloadPdf}


          style={{

            padding:"10px 18px",

            borderRadius:10,

            background:
              "linear-gradient(135deg,#dc2626,#991b1b)",

            color:"#fff",

            border:"none",

            cursor:"pointer"

          }}

        >

          ⬇ Download PDF

        </button>



      </div>







      {/* PETUGAS */}


      <div

        style={{

          marginTop:20,

          padding:20,

          borderRadius:16,

          background:
            "rgba(15,23,42,.8)",

          border:
            "1px solid #334155"

        }}

      >


        <label>

          <b>
            Petugas Pencatat
          </b>

        </label>


        <br/>


        <input

          value={petugas}

          placeholder="Masukkan nama petugas"


          onChange={(e)=>
            setPetugas(
              e.target.value
            )
          }


          style={{

            marginTop:10,

            padding:10,

            width:300,

            maxWidth:"100%",

            borderRadius:10,

            background:"#020617",

            color:"#fff",

            border:
              "1px solid #38bdf8"

          }}

        />


      </div>







      {/* LABA RUGI */}



      {labaRugi && (


        <div

          style={{

            marginTop:20,

            padding:20,

            borderRadius:16,

            background:
              "rgba(15,23,42,.9)",

            border:
              "1px solid #a855f7",

            boxShadow:
              "0 0 25px rgba(168,85,247,.25)"

          }}

        >


          <h2>

            📊 Laporan Laba Rugi

          </h2>




          <p>
            Total Penjualan :
            <b>
              {" "}
              Rp {labaRugi.totalPenjualan.toLocaleString("id-ID")}
            </b>
          </p>



          <p>
            Modal BBM :
            <b>
              {" "}
              Rp {labaRugi.totalModal.toLocaleString("id-ID")}
            </b>
          </p>




          <p>
            Laba Kotor :
            <b>
              {" "}
              Rp {labaRugi.labaKotor.toLocaleString("id-ID")}
            </b>
          </p>




          <p>
            Total Pengeluaran :
            <b>
              {" "}
              Rp {labaRugi.totalPengeluaran.toLocaleString("id-ID")}
            </b>
          </p>




          <h2
            style={{
              color:"#22c55e"
            }}
          >

            Laba Bersih :

            Rp{" "}
            {labaRugi.labaBersih.toLocaleString("id-ID")}

          </h2>



        </div>


      )}







      {/* TABLE */}



      <div

        style={{

          marginTop:25,

          overflowX:"auto",

          borderRadius:16

        }}

      >



      <table

        style={{

          width:"100%",

          borderCollapse:"collapse",

          background:"#020617"

        }}

      >


        <thead>


          <tr

            style={{

              background:
                "linear-gradient(90deg,#dc2626,#7f1d1d)"

            }}

          >

            <th>No</th>

            <th>Nama</th>

            <th>Tanggal</th>

            <th>Liter</th>

            <th>Pembayaran</th>

            <th>Harga/Liter</th>

            <th>Total</th>


          </tr>


        </thead>




        <tbody>


        {data.length > 0 ?


          data.map(
            (t,index)=>(


              <tr
                key={t.id}

                style={{

                  borderBottom:
                    "1px solid #334155"

                }}

              >


                <td>
                  {index+1}
                </td>


                <td>
                  {t.warga?.nama || "-"}
                </td>


                <td>
                  {t.tanggal}
                </td>


                <td>
                  {t.liter} L
                </td>


                <td>

                  {t.metode_pembayaran
                    ?.toUpperCase() || "-"}

                </td>


                <td>

                  Rp{" "}
                  {Number(
                    t.harga
                  ).toLocaleString(
                    "id-ID"
                  )}

                </td>


                <td>

                  Rp{" "}
                  {Number(
                    t.total
                  ).toLocaleString(
                    "id-ID"
                  )}

                </td>


              </tr>


            )

          )


        :

          <tr>

            <td
              colSpan={7}
              style={{
                textAlign:"center",
                padding:20
              }}
            >

              Belum ada data

            </td>

          </tr>


        }


        </tbody>


      </table>


      </div>


    </div>

  );

}
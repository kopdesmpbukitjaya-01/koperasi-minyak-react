import { useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";
import Layout from "../components/Layout";

import { getWarga } from "../services/warga";
import { getPeriode } from "../services/periode";
import { getJenisBBM } from "../services/jenis_bbm";

import {
  getTransaksi,
  addTransaksi,
  updateTransaksi,
  deleteTransaksi,
  cekTransaksiWarga,
} from "../services/transaksi";


export default function Transaksi() {



  const [list, setList] = useState<any[]>([]);

  const [jenisBBM, setJenisBBM] = useState<any[]>([]);

  const [jenisBBMId, setJenisBBMId] = useState("");



  const [warga, setWarga] = useState<any[]>([]);

  const [periode, setPeriode] = useState<any[]>([]);
const [showRiwayat,setShowRiwayat] = useState(false);

const isAndroidApp = Capacitor.isNativePlatform();


  const [
    filterPeriodeId,
    setFilterPeriodeId
  ] = useState("");



  const [filterNama] = useState<string>("");


  const [saving, setSaving] = useState(false);



  const [wargaId, setWargaId] = useState("");

  const [periodeId, setPeriodeId] = useState("");

  const [tanggal, setTanggal] = useState("");

  const [liter, setLiter] = useState("");

  const [
    metodePembayaran,
    setMetodePembayaran
  ] = useState("Tunai");



  const [
    scannerOpen,
    setScannerOpen
  ] = useState(false);



  const [
    scanResult,
    setScanResult
  ] = useState("");



  const [
    editId,
    setEditId
  ] = useState<number | null>(null);





  // =====================================================
  // LOAD AWAL
  // =====================================================


  useEffect(()=>{


    loadData();



    setTanggal(
      new Date()
      .toISOString()
      .substring(0,10)
    );


  },[]);







  // =====================================================
  // QR SCANNER
  // =====================================================


  useEffect(()=>{

  if(!scannerOpen)
    return;


  let scanner:any;


  async function startScanner(){

    const {
      Html5Qrcode
    } = await import("html5-qrcode");


    scanner =
      new Html5Qrcode("reader");



    scanner.start(

      {
        facingMode:"environment"
      },


      {
        fps:10,

        qrbox:{
          width:250,
          height:250
        }
      },


      (decodedText: string)=>{


        const kodeScan =
          String(decodedText).trim();



        setScanResult(kodeScan);



        const wargaDitemukan =
          warga.find(

            (w:any)=>

              String(
                w.kode_warga ??
                w.kode ??
                w.kodeWarga ??
                ""
              )
              .trim()
              .toLowerCase()
              ===
              kodeScan.toLowerCase()

          );



        if(wargaDitemukan){


          setWargaId(
            String(
              wargaDitemukan.id
            )
          );



          setScannerOpen(false);



        }else{


          alert(
            `⚠️ Kode warga "${kodeScan}" tidak ditemukan`
          );


        }


      },


      ()=>{}


    )

    .catch((err: any)=>{


      console.error(
        "Scanner error",
        err
      );


      alert(
        "❌ Kamera tidak dapat dibuka"
      );


      setScannerOpen(false);


    });


  }


  startScanner();



    return()=>{


      scanner
      .stop()
      .then(()=>{

        scanner.clear();

      })
      .catch(()=>{});



    };



  },[
    scannerOpen,
    warga
  ]);









  // =====================================================
  // LOAD DATA
  // =====================================================


  async function loadData(){


    try{


      const [

        dataTransaksi,

        dataWarga,

        dataPeriode,

        dataBBM


      ] = await Promise.all([


        getTransaksi(),

        getWarga(),

        getPeriode(),

        getJenisBBM()


      ]);




      setList(dataTransaksi);

      setWarga(dataWarga);

      setPeriode(dataPeriode);

      setJenisBBM(dataBBM);




      



    }catch(err){


      console.error(err);


      alert(
        "❌ Gagal memuat data"
      );


    }


  }







  // =====================================================
  // SIMPAN TRANSAKSI
  // =====================================================


  async function simpan(){


    if(saving)
      return;



    setSaving(true);



    try{


      if(!wargaId){

        alert(
          "⚠️ Silakan pilih warga"
        );

        return;

      }



      if(!jenisBBMId){

        alert(
          "⚠️ Silakan pilih jenis BBM"
        );

        return;

      }



      if(!periodeId){

        alert(
          "⚠️ Silakan pilih periode"
        );

        return;

      }



      if(!tanggal){

        alert(
          "⚠️ Pilih tanggal"
        );

        return;

      }



      if(!liter || Number(liter)<=0){

        alert(
          "⚠️ Jumlah liter harus lebih dari 0"
        );

        return;

      }



      if(editId===null){


        await addTransaksi(

          Number(wargaId),

          Number(periodeId),

          Number(jenisBBMId),

          tanggal,

          Number(liter),

          metodePembayaran

        );



        alert(
          "✅ Transaksi berhasil disimpan"
        );



      }else {

  const transaksiLama =
    list.find(
      (t) => t.id === editId
    );


  if (!transaksiLama) {

    alert(
      "❌ Data transaksi tidak ditemukan."
    );

    return;

  }



  const wargaBerubah =
    Number(transaksiLama.warga_id)
    !==
    Number(wargaId);



  const periodeBerubah =
    Number(transaksiLama.periode_id)
    !==
    Number(periodeId);



  if (
    wargaBerubah ||
    periodeBerubah
  ) {


    const sudahAda =
      await cekTransaksiWarga(
        Number(wargaId),
        Number(periodeId)
      );



    if (sudahAda) {


      alert(
        "⚠️ Warga ini sudah melakukan pengambilan BBM pada periode tersebut."
      );


      return;


    }


  }



  await updateTransaksi(

    editId,

    Number(wargaId),

    Number(periodeId),

    Number(jenisBBMId),

    tanggal,

    Number(liter),

    metodePembayaran

  );



  alert(
    "✅ Transaksi berhasil diperbarui."
  );


}



      setEditId(null);

      setWargaId("");

      setPeriodeId("");

      setJenisBBMId("");

      setLiter("");



      setTanggal(

        new Date()
        .toISOString()
        .substring(0,10)

      );



      await loadData();



    }catch(err:any){


      console.error(err);


      alert(
        err?.message ||
        "❌ Gagal menyimpan transaksi"
      );



    }finally{


      setSaving(false);


    }


  }
    // =====================================================
  // EDIT
  // =====================================================

  function edit(item:any){

    setEditId(item.id);

    setWargaId(
      String(item.warga_id)
    );


    setPeriodeId(
      String(item.periode_id)
    );


    setJenisBBMId(
      String(item.jenis_bbm_id)
    );


    setTanggal(
      item.tanggal
    );


    setLiter(
      String(item.liter)
    );


    setMetodePembayaran(
      item.metode_pembayaran || "Tunai"
    );

  }





  // =====================================================
  // HAPUS
  // =====================================================

  async function hapus(id:number){


    if(
      !confirm(
        "Yakin ingin menghapus transaksi?"
      )
    ){

      return;

    }



    try{


      await deleteTransaksi(id);


      await loadData();


      alert(
        "✅ Transaksi berhasil dihapus"
      );


    }catch(err:any){


      alert(
        err?.message ||
        "❌ Gagal menghapus transaksi"
      );


    }


  }





  // =====================================================
  // NAMA WARGA
  // =====================================================

  function getNamaWarga(w:any){


    return (

      w?.nama ??

      w?.nama_warga ??

      w?.namaWarga ??

      w?.name ??

      "Nama belum tersedia"

    );


  }







  // =====================================================
  // FILTER
  // =====================================================


  const filteredList = list.filter((t)=>{



    if(

      filterPeriodeId &&

      Number(t.periode_id)
      !==
      Number(filterPeriodeId)

    ){

      return false;

    }



    if (
  filterNama.trim() !== "" &&
  !String(
    t.warga?.nama ??
    t.warga?.nama_warga ??
    ""
  )
  .toLowerCase()
  .includes(
    filterNama.toLowerCase()
  )
){
  return false;
}



    return true;


  })

  .sort((a,b)=>{


    const namaA =
      String(
        a.warga?.nama ??
        ""
      )
      .toLowerCase();



    const namaB =
      String(
        b.warga?.nama ??
        ""
      )
      .toLowerCase();



    return namaA.localeCompare(
      namaB,
      "id",
      {
        sensitivity:"base"
      }
    );


  });






  // =====================================================
  // RENDER
  // =====================================================


  return (

    <Layout>


      <div className="space-y-8">





        {/* HEADER NEON */}


        <div

          className="
          relative
          overflow-hidden
          rounded-3xl
          p-6
          bg-gradient-to-br
          from-[#18002f]
          via-[#0b1026]
          to-[#050816]
          border
          border-purple-500/30
          shadow-[0_0_40px_rgba(168,85,247,0.25)]
          "

        >



          <div

            className="
            absolute
            -top-20
            -right-20
            w-72
            h-72
            bg-red-500/20
            rounded-full
            blur-3xl
            "

          />





          <div className="relative flex justify-between items-center">


            <div>


              <h1

                className="
                text-3xl
                md:text-4xl
                font-black
                bg-gradient-to-r
                from-red-400
                via-purple-400
                to-blue-400
                bg-clip-text
                text-transparent
                "

              >

                ⛽ TRANSAKSI BBM


              </h1>



              <p className="text-gray-300 mt-2">

                Kelola pengambilan BBM Pertashop

              </p>


            </div>





            


          </div>


        </div>









        {/* FORM TRANSAKSI */}


        <div


          className="
          rounded-3xl
          p-6
          md:p-8
          bg-white/5
          backdrop-blur-xl
          border
          border-white/10
          shadow-[0_0_40px_rgba(139,92,246,0.15)]
          "

        >



          <h2

            className="
            text-2xl
            font-black
            text-white
            mb-8
            "

          >

            ⚡

            {
              editId===null

              ?

              " Tambah Pengambilan"

              :

              " Edit Pengambilan"

            }


          </h2>





          <div className="
          grid
          grid-cols-1
          md:grid-cols-2
          lg:grid-cols-3
          gap-6
          ">





            {/* SCANNER */}


            <div className="
            md:col-span-2
            lg:col-span-3
            ">


              <button


                type="button"


                onClick={()=>{

                  setScanResult("");

                  setScannerOpen(true);

                }}


                className="
                px-6
                py-3
                rounded-xl
                bg-gradient-to-r
                from-blue-600
                to-purple-600
                text-white
                font-bold
                shadow-[0_0_25px_rgba(59,130,246,0.5)]
                hover:scale-105
                transition
                "

              >

                📷 Scan QR Warga


              </button>





              {
                scannerOpen &&

                <div className="mt-5 max-w-md">


                  <div

                    id="reader"

                    className="
                    rounded-xl
                    overflow-hidden
                    border
                    border-purple-500/40
                    "

                  />



                  {
                    scanResult &&

                    <div

                      className="
                      mt-3
                      p-3
                      rounded-xl
                      bg-green-500/10
                      border
                      border-green-500/30
                      text-green-300
                      "

                    >

                      QR:
                      {" "}
                      {scanResult}


                    </div>

                  }





                  <button


                    type="button"


                    onClick={()=>{

                      setScannerOpen(false);

                      setScanResult("");

                    }}


                    className="
                    mt-3
                    px-5
                    py-2
                    rounded-lg
                    bg-gray-700
                    text-white
                    "

                  >

                    ✖ Tutup Scanner


                  </button>


                </div>

              }


            </div>
                        {/* WARGA */}

            <div>

              <label className="text-sm text-gray-300 font-semibold mb-2 block">
                👤 Warga
              </label>


              <select

                value={wargaId}

                onChange={(e)=>
                  setWargaId(e.target.value)
                }

                className="
                w-full
                rounded-xl
                px-4
                py-3
                bg-black/30
                text-white
                border
                border-purple-500/30
                outline-none
                "

              >

                <option
                  value=""
                  className="bg-[#050816]"
                >
                  Pilih Warga
                </option>


                {
                  warga.map((w)=>(

                    <option

                      key={w.id}

                      value={w.id}

                      className="bg-[#050816]"

                    >

                      {getNamaWarga(w)}

                      {
                        w.kode_warga
                        ?
                        ` - ${w.kode_warga}`
                        :
                        ""
                      }

                    </option>

                  ))
                }


              </select>



              {
                wargaId &&

                <p className="
                mt-2
                text-green-400
                text-sm
                font-semibold
                ">

                  ✓ Warga dipilih

                </p>

              }


            </div>






            {/* BBM */}

            <div>


              <label className="text-sm text-gray-300 font-semibold mb-2 block">

                ⛽ Jenis BBM

              </label>



              <select

                value={jenisBBMId}

                onChange={(e)=>
                  setJenisBBMId(e.target.value)
                }


                className="
                w-full
                rounded-xl
                px-4
                py-3
                bg-black/30
                text-white
                border
                border-blue-500/30
                outline-none
                "

              >

                <option
                  value=""
                  className="bg-[#050816]"
                >

                  Pilih Jenis BBM

                </option>


                {
                  jenisBBM.map((bbm)=>(

                    <option

                      key={bbm.id}

                      value={bbm.id}

                      className="bg-[#050816]"

                    >

                      {bbm.nama}

                    </option>

                  ))
                }


              </select>


            </div>







            {/* PERIODE */}

            <div>


              <label className="text-sm text-gray-300 font-semibold mb-2 block">

                📅 Periode

              </label>



              <select

                value={periodeId}

                onChange={(e)=>
                  setPeriodeId(e.target.value)
                }


                className="
                w-full
                rounded-xl
                px-4
                py-3
                bg-black/30
                text-white
                border
                border-red-500/30
                outline-none
                "

              >

                <option
                  value=""
                  className="bg-[#050816]"
                >

                  Pilih Periode

                </option>


                {
                  periode.map((p)=>(

                    <option

                      key={p.id}

                      value={p.id}

                      className="bg-[#050816]"

                    >

                      {p.nama_periode}

                    </option>

                  ))
                }


              </select>


            </div>







            {/* TANGGAL */}

            <div>


              <label className="text-sm text-gray-300 font-semibold mb-2 block">

                📆 Tanggal Pengambilan

              </label>



              <input

                type="date"

                value={tanggal}

                onChange={(e)=>
                  setTanggal(e.target.value)
                }


                className="
                w-full
                rounded-xl
                px-4
                py-3
                bg-black/30
                text-white
                border
                border-white/20
                outline-none
                "

              />


            </div>








            {/* LITER */}

            <div>


              <label className="text-sm text-gray-300 font-semibold mb-2 block">

                🛢 Jumlah Liter

              </label>



              <input

                type="number"

                min="0"

                step="0.1"

                value={liter}

                placeholder="Contoh: 5"

                onChange={(e)=>
                  setLiter(e.target.value)
                }


                className="
                w-full
                rounded-xl
                px-4
                py-3
                bg-black/30
                text-white
                border
                border-green-500/30
                outline-none
                "

              />


            </div>








            {/* PEMBAYARAN */}

            <div>


              <label className="text-sm text-gray-300 font-semibold mb-2 block">

                💳 Pembayaran

              </label>



              <select

                value={metodePembayaran}

                onChange={(e)=>
                  setMetodePembayaran(
                    e.target.value
                  )
                }


                className="
                w-full
                rounded-xl
                px-4
                py-3
                bg-black/30
                text-white
                border
                border-yellow-500/30
                outline-none
                "

              >

                <option
                  value="Tunai"
                  className="bg-[#050816]"
                >

                  🟢 Tunai

                </option>


                <option
                  value="Transfer"
                  className="bg-[#050816]"
                >

                  🔵 Transfer

                </option>


              </select>


            </div>




          </div>







          {/* BUTTON */}

          <div className="flex gap-4 mt-8">


            <button

              onClick={simpan}

              disabled={saving}


              className="
              px-8
              py-3
              rounded-xl
              text-white
              font-black
              bg-gradient-to-r
              from-red-500
              via-purple-500
              to-blue-500
              shadow-[0_0_30px_rgba(168,85,247,0.5)]
              hover:scale-105
              transition
              "

            >

              {
                saving
                ?
                "⏳ Menyimpan..."
                :
                editId===null
                ?
                "💾 SIMPAN"
                :
                "✏️ UPDATE"
              }


            </button>



            {
              editId!==null &&

              <button

                onClick={()=>{

                  setEditId(null);

                  setWargaId("");

                  setPeriodeId("");

                  setJenisBBMId("");

                  setLiter("");

                }}

                className="
                px-8
                py-3
                rounded-xl
                bg-gray-700
                text-white
                "

              >

                Batal

              </button>

            }


          </div>



        </div>








        {/* DAFTAR TRANSAKSI */}

<div
className="
rounded-3xl
p-6
md:p-8
bg-white/5
backdrop-blur-xl
border
border-white/10
"
>


{isAndroidApp && !showRiwayat && (

<button
onClick={()=>setShowRiwayat(true)}
className="
mb-5
w-full
rounded-xl
p-4
bg-gradient-to-r
from-purple-600
to-blue-600
font-bold
text-white
shadow-lg
"
>
📋 Tampilkan Riwayat Pengambilan
</button>

)}



{(!isAndroidApp || showRiwayat) && (

<>

<div
className="
flex
flex-col
md:flex-row
md:items-center
md:justify-between
gap-4
mb-5
"
>

<h2
className="
text-2xl
font-black
text-white
"
>
📊 RIWAYAT PENGAMBILAN
</h2>


<div className="flex gap-3 flex-wrap">

<select
value={filterPeriodeId}
onChange={(e)=>
setFilterPeriodeId(e.target.value)
}
className="
bg-white
rounded-lg
px-4
py-2
text-black
font-semibold
"
>

<option value="">
Pilih Periode
</option>

{
periode.map((p:any)=>(

<option
key={p.id}
value={p.id}
>
{p.nama_periode}
</option>

))
}

</select>


{isAndroidApp && (

<button
onClick={()=>{
setShowRiwayat(false);
setFilterPeriodeId("");
}}
className="
px-4
py-2
rounded-lg
bg-red-600
hover:bg-red-700
text-white
font-bold
shadow-lg
transition
"
>
❌ Tutup Riwayat
</button>

)}

</div>

</div>


<div className="overflow-x-auto">


<table className="w-full text-white">

<thead>

<tr>

<th>No</th>
<th>Nama</th>
<th>BBM</th>
<th>Liter</th>
<th>Bayar</th>
<th>Total</th>
<th>Aksi</th>

</tr>

</thead>


<tbody>

{
filteredList.map(
(t,index)=>(

<tr key={t.id}>


<td>
{index+1}
</td>


<td>
{getNamaWarga(t.warga)}
</td>


<td>
{t.jenis_bbm?.nama}
</td>


<td>
{t.liter} L
</td>


<td>
{t.metode_pembayaran}
</td>


<td>
Rp {Number(t.total)
.toLocaleString("id-ID")}
</td>


<td>

<button
onClick={()=>edit(t)}
>
✏️
</button>


<button
onClick={()=>hapus(t.id)}
>
🗑
</button>

</td>


</tr>

))

}


</tbody>


</table>


</div>


</>

)}


</div>


      </div>


    </Layout>

  );

}
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

import {
  getAnggotaKoperasi,
  addSimpanan,
  getSimpananAnggota,
  getRekapSemuaAnggota,
} from "../services/simpanan";


export default function Anggota() {


  const navigate = useNavigate();



  const [anggota, setAnggota] = useState<any[]>([]);

  const [wargaId, setWargaId] = useState("");



  const [tanggalSetor, setTanggalSetor] = useState(
    new Date().toISOString().slice(0,10)
  );



  const [pokok,setPokok] = useState("");

  const [wajib,setWajib] = useState("");

  const [sukarela,setSukarela] = useState("");



  const [rekapSimpanan,setRekapSimpanan] =
  useState<any[]>([]);



  const [totalPokok,setTotalPokok] =
  useState(0);

  const [totalWajib,setTotalWajib] =
  useState(0);

  const [totalSukarela,setTotalSukarela] =
  useState(0);

  const [totalDana,setTotalDana] =
  useState(0);




  const [rekapGabungan,setRekapGabungan] =
  useState<any[]>([]);


  const [totalSemuaPokok,setTotalSemuaPokok] =
  useState(0);

  const [totalSemuaWajib,setTotalSemuaWajib] =
  useState(0);

  const [totalSemuaSukarela,setTotalSemuaSukarela] =
  useState(0);

  const [totalSemuaDana,setTotalSemuaDana] =
  useState(0);





  useEffect(()=>{


    loadAnggota();

    loadRekapSemua();


  },[]);







  async function loadAnggota(){


    try{


      const data =
      await getAnggotaKoperasi();


      setAnggota(data || []);



    }catch(error){


      console.error(error);


    }


  }








  async function loadRekapSimpanan(id:number){


    try{


      const data =
      await getSimpananAnggota(id);



      setRekapSimpanan(data || []);




      let pokokTotal = 0;

      let wajibTotal = 0;

      let sukarelaTotal = 0;




      (data || []).forEach((item:any)=>{


        pokokTotal += Number(
          item.simpanan_pokok || 0
        );


        wajibTotal += Number(
          item.simpanan_wajib || 0
        );


        sukarelaTotal += Number(
          item.simpanan_sukarela || 0
        );


      });




      setTotalPokok(pokokTotal);

      setTotalWajib(wajibTotal);

      setTotalSukarela(sukarelaTotal);


      setTotalDana(
        pokokTotal +
        wajibTotal +
        sukarelaTotal
      );



    }catch(error){


      console.error(error);


    }


  }









  async function loadRekapSemua(){


    try{


      const data =
      await getRekapSemuaAnggota();




      const hasil:any = {};



      let pokokTotal = 0;

      let wajibTotal = 0;

      let sukarelaTotal = 0;





      (data || []).forEach((item:any)=>{


        const id =
        item.warga.id;



        if(!hasil[id]){


          hasil[id]={

            id:item.warga.id,

            nama:item.warga.nama,

            no_kk:item.warga.no_kk,

            pokok:0,

            wajib:0,

            sukarela:0,

          };


        }



        hasil[id].pokok += Number(
          item.simpanan_pokok || 0
        );


        hasil[id].wajib += Number(
          item.simpanan_wajib || 0
        );


        hasil[id].sukarela += Number(
          item.simpanan_sukarela || 0
        );



        pokokTotal += Number(
          item.simpanan_pokok || 0
        );


        wajibTotal += Number(
          item.simpanan_wajib || 0
        );


        sukarelaTotal += Number(
          item.simpanan_sukarela || 0
        );



      });





      setRekapGabungan(
        Object.values(hasil)
      );


      setTotalSemuaPokok(
        pokokTotal
      );


      setTotalSemuaWajib(
        wajibTotal
      );


      setTotalSemuaSukarela(
        sukarelaTotal
      );


      setTotalSemuaDana(
        pokokTotal +
        wajibTotal +
        sukarelaTotal
      );



    }catch(error){


      console.error(error);


    }


  }








  async function simpan(){


    if(!wargaId){


      alert(
        "Pilih anggota terlebih dahulu"
      );


      return;


    }





    try{


      await addSimpanan(

        Number(wargaId),

        tanggalSetor,

        Number(pokok || 0),

        Number(wajib || 0),

        Number(sukarela || 0)

      );




      alert(
        "Simpanan berhasil disimpan"
      );



      await loadRekapSimpanan(
        Number(wargaId)
      );


      await loadRekapSemua();




      setPokok("");

      setWajib("");

      setSukarela("");



    }catch(error){


      console.error(error);


      alert(
        "Gagal menyimpan"
      );


    }


  }






  return (

  <Layout>


  <div className="space-y-8">



    {/* HEADER */}


    <div
      className="
      rounded-3xl
      p-6
      bg-gradient-to-r
      from-red-600/20
      via-purple-600/20
      to-blue-600/20
      backdrop-blur-xl
      border
      border-white/10
      shadow-[0_0_40px_rgba(168,85,247,0.25)]
      flex
      justify-between
      items-center
      "
    >


      <div>


        <h1
          className="
          text-4xl
          font-black
          text-white
          "
        >

          👥 Anggota Koperasi

        </h1>


        <p
          className="
          text-gray-300
          mt-2
          "
        >

          Kelola simpanan anggota koperasi desa.

        </p>


      </div>



      <button

        onClick={()=>navigate("/dashboard")}

        className="
        bg-black/40
        hover:bg-black/60
        text-white
        px-6
        py-3
        rounded-xl
        border
        border-white/20
        shadow-lg
        "

      >

        ← Dashboard

      </button>



    </div>





    {/* FORM SIMPANAN */}


    <div
      className="
      rounded-3xl
      p-8
      bg-white/5
      backdrop-blur-xl
      border
      border-white/10
      shadow-[0_0_40px_rgba(59,130,246,0.15)]
      "
    >


      <h2
        className="
        text-2xl
        font-bold
        text-white
        mb-6
        "
      >

        💰 Input Simpanan Anggota

      </h2>
            {/* PILIH ANGGOTA */}


      <div>

        <label
          className="
          text-sm
          font-semibold
          text-gray-300
          "
        >

          Pilih Anggota

        </label>


        <select

          value={wargaId}


          onChange={(e)=>{


            const id=e.target.value;


            setWargaId(id);



            if(id){

              loadRekapSimpanan(
                Number(id)
              );

            }


          }}


          className="
          w-full
          mt-2
          rounded-xl
          bg-black/30
          border
          border-white/20
          px-4
          py-3
          text-white
          focus:ring-2
          focus:ring-red-500
          "

        >


          <option
            value=""
            className="text-black"
          >

            -- Pilih Anggota --

          </option>



          {
            anggota.map((item:any)=>(

              <option

                key={item.id}

                value={item.id}

                className="text-black"

              >

                {item.nama}

              </option>

            ))
          }


        </select>


      </div>





      {/* TANGGAL SETOR */}


      <div className="mt-5">


        <label
          className="
          text-sm
          font-semibold
          text-gray-300
          "
        >

          Tanggal Setor

        </label>



        <input

          type="date"

          value={tanggalSetor}

          onChange={(e)=>
            setTanggalSetor(e.target.value)
          }

          className="
          w-full
          mt-2
          rounded-xl
          bg-black/30
          border
          border-white/20
          px-4
          py-3
          text-white
          "

        />


      </div>







      {/* SIMPANAN POKOK */}


      <div className="mt-5">


        <label
          className="
          text-sm
          font-semibold
          text-gray-300
          "
        >

          Simpanan Pokok

        </label>



        <input

          type="number"

          value={pokok}

          onChange={(e)=>
            setPokok(e.target.value)
          }

          placeholder="Masukkan nominal pokok"

          className="
          w-full
          mt-2
          rounded-xl
          bg-black/30
          border
          border-white/20
          px-4
          py-3
          text-white
          "

        />


      </div>







      {/* SIMPANAN WAJIB */}


      <div className="mt-5">


        <label
          className="
          text-sm
          font-semibold
          text-gray-300
          "
        >

          Simpanan Wajib

        </label>



        <input

          type="number"

          value={wajib}

          onChange={(e)=>
            setWajib(e.target.value)
          }

          placeholder="Masukkan nominal wajib"

          className="
          w-full
          mt-2
          rounded-xl
          bg-black/30
          border
          border-white/20
          px-4
          py-3
          text-white
          "

        />


      </div>







      {/* SIMPANAN SUKARELA */}


      <div className="mt-5">


        <label
          className="
          text-sm
          font-semibold
          text-gray-300
          "
        >

          Simpanan Sukarela

        </label>



        <input

          type="number"

          value={sukarela}

          onChange={(e)=>
            setSukarela(e.target.value)
          }

          placeholder="Masukkan nominal sukarela"

          className="
          w-full
          mt-2
          rounded-xl
          bg-black/30
          border
          border-white/20
          px-4
          py-3
          text-white
          "

        />


      </div>







      {/* BUTTON SIMPAN */}


      <button

        onClick={simpan}


        className="
        mt-8
        bg-gradient-to-r
        from-red-600
        via-purple-600
        to-blue-600
        hover:scale-105
        transition
        text-white
        px-8
        py-3
        rounded-xl
        font-bold
        shadow-[0_0_25px_rgba(239,68,68,0.4)]
        "

      >

        💾 SIMPAN


      </button>



    </div>







    {/* REKAP ANGGOTA TERPILIH */}


    <div
      className="
      rounded-3xl
      p-8
      bg-white/5
      backdrop-blur-xl
      border
      border-white/10
      shadow-[0_0_35px_rgba(34,197,94,0.15)]
      "
    >


      <h2
        className="
        text-2xl
        font-bold
        text-white
        mb-6
        "
      >

        📋 Riwayat Simpanan Anggota

      </h2>
      {/* SUMMARY ANGGOTA TERPILIH */}


      <div
        className="
        grid
        grid-cols-1
        md:grid-cols-4
        gap-5
        mb-8
        "
      >


        <div
          className="
          rounded-2xl
          p-5
          bg-blue-500/10
          border
          border-blue-400/20
          "
        >

          <p className="text-gray-300">
            Simpanan Pokok
          </p>


          <p
            className="
            text-2xl
            font-black
            text-blue-300
            mt-2
            "
          >

            Rp {totalPokok.toLocaleString("id-ID")}

          </p>


        </div>





        <div
          className="
          rounded-2xl
          p-5
          bg-green-500/10
          border
          border-green-400/20
          "
        >

          <p className="text-gray-300">
            Simpanan Wajib
          </p>


          <p
            className="
            text-2xl
            font-black
            text-green-300
            mt-2
            "
          >

            Rp {totalWajib.toLocaleString("id-ID")}

          </p>


        </div>





        <div
          className="
          rounded-2xl
          p-5
          bg-yellow-500/10
          border
          border-yellow-400/20
          "
        >

          <p className="text-gray-300">
            Simpanan Sukarela
          </p>


          <p
            className="
            text-2xl
            font-black
            text-yellow-300
            mt-2
            "
          >

            Rp {totalSukarela.toLocaleString("id-ID")}

          </p>


        </div>





        <div
          className="
          rounded-2xl
          p-5
          bg-red-500/10
          border
          border-red-400/20
          "
        >

          <p className="text-gray-300">
            Total Dana
          </p>


          <p
            className="
            text-2xl
            font-black
            text-red-300
            mt-2
            "
          >

            Rp {totalDana.toLocaleString("id-ID")}

          </p>


        </div>


      </div>






      {/* TABLE RIWAYAT */}


      <div
        className="
        overflow-x-auto
        rounded-2xl
        border
        border-white/10
        "
      >


        <table
          className="
          w-full
          "
        >


          <thead
            className="
            bg-black/40
            text-gray-300
            "
          >


            <tr>


              <th
                className="
                px-4
                py-3
                text-left
                "
              >
                Tanggal
              </th>



              <th
                className="
                px-4
                py-3
                text-right
                "
              >
                Pokok
              </th>



              <th
                className="
                px-4
                py-3
                text-right
                "
              >
                Wajib
              </th>



              <th
                className="
                px-4
                py-3
                text-right
                "
              >
                Sukarela
              </th>



              <th
                className="
                px-4
                py-3
                text-right
                "
              >
                Total
              </th>


            </tr>


          </thead>





          <tbody>


          {
            rekapSimpanan.length === 0 ? (


              <tr>


                <td
                  colSpan={5}
                  className="
                  text-center
                  py-8
                  text-gray-400
                  "
                >

                  Belum ada riwayat simpanan.


                </td>


              </tr>



            ) : (


              rekapSimpanan.map((item:any)=>(


                <tr

                  key={item.id}

                  className="
                  border-t
                  border-white/10
                  hover:bg-white/5
                  transition
                  "

                >



                  <td
                    className="
                    px-4
                    py-4
                    text-gray-200
                    "
                  >

                    {item.tanggal_setor}

                  </td>





                  <td
                    className="
                    px-4
                    py-4
                    text-right
                    text-blue-300
                    "
                  >

                    Rp {Number(
                      item.simpanan_pokok || 0
                    ).toLocaleString("id-ID")}


                  </td>





                  <td
                    className="
                    px-4
                    py-4
                    text-right
                    text-green-300
                    "
                  >

                    Rp {Number(
                      item.simpanan_wajib || 0
                    ).toLocaleString("id-ID")}


                  </td>





                  <td
                    className="
                    px-4
                    py-4
                    text-right
                    text-yellow-300
                    "
                  >

                    Rp {Number(
                      item.simpanan_sukarela || 0
                    ).toLocaleString("id-ID")}


                  </td>





                  <td
                    className="
                    px-4
                    py-4
                    text-right
                    font-bold
                    text-red-300
                    "
                  >

                    Rp {(
                      Number(item.simpanan_pokok || 0) +
                      Number(item.simpanan_wajib || 0) +
                      Number(item.simpanan_sukarela || 0)

                    ).toLocaleString("id-ID")}


                  </td>



                </tr>


              ))


            )

          }



          </tbody>


        </table>


      </div>


    </div>






    {/* REKAP SELURUH ANGGOTA */}


    <div
      className="
      rounded-3xl
      p-8
      bg-white/5
      backdrop-blur-xl
      border
      border-white/10
      shadow-[0_0_40px_rgba(168,85,247,0.15)]
      "
    >


      <h2
        className="
        text-2xl
        font-black
        text-white
        mb-6
        "
      >

        📊 Rekap Seluruh Dana Anggota Koperasi

      </h2>
            {/* SUMMARY SELURUH ANGGOTA */}


      <div
        className="
        grid
        grid-cols-1
        md:grid-cols-4
        gap-5
        mb-8
        "
      >


        <div
          className="
          rounded-2xl
          p-5
          bg-blue-500/10
          border
          border-blue-400/20
          "
        >

          <p className="text-gray-300">
            Total Pokok
          </p>


          <p
            className="
            text-2xl
            font-black
            text-blue-300
            mt-2
            "
          >

            Rp {totalSemuaPokok.toLocaleString("id-ID")}

          </p>


        </div>





        <div
          className="
          rounded-2xl
          p-5
          bg-green-500/10
          border
          border-green-400/20
          "
        >

          <p className="text-gray-300">
            Total Wajib
          </p>


          <p
            className="
            text-2xl
            font-black
            text-green-300
            mt-2
            "
          >

            Rp {totalSemuaWajib.toLocaleString("id-ID")}

          </p>


        </div>





        <div
          className="
          rounded-2xl
          p-5
          bg-yellow-500/10
          border
          border-yellow-400/20
          "
        >

          <p className="text-gray-300">
            Total Sukarela
          </p>


          <p
            className="
            text-2xl
            font-black
            text-yellow-300
            mt-2
            "
          >

            Rp {totalSemuaSukarela.toLocaleString("id-ID")}

          </p>


        </div>





        <div
          className="
          rounded-2xl
          p-5
          bg-red-500/10
          border
          border-red-400/20
          "
        >

          <p className="text-gray-300">
            Total Dana Koperasi
          </p>


          <p
            className="
            text-2xl
            font-black
            text-red-300
            mt-2
            "
          >

            Rp {totalSemuaDana.toLocaleString("id-ID")}

          </p>


        </div>


      </div>







      {/* TABLE SELURUH ANGGOTA */}


      <div
        className="
        overflow-x-auto
        rounded-2xl
        border
        border-white/10
        "
      >


        <table
          className="
          w-full
          "
        >


          <thead
            className="
            bg-black/40
            text-gray-300
            "
          >

            <tr>


              <th className="px-4 py-3 text-left">
                ID
              </th>


              <th className="px-4 py-3 text-left">
                Nama Anggota
              </th>


              <th className="px-4 py-3 text-left">
                No KK
              </th>


              <th className="px-4 py-3 text-right">
                Simpanan Pokok
              </th>


              <th className="px-4 py-3 text-right">
                Simpanan Wajib
              </th>


              <th className="px-4 py-3 text-right">
                Simpanan Sukarela
              </th>


              <th className="px-4 py-3 text-right">
                Total Dana
              </th>


            </tr>


          </thead>





          <tbody>


          {
            rekapGabungan.length === 0 ? (


              <tr>


                <td
                  colSpan={7}
                  className="
                  text-center
                  py-10
                  text-gray-400
                  "
                >

                  Belum ada data anggota.


                </td>


              </tr>



            ) : (


              rekapGabungan.map((item:any)=>(


                <tr

                  key={item.id}

                  className="
                  border-t
                  border-white/10
                  hover:bg-white/5
                  transition
                  "

                >



                  <td
                    className="
                    px-4
                    py-4
                    text-gray-200
                    "
                  >

                    {item.id}

                  </td>





                  <td
                    className="
                    px-4
                    py-4
                    font-semibold
                    text-white
                    "
                  >

                    {item.nama}

                  </td>





                  <td
                    className="
                    px-4
                    py-4
                    text-gray-300
                    "
                  >

                    {item.no_kk}

                  </td>





                  <td
                    className="
                    px-4
                    py-4
                    text-right
                    text-blue-300
                    "
                  >

                    Rp {Number(
                      item.pokok || 0
                    ).toLocaleString("id-ID")}


                  </td>





                  <td
                    className="
                    px-4
                    py-4
                    text-right
                    text-green-300
                    "
                  >

                    Rp {Number(
                      item.wajib || 0
                    ).toLocaleString("id-ID")}


                  </td>





                  <td
                    className="
                    px-4
                    py-4
                    text-right
                    text-yellow-300
                    "
                  >

                    Rp {Number(
                      item.sukarela || 0
                    ).toLocaleString("id-ID")}


                  </td>





                  <td
                    className="
                    px-4
                    py-4
                    text-right
                    font-black
                    text-red-300
                    "
                  >

                    Rp {(
                      Number(item.pokok || 0) +
                      Number(item.wajib || 0) +
                      Number(item.sukarela || 0)

                    ).toLocaleString("id-ID")}


                  </td>



                </tr>


              ))


            )

          }



          </tbody>


        </table>


      </div>


    </div>





  </div>


  </Layout>


  );


}

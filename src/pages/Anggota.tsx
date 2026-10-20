import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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



  // rekap anggota terpilih

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




  // rekap seluruh koperasi

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

    <div className="p-6">


      <div className="flex justify-between items-center mb-6">


        <h1 className="text-3xl font-bold text-red-700">
          👥 Anggota Koperasi
        </h1>



        <button

          onClick={()=>navigate("/dashboard")}

          className="bg-gray-700 text-white px-5 py-2 rounded-lg"

        >

          ← Dashboard

        </button>


      </div>





      <div className="bg-white rounded-xl shadow p-6">


        <label className="font-semibold">

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


          className="w-full border rounded-lg p-3 mt-2"

        >


          <option value="">

            -- Pilih Anggota --

          </option>



          {
            anggota.map((item:any)=>(

              <option

                key={item.id}

                value={item.id}

              >

                {item.nama}

              </option>

            ))
          }


        </select>
                <div className="mt-5">

          <label className="font-semibold">
            Tanggal Setor
          </label>


          <input

            type="date"

            value={tanggalSetor}

            onChange={(e)=>
              setTanggalSetor(e.target.value)
            }

            className="w-full border rounded-lg p-3 mt-2"

          />

        </div>





        <div className="mt-5">

          <label className="font-semibold">
            Simpanan Pokok
          </label>


          <input

            type="number"

            value={pokok}

            onChange={(e)=>
              setPokok(e.target.value)
            }

            className="w-full border rounded-lg p-3 mt-2"

          />

        </div>





        <div className="mt-5">

          <label className="font-semibold">
            Simpanan Wajib
          </label>


          <input

            type="number"

            value={wajib}

            onChange={(e)=>
              setWajib(e.target.value)
            }

            className="w-full border rounded-lg p-3 mt-2"

          />

        </div>





        <div className="mt-5">

          <label className="font-semibold">
            Simpanan Sukarela
          </label>


          <input

            type="number"

            value={sukarela}

            onChange={(e)=>
              setSukarela(e.target.value)
            }

            className="w-full border rounded-lg p-3 mt-2"

          />

        </div>





        <button

          onClick={simpan}

          className="
          mt-6
          bg-red-700
          text-white
          px-6
          py-3
          rounded-lg
          font-semibold
          "

        >

          💾 SIMPAN

        </button>





        {/* REKAP ANGGOTA TERPILIH */}


        <div className="mt-10">


          <h2 className="text-xl font-bold text-red-700 mb-4">

            📋 Riwayat Simpanan Anggota

          </h2>



          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">


            <div className="bg-blue-50 p-4 rounded-xl">

              <p>Simpanan Pokok</p>

              <b>
                Rp {totalPokok.toLocaleString("id-ID")}
              </b>

            </div>


            <div className="bg-green-50 p-4 rounded-xl">

              <p>Simpanan Wajib</p>

              <b>
                Rp {totalWajib.toLocaleString("id-ID")}
              </b>

            </div>


            <div className="bg-yellow-50 p-4 rounded-xl">

              <p>Simpanan Sukarela</p>

              <b>
                Rp {totalSukarela.toLocaleString("id-ID")}
              </b>

            </div>


            <div className="bg-red-50 p-4 rounded-xl">

              <p>Total Dana</p>

              <b>
                Rp {totalDana.toLocaleString("id-ID")}
              </b>

            </div>


          </div>





          <table className="w-full border">


            <thead className="bg-gray-100">


              <tr>

                <th className="border p-2">
                  Tanggal
                </th>


                <th className="border p-2">
                  Pokok
                </th>


                <th className="border p-2">
                  Wajib
                </th>


                <th className="border p-2">
                  Sukarela
                </th>


                <th className="border p-2">
                  Total
                </th>


              </tr>


            </thead>



            <tbody>


            {
              rekapSimpanan.map((item:any)=>(


                <tr key={item.id}>


                  <td className="border p-2 text-center">

                    {item.tanggal_setor}

                  </td>


                  <td className="border p-2 text-right">

                    Rp {Number(
                      item.simpanan_pokok || 0
                    ).toLocaleString("id-ID")}

                  </td>


                  <td className="border p-2 text-right">

                    Rp {Number(
                      item.simpanan_wajib || 0
                    ).toLocaleString("id-ID")}

                  </td>


                  <td className="border p-2 text-right">

                    Rp {Number(
                      item.simpanan_sukarela || 0
                    ).toLocaleString("id-ID")}

                  </td>


                  <td className="border p-2 text-right font-bold">

                    Rp {(
                      Number(item.simpanan_pokok || 0)+
                      Number(item.simpanan_wajib || 0)+
                      Number(item.simpanan_sukarela || 0)

                    ).toLocaleString("id-ID")}

                  </td>


                </tr>


              ))
            }


            </tbody>


          </table>


        </div>





        {/* REKAP SELURUH ANGGOTA */}


        <div className="mt-12">


          <h2 className="text-2xl font-bold text-red-700 mb-5">

            📊 Rekap Seluruh Dana Anggota Koperasi

          </h2>




          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">


            <div className="bg-blue-50 p-5 rounded-xl">

              <p>Total Pokok</p>

              <b>
                Rp {totalSemuaPokok.toLocaleString("id-ID")}
              </b>

            </div>



            <div className="bg-green-50 p-5 rounded-xl">

              <p>Total Wajib</p>

              <b>
                Rp {totalSemuaWajib.toLocaleString("id-ID")}
              </b>

            </div>



            <div className="bg-yellow-50 p-5 rounded-xl">

              <p>Total Sukarela</p>

              <b>
                Rp {totalSemuaSukarela.toLocaleString("id-ID")}
              </b>

            </div>



            <div className="bg-red-50 p-5 rounded-xl">

              <p>Total Dana Koperasi</p>

              <b>
                Rp {totalSemuaDana.toLocaleString("id-ID")}
              </b>

            </div>


          </div>
                    <div className="overflow-x-auto">


            <table className="w-full border">


              <thead className="bg-gray-100">

                <tr>

                  <th className="border p-2">
                    ID
                  </th>

                  <th className="border p-2">
                    Nama Anggota
                  </th>

                  <th className="border p-2">
                    No KK
                  </th>

                  <th className="border p-2">
                    Simpanan Pokok
                  </th>

                  <th className="border p-2">
                    Simpanan Wajib
                  </th>

                  <th className="border p-2">
                    Simpanan Sukarela
                  </th>

                  <th className="border p-2">
                    Total Dana
                  </th>

                </tr>

              </thead>



              <tbody>


                {
                  rekapGabungan.map((item:any)=>(


                    <tr key={item.id}>


                      <td className="border p-2 text-center">

                        {item.id}

                      </td>



                      <td className="border p-2">

                        {item.nama}

                      </td>



                      <td className="border p-2">

                        {item.no_kk}

                      </td>



                      <td className="border p-2 text-right">

                        Rp {Number(
                          item.pokok || 0
                        ).toLocaleString("id-ID")}

                      </td>



                      <td className="border p-2 text-right">

                        Rp {Number(
                          item.wajib || 0
                        ).toLocaleString("id-ID")}

                      </td>



                      <td className="border p-2 text-right">

                        Rp {Number(
                          item.sukarela || 0
                        ).toLocaleString("id-ID")}

                      </td>



                      <td className="border p-2 text-right font-bold">


                        Rp {(
                          Number(item.pokok || 0) +
                          Number(item.wajib || 0) +
                          Number(item.sukarela || 0)

                        ).toLocaleString("id-ID")}


                      </td>


                    </tr>


                  ))
                }


              </tbody>


            </table>


          </div>



        </div>


      </div>


    </div>


  );

}
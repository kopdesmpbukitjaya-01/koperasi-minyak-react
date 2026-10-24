import { useEffect, useState } from "react";
import IdCard from "../components/IdCard";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";


import {
  getWarga,
  addWarga,
  updateWarga,
  deleteWarga,
} from "../services/warga";

export default function Warga() {

  const navigate = useNavigate();


  const [list, setList] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const [nama, setNama] = useState("");
  const [noKK, setNoKK] = useState("");

  const [status, setStatus] = useState("Anggota");

  const [alamat, setAlamat] = useState("Bukit Jaya");

  const [noHp, setNoHp] = useState("");

  const [saving, setSaving] = useState(false);

  const [rapikanLoading, setRapikanLoading] = useState(false);

  const [editId, setEditId] = useState<number | null>(null);

  const [selectedWarga, setSelectedWarga] = useState<any | null>(null);



  useEffect(() => {

    loadData();

  }, []);




  async function loadData() {

    const data = await getWarga();

    setList(data);

  }





  // =====================================
  // FORMAT NAMA OTOMATIS
  // =====================================


  function formatNama(
    namaInput: string,
    statusInput: string
  ) {


    const namaBersih = namaInput
      .trim()
      .replace(/\s+/g, " ");



    if (
      statusInput
        .trim()
        .toLowerCase() === "anggota"
    ) {

      return namaBersih.toUpperCase();

    }



    return namaBersih
      .toLowerCase()
      .split(" ")
      .map((kata) =>
        kata.charAt(0).toUpperCase() +
        kata.slice(1)
      )
      .join(" ");

  }





  // =====================================
  // EDIT WARGA
  // =====================================


  function edit(w: any) {


    setEditId(w.id);


    setNoKK(
      w.no_kk ?? ""
    );


    setNama(
      w.nama ?? ""
    );


    setStatus(
      w.status ?? "Anggota"
    );


    setAlamat(
      w.alamat ?? ""
    );


    setNoHp(
      w.no_hp ?? ""
    );


    window.scrollTo({
      top:0,
      behavior:"smooth"
    });


  }





  // =====================================
  // HAPUS WARGA
  // =====================================


  async function hapus(id:number) {


    const yakin = confirm(
      "Yakin ingin menghapus data ini?"
    );


    if(!yakin) return;



    try {


      await deleteWarga(id);


      await loadData();


      alert(
        "Data berhasil dihapus"
      );


    } catch(err:any){


      alert(
        err.message
      );


    }


  }





  // =====================================
  // SIMPAN / UPDATE DATA
  // =====================================


  async function simpan(){


    if(saving) return;



    if(!nama.trim()){


      alert(
        "Nama warga wajib diisi"
      );


      return;


    }



    setSaving(true);



    try{


      const namaFormatted =
        formatNama(
          nama,
          status
        );



      if(editId === null){


        await addWarga(

          noKK,

          namaFormatted,

          status,

          alamat,

          noHp

        );



        alert(
          "Data berhasil ditambahkan"
        );



      } else {



        await updateWarga(

          editId,

          noKK,

          namaFormatted,

          status,

          alamat,

          noHp

        );



        alert(
          "Data berhasil diupdate"
        );



        setEditId(null);


      }



      setNoKK("");

      setNama("");

      setStatus("Anggota");

      setAlamat("Bukit Jaya");

      setNoHp("");



      await loadData();



    }catch(err:any){


      alert(
        err.message
      );


    }finally{


      setSaving(false);


    }


  }
    // =====================================
  // RAPIKAN SEMUA NAMA LAMA
  // =====================================


  async function rapikanSemuaNama(){


    if(rapikanLoading) return;



    if(list.length === 0){


      alert(
        "Belum ada data warga."
      );


      return;


    }



    const konfirmasi = confirm(

      `Rapikan semua nama warga?\n\n` +

      `Anggota → HURUF KAPITAL SEMUA\n` +

      `Non-Anggota → Huruf Awal Kapital\n\n` +

      `Jumlah data: ${list.length} warga\n\n` +

      `Data KK, alamat, nomor HP, dan kode warga tidak akan diubah.`

    );



    if(!konfirmasi) return;



    setRapikanLoading(true);



    try{


      let berhasil = 0;



      for(const w of list){


        const namaFormatted =
          formatNama(
            String(w.nama ?? ""),
            String(w.status ?? "")
          );



        await updateWarga(

          w.id,

          w.no_kk,

          namaFormatted,

          w.status,

          w.alamat,

          w.no_hp

        );



        berhasil++;


      }



      await loadData();



      alert(

        `Berhasil merapikan ${berhasil} nama warga.`

      );



    }catch(err:any){


      alert(

        "Terjadi kesalahan saat merapikan nama:\n" +

        err.message

      );


    }finally{


      setRapikanLoading(false);


    }


  }





  // =====================================
  // JUMLAH ANGGOTA DAN NON ANGGOTA
  // =====================================


  const jumlahAnggota =
    list.filter(

      (w)=>

        String(w.status ?? "")

          .trim()

          .toLowerCase()

          === "anggota"

    ).length;




  const jumlahNonAnggota =
    list.filter(

      (w)=>

        String(w.status ?? "")

          .trim()

          .toLowerCase()

          === "non-anggota"

    ).length;







  // =====================================
  // FILTER DAN URUTKAN DATA
  // =====================================


  const filteredList = [

    ...list

  ]

  .filter((w)=>

    String(w.nama ?? "")

      .toLowerCase()

      .includes(

        search.toLowerCase()

      )

  )

  .sort((a,b)=>{


    const statusA =
      String(a.status ?? "")

      .trim()

      .toLowerCase();



    const statusB =
      String(b.status ?? "")

      .trim()

      .toLowerCase();




    if(

      statusA === "anggota" &&

      statusB !== "anggota"

    ){

      return -1;

    }



    if(

      statusA !== "anggota" &&

      statusB === "anggota"

    ){

      return 1;

    }




    return String(a.nama ?? "")

      .localeCompare(

        String(b.nama ?? ""),

        "id",

        {

          sensitivity:"base"

        }

      );


  });







  return (

    <Layout>

      <div className="space-y-8">





        {/* HEADER */}


        <div className="flex items-center justify-between">


          <div>


            <h1 className="text-4xl font-bold text-red-700">


              👥 Data Warga


            </h1>



            <p className="text-gray-500 mt-2">


              Kelola data warga Pertashop KDMP Bukit Jaya


            </p>


          </div>




          <button

            onClick={()=>

              navigate("/dashboard")

            }

            className="
bg-blue-600
hover:bg-blue-700
text-white
px-6
py-3
rounded-xl
shadow-lg
transition
"

          >

            ← Dashboard


          </button>


        </div>





        {/* FORM DATA WARGA */}


       <div className="bg-slate-900 rounded-3xl shadow-xl p-8 border border-white/10">


          <h2 className="text-2xl font-bold text-red-700 mb-8">


            {editId === null

              ? "Tambah Data Warga"

              : "Edit Warga"

            }


          </h2>
                    <div className="grid md:grid-cols-2 gap-6">


            {/* NOMOR KK */}

            <div>

              <label className="block text-sm font-semibold text-white mb-2">

                Nomor KK

              </label>


              <input

                type="text"

                placeholder="Masukkan Nomor KK"

                value={noKK}

                onChange={(e)=>

                  setNoKK(e.target.value)

                }

                className="
w-full
rounded-xl
border
border-white/20
bg-white/10
text-white
placeholder-gray-400
px-4
py-3
focus:outline-none
focus:ring-2
focus:ring-red-600
"

              />


            </div>





            {/* NAMA */}

            <div>


              <label className="block text-sm font-semibold text-white mb-2">

                Nama Lengkap

              </label>



              <input

                type="text"

                placeholder="Masukkan Nama"

                value={nama}

                onChange={(e)=>

                  setNama(e.target.value)

                }

                className="
w-full
rounded-xl
border
border-white/20
bg-white/10
text-white
placeholder-gray-400
px-4
py-3
focus:outline-none
focus:ring-2
focus:ring-red-600
"

              />


            </div>





            {/* STATUS */}


            <div>


              <label className="block text-sm font-semibold text-white mb-2">

                Status

              </label>



              <select

                value={status}

                onChange={(e)=>

                  setStatus(e.target.value)

                }

                className="
w-full
rounded-xl
border
border-white/20
bg-white/10
text-white
placeholder-gray-400
px-4
py-3
focus:outline-none
focus:ring-2
focus:ring-red-600
"

              >


                <option value="Anggota">

                  🟢 Anggota

                </option>



                <option value="Non-Anggota">

                  ⚪ Non-Anggota

                </option>


              </select>


            </div>





            {/* ALAMAT */}


            <div>


              <label className="block text-sm font-semibold text-white mb-2">

                Alamat

              </label>



              <input

                type="text"

                placeholder="Masukkan Alamat"

                value={alamat}

                onChange={(e)=>

                  setAlamat(e.target.value)

                }

                className="
w-full
rounded-xl
border
border-white/20
bg-white/10
text-white
placeholder-gray-400
px-4
py-3
focus:outline-none
focus:ring-2
focus:ring-red-600
"

              />


            </div>





            {/* NOMOR HP */}


            <div>


              <label className="block text-sm font-semibold text-white mb-2">

                Nomor HP

              </label>



              <input

                type="text"

                placeholder="08xxxxxxxxxx"

                value={noHp}

                onChange={(e)=>

                  setNoHp(e.target.value)

                }

                className="
w-full
rounded-xl
border
border-white/20
bg-white/10
text-white
placeholder-gray-400
px-4
py-3
focus:outline-none
focus:ring-2
focus:ring-red-600
"

              />


            </div>



          </div>





          {/* TOMBOL */}


          <div className="flex gap-4 mt-8">


            <button

              type="button"

              onClick={simpan}

              disabled={saving}

              className={`px-8 py-3 rounded-xl shadow-lg transition font-semibold text-white ${

                saving

                  ? "bg-gray-400 cursor-not-allowed"

                  : "bg-red-700 hover:bg-red-800"

              }`}

            >


              {saving

                ? "⏳ Menyimpan..."

                : editId === null

                  ? "💾 Simpan"

                  : "✏️ Update"

              }


            </button>





            {editId !== null && (


              <button

                type="button"

                onClick={() => {


                  setEditId(null);

                  setNoKK("");

                  setNama("");

                  setStatus("Anggota");

                  setAlamat("Bukit Jaya");

                  setNoHp("");

                }}

                className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-xl shadow-lg transition font-semibold"

              >

                Batal

              </button>


            )}


          </div>



        </div>







        {/* TABEL DATA WARGA */}


       <div className="bg-slate-900 rounded-3xl shadow-xl p-8 border border-white/10">


          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">


            <h2 className="text-2xl font-bold text-red-700">

              Daftar Warga

            </h2>




            <div className="flex flex-wrap gap-4">



              {/* JUMLAH ANGGOTA */}


              <div
className="
min-w-[150px]
rounded-2xl
px-6
py-4
bg-gradient-to-br
from-green-400/30
to-green-700/40
border
border-green-400/50
shadow-[0_0_25px_rgba(34,197,94,0.6)]
backdrop-blur-xl
transition
hover:scale-105
hover:shadow-[0_0_40px_rgba(34,197,94,0.9)]
"
>


                <p className="
text-sm
font-bold
text-green-300
drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]
">

                  🟢 Anggota

                </p>



                <p className="
text-4xl
font-black
text-white
drop-shadow-[0_3px_3px_rgba(0,0,0,0.9)]
">

                  {jumlahAnggota}

                </p>



                <p className="
text-sm
font-bold
text-green-200
">

                  orang

                </p>


              </div>





              {/* NON ANGGOTA */}


              <div
className="
min-w-[150px]
rounded-2xl
px-6
py-4
bg-gradient-to-br
from-gray-300/30
to-gray-700/40
border
border-gray-400/40
shadow-[0_0_25px_rgba(148,163,184,0.5)]
backdrop-blur-xl
transition
hover:scale-105
hover:shadow-[0_0_40px_rgba(148,163,184,0.8)]
"
>


                <p
className="
text-sm
font-black
text-white
drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]
"
>
  ⚪ Non-Anggota
</p>



                <p
className="
text-4xl
font-black
text-white
drop-shadow-[0_3px_6px_rgba(0,0,0,0.9)]
"
>
  {jumlahNonAnggota}
</p>



               <p
className="
text-sm
font-semibold
text-gray-300
drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)]
"
>
  orang
</p>


              </div>





              {/* RAPIKAN NAMA */}


              <button

                type="button"

                onClick={rapikanSemuaNama}

                disabled={rapikanLoading}

                className={`px-6 py-3 rounded-xl shadow-lg transition font-semibold text-white ${

                  rapikanLoading

                    ? "bg-gray-400 cursor-not-allowed"

                    : "bg-blue-600 hover:bg-blue-700"

                }`}

              >


                {rapikanLoading

                  ? "⏳ Sedang Merapikan..."

                  : "🔄 Rapikan Semua Nama"

                }


              </button>





              {/* PRINT ID CARD */}


              <button

                type="button"

                onClick={()=>

                  navigate("/print-id-card")

                }

                className="
bg-gradient-to-r
from-red-600
to-red-800
text-white
px-6
py-3
rounded-xl
font-semibold
shadow-[0_0_30px_rgba(239,68,68,0.7)]
hover:shadow-[0_0_45px_rgba(239,68,68,1)]
hover:scale-105
transition
"

              >

                📄 Download Semua ID Card

              </button>



            </div>


          </div>
                    {/* PENCARIAN */}


          <div className="mb-6">


            <input

  type="text"

  placeholder="🔍 Cari nama warga..."

  value={search}

  onChange={(e)=>
    setSearch(e.target.value)
  }

  className="
  w-full
  md:w-96
  rounded-xl
  border
  border-gray-300
  bg-white
  text-gray-900
  placeholder:text-gray-400
  px-4
  py-3
  focus:outline-none
  focus:ring-2
  focus:ring-red-600
  "

/>


          </div>





          {/* TABLE */}


          <div className="overflow-x-auto">


            <table className="w-full text-white">


              <thead className="bg-red-700 text-white">


                <tr>


                  <th className="px-4 py-3 text-left">
                    Kode Warga
                  </th>


                  <th className="px-4 py-3 text-left">
                    Nomor KK
                  </th>


                  <th className="px-4 py-3 text-left">
                    Nama
                  </th>


                  <th className="px-4 py-3 text-center">
                    Status
                  </th>


                  <th className="px-4 py-3 text-left">
                    Alamat
                  </th>


                  <th className="px-4 py-3 text-left">
                    No HP
                  </th>


                  <th className="px-4 py-3 text-center">
                    Aksi
                  </th>


                </tr>


              </thead>





              <tbody>


                {filteredList.map((w)=>(


                  <tr

                    key={w.id}

                    className="
border-b
border-white/10
hover:bg-white/5
transition
"

                  >


                    <td className="px-4 py-4">

                      <span className="font-bold text-red-700">

                        {w.kode_warga}

                      </span>

                    </td>




                    <td className="px-4 py-4">

                      {w.no_kk}

                    </td>




                    <td

                      className={`px-4 py-4 ${

                        String(w.status ?? "")

                          .trim()

                          .toLowerCase() === "anggota"

                          ? "font-bold"

                          : "font-medium"

                      }`}

                    >

                      {w.nama}

                    </td>





                    <td className="px-4 py-4 text-center">


                      <span

                        className={

                          String(w.status ?? "")

                            .trim()

                            .toLowerCase() === "anggota"
? "bg-green-500/20 text-green-300 border border-green-400/40 px-3 py-1 rounded-full text-sm font-bold"

: "bg-slate-500/30 text-gray-200 border border-gray-400/40 px-3 py-1 rounded-full text-sm font-bold"
                        }

                      >

                        {w.status}

                      </span>


                    </td>





                    <td className="px-4 py-4">

                      {w.alamat}

                    </td>





                    <td className="px-4 py-4">

                      {w.no_hp}

                    </td>





                    <td className="px-4 py-4">


                      <div className="flex justify-center gap-3">


                        <button

                          onClick={()=>edit(w)}

                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"

                        >

                          ✏️ Edit

                        </button>





                        <button

                          type="button"

                          onClick={()=>setSelectedWarga(w)}

                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow"

                        >

                          🪪 ID Card

                        </button>





                        <button

                          onClick={()=>hapus(w.id)}

                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow"

                        >

                          🗑️ Hapus

                        </button>



                      </div>


                    </td>



                  </tr>


                ))}


              </tbody>


            </table>


          </div>


        </div>





      </div>





      {/* PREVIEW ID CARD */}


      {selectedWarga && (


        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">


          <div className="relative">


            <IdCard

              nama={selectedWarga.nama}

              noKK={selectedWarga.no_kk}

              kodeWarga={selectedWarga.kode_warga}

              status={selectedWarga.status}

            />





            <button

              type="button"

              onClick={()=>setSelectedWarga(null)}

              className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-800 text-white text-lg shadow-lg"

            >

              ×

            </button>



          </div>


        </div>


            )}

    </Layout>

  );

}
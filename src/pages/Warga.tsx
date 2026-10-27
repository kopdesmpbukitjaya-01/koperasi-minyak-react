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
  const [detailWarga, setDetailWarga] = useState<any | null>(null);



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

const totalWarga =
  jumlahAnggota + jumlahNonAnggota;


const persentaseAnggota =
  totalWarga === 0
    ? 0
    : Math.round(
        (jumlahAnggota / totalWarga) * 100
      );





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

<div
className="
relative
overflow-hidden
rounded-3xl
p-8
bg-gradient-to-br
from-red-950
via-purple-950
to-blue-950
border
border-white/20
shadow-[0_0_40px_rgba(239,68,68,0.5)]
"
>

<div
className="
absolute
inset-0
bg-gradient-to-r
from-red-500/10
via-purple-500/10
to-blue-500/10
blur-3xl
"
/>


<div className="relative flex items-center justify-between">


<div>

<h1
className="
text-4xl
font-black
text-white
"
>
👥 Data Warga
</h1>


<p
className="
text-gray-300
mt-3
text-lg
"
>
Kelola data warga Pertashop KDMP Bukit Jaya
</p>


</div>


<button

onClick={()=>navigate("/dashboard")}

className="
px-6
py-3
rounded-xl
font-bold
text-white
bg-gradient-to-r
from-blue-600
to-cyan-600
shadow-[0_0_25px_rgba(34,211,238,0.7)]
hover:scale-105
transition
"

>
← Dashboard
</button>


</div>
</div>
</div>

        {/* FORM DATA WARGA */}


       <div
className="
relative
overflow-hidden
rounded-3xl
p-8
bg-gradient-to-br
from-slate-950
via-purple-950
to-red-950
border
border-white/20
shadow-[0_0_45px_rgba(168,85,247,0.35)]
backdrop-blur-xl
"
>


          <h2
className="
text-3xl
font-black
text-white
mb-8
drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]
"
>


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
bg-black/30
text-white
placeholder-gray-400
px-4
py-3
backdrop-blur-xl
shadow-inner
transition
focus:outline-none
focus:ring-2
focus:ring-red-500
focus:border-red-400
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
bg-black/30
text-white
placeholder-gray-400
px-4
py-3
backdrop-blur-xl
shadow-inner
transition
focus:outline-none
focus:ring-2
focus:ring-red-500
focus:border-red-400
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
bg-black/30
text-white
placeholder-gray-400
px-4
py-3
backdrop-blur-xl
shadow-inner
transition
focus:outline-none
focus:ring-2
focus:ring-red-500
focus:border-red-400
"

              >


                <option value="Anggota" className="bg-slate-900 text-white">

                  🟢 Anggota

                </option>



                <option value="Non-Anggota" className="bg-slate-900 text-white">

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
bg-black/30
text-white
placeholder-gray-400
px-4
py-3
backdrop-blur-xl
shadow-inner
transition
focus:outline-none
focus:ring-2
focus:ring-red-500
focus:border-red-400
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
bg-black/30
text-white
placeholder-gray-400
px-4
py-3
backdrop-blur-xl
shadow-inner
transition
focus:outline-none
focus:ring-2
focus:ring-red-500
focus:border-red-400
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

                  : "bg-gradient-to-r from-red-600 to-purple-700 shadow-[0_0_25px_rgba(239,68,68,0.8)] hover:scale-105"

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


       <div
className="
relative
overflow-hidden
rounded-3xl
p-8
bg-gradient-to-br
from-slate-950
via-blue-950/40
to-purple-950/40
border
border-white/20
shadow-[0_0_45px_rgba(59,130,246,0.35)]
backdrop-blur-xl
"
>


          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">


            <h2
className="
text-3xl
font-black
text-white
drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]
"
>

              Daftar Warga

            </h2>




            <div className="flex flex-wrap gap-4">



              {/* JUMLAH ANGGOTA */}


              <div
className="
relative
overflow-hidden
min-w-[170px]
rounded-3xl
px-6
py-5
bg-gradient-to-br
from-green-400/30
via-emerald-900/50
to-black
border
border-green-400/50
shadow-[0_0_35px_rgba(34,197,94,0.7)]
backdrop-blur-xl
transition
hover:scale-105
hover:shadow-[0_0_50px_rgba(34,197,94,1)]
"
>
  <div
className="
absolute
-top-10
-right-10
w-32
h-32
bg-green-400/20
rounded-full
blur-3xl
"
/>

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
relative
overflow-hidden
min-w-[170px]
rounded-3xl
px-6
py-5
bg-gradient-to-br
from-slate-300/30
via-slate-900/60
to-black
border
border-slate-300/40
shadow-[0_0_35px_rgba(148,163,184,0.7)]
backdrop-blur-xl
transition
hover:scale-105
hover:shadow-[0_0_50px_rgba(148,163,184,1)]
"
>
<div
className="
absolute
-top-10
-right-10
w-32
h-32
bg-slate-300/20
rounded-full
blur-3xl
"
/>

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


{/* STATISTIK ANGGOTA */}

<div className="
grid
md:grid-cols-3
gap-6
mb-8
">


<div
className="
rounded-3xl
p-6
bg-gradient-to-br
from-blue-600/40
to-blue-950/60
border
border-blue-400/40
shadow-[0_0_30px_rgba(59,130,246,0.6)]
"
>

<p className="text-blue-200 font-bold">
👥 Total Warga
</p>

<h2 className="
text-5xl
font-black
text-white
mt-3
">
{totalWarga}
</h2>

<p className="text-gray-300">
orang
</p>

</div>



<div
className="
rounded-3xl
p-6
bg-gradient-to-br
from-green-500/40
to-green-950/60
border
border-green-400/40
shadow-[0_0_30px_rgba(34,197,94,0.6)]
"
>

<p className="text-green-300 font-bold">
🟢 Anggota
</p>

<h2 className="
text-5xl
font-black
text-white
mt-3
">
{jumlahAnggota}
</h2>

<p className="text-gray-300">
{persentaseAnggota}% dari total
</p>

</div>



<div
className="
rounded-3xl
p-6
bg-gradient-to-br
from-slate-400/30
to-black
border
border-slate-300/40
shadow-[0_0_30px_rgba(148,163,184,0.6)]
"
>

<p className="text-gray-200 font-bold">
⚪ Non-Anggota
</p>

<h2 className="
text-5xl
font-black
text-white
mt-3
">
{jumlahNonAnggota}
</h2>

<p className="text-gray-300">
{100-persentaseAnggota}% dari total
</p>

</div>


</div>


          {/* SEARCH RESULT WARGA */}

<div
className="
bg-slate-900
rounded-3xl
p-8
border
border-white/10
shadow-xl
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
🔍 Cari Data Warga
</h2>


<input

type="text"

placeholder="Ketik nama warga..."

value={search}

onChange={(e)=>setSearch(e.target.value)}

className="
w-full
rounded-2xl
bg-black/40
border
border-white/20
text-white
placeholder-gray-400
px-5
py-4
text-lg
focus:outline-none
focus:ring-2
focus:ring-red-500
"

/>



{
search.trim() === "" ? (


<div
className="
mt-10
text-center
text-gray-400
py-10
"
>

<div className="text-5xl mb-4">
👥
</div>

<p>
Ketik nama warga untuk menampilkan data
</p>

</div>


) : (


<div className="mt-8 space-y-4">


<h3
className="
text-white
font-bold
text-xl
"
>

Hasil pencarian "{search}"

</h3>



{

filteredList.map((w)=>(


<div

key={w.id}

className="
flex
items-center
justify-between
bg-white/5
border
border-white/10
rounded-2xl
p-5
hover:bg-white/10
transition
"

>


<div>


<h3
className="
text-xl
font-black
text-white
"
>

{w.nama}

</h3>


<p
className="
text-red-400
font-bold
mt-1
"
>

{w.kode_warga}

</p>


<span
className={

String(w.status ?? "")
.toLowerCase()
.trim()
==="anggota"

?

"inline-block mt-2 px-3 py-1 rounded-full bg-green-500/20 text-green-300 border border-green-400/40 text-sm font-bold"

:

"inline-block mt-2 px-3 py-1 rounded-full bg-gray-500/20 text-gray-300 border border-gray-400/40 text-sm font-bold"

}

>

{w.status}

</span>


</div>



<button

type="button"

onClick={()=>setDetailWarga(w)}

className="
bg-gradient-to-r
from-red-600
to-purple-700
text-white
px-6
py-3
rounded-xl
font-bold
shadow-[0_0_25px_rgba(239,68,68,0.7)]
hover:scale-105
transition
"

>

DETAIL

</button>



</div>


))


}



</div>


)


}


</div>

{/* DETAIL WARGA */}

{detailWarga && (

<div
className="
fixed
inset-0
z-50
flex
items-center
justify-center
bg-black/70
backdrop-blur-md
"
>

<div
className="
w-full
max-w-md
rounded-3xl
bg-slate-900
border
border-white/20
p-8
shadow-[0_0_50px_rgba(239,68,68,0.6)]
"
>


<h2
className="
text-3xl
font-black
text-white
mb-6
"
>
Detail Warga
</h2>



<div
className="
space-y-3
text-gray-200
"
>

<p>
<b>Kode Warga:</b>{" "}
{detailWarga.kode_warga}
</p>

<p>
<b>Nama:</b>{" "}
{detailWarga.nama}
</p>


<p>
<b>No KK:</b>{" "}
{detailWarga.no_kk}
</p>


<p>
<b>Alamat:</b>{" "}
{detailWarga.alamat}
</p>


<p>
<b>No HP:</b>{" "}
{detailWarga.no_hp}
</p>


<p>
<b>Status:</b>{" "}
{detailWarga.status}
</p>


</div>



<div
className="
flex
gap-3
mt-8
"
>


<button

onClick={()=>edit(detailWarga)}

className="
flex-1
bg-blue-600
text-white
rounded-xl
py-3
font-bold
"
>

✏️ Edit

</button>



<button

onClick={()=>setSelectedWarga(detailWarga)}

className="
flex-1
bg-red-600
text-white
rounded-xl
py-3
font-bold
"
>

🪪 ID Card

</button>



<button

onClick={()=>hapus(detailWarga.id)}

className="
bg-black
border
border-red-500
text-red-400
px-4
rounded-xl
font-bold
"
>

🗑

</button>


</div>



<button

onClick={()=>setDetailWarga(null)}

className="
mt-4
w-full
bg-gray-700
text-white
py-3
rounded-xl
font-bold
"
>

Tutup

</button>


</div>

</div>

)}
                  {/* PREVIEW ID CARD */}

      {selectedWarga && (

        <div
className="
fixed
inset-0
z-50
flex
items-center
justify-center
bg-black/70
backdrop-blur-md
"
>

          <div
className="
relative
p-4
rounded-3xl
border
border-red-400/40
bg-gradient-to-br
from-slate-900
via-purple-900/40
to-black
shadow-[0_0_60px_rgba(239,68,68,0.7)]
"
>

            <IdCard
              nama={selectedWarga.nama}
              noKK={selectedWarga.no_kk}
              kodeWarga={selectedWarga.kode_warga}
              status={selectedWarga.status}
            />

            <button
              type="button"
              onClick={()=>setSelectedWarga(null)}
              className="
absolute
-right-4
-top-4
flex
h-10
w-10
items-center
justify-center
rounded-full
bg-gradient-to-br
from-red-600
to-purple-700
text-white
text-xl
font-bold
shadow-[0_0_25px_rgba(239,68,68,0.9)]
hover:scale-110
transition
"
            >
              ×
                        </button>


          </div>

        </div>

      )}

      </div>

    </Layout>

  );

}
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import logoKoperasi from "../assets/logo_transparan.png";
import { getStrukturOrganisasi } from "../services/struktur_organisasi";
import { getProfilKoperasi } from "../services/profil_koperasi";


export default function ProfilKoperasi(){

const [struktur,setStruktur]=useState<any[]>([]);
const [profil,setProfil]=useState<any>(null);



useEffect(()=>{

loadData();

},[]);



async function loadData(){

try{

const tahun =
new Date().getFullYear();


const data =
await getStrukturOrganisasi(tahun);


const dataProfil =
await getProfilKoperasi();







console.log(
"DATA STRUKTUR KOPERASI:",
data
);



console.log(
"DATA PROFIL KOPERASI:",
dataProfil
);



setStruktur(data || []);


setProfil(dataProfil);


}catch(error){

console.error(
"ERROR PROFIL:",
error
);

}

}




const pengurus =
struktur
.filter(
(item)=>
String(item.kategori)
.trim()
.toLowerCase()
===
"pengurus"
)
.sort((a,b)=>{

if(a.jabatan === "Ketua") return -1;
if(b.jabatan === "Ketua") return 1;

return 0;

});


const ketua =
pengurus.filter(
(item)=>
String(item.jabatan)
.trim()
.toLowerCase()
===
"ketua"
);


const pengurusLain =
pengurus.filter(
(item)=>
String(item.jabatan)
.trim()
.toLowerCase()
!==
"ketua"
);


const pengawas =
struktur.filter(
(item)=>
String(item.kategori)
.trim()
.toLowerCase()
===
"pengawas"
);



return (

<Layout>

<div className="
p-6
text-white
">

<div
className="
mb-8
rounded-3xl
p-6
bg-gradient-to-br
from-red-600/30
via-purple-700/30
to-black/60
border
border-red-400/40
shadow-2xl
backdrop-blur-xl
"
>

<div
className="
flex
flex-col
md:flex-row
items-center
gap-5
text-center
md:text-left
"
>


<div
className="
w-20
h-20
rounded-2xl
bg-white/10
border
border-red-400/50
flex
items-center
justify-center
overflow-hidden
shadow-lg
"
>

<img
src={logoKoperasi}
alt="Logo KDMP Bukit Jaya"
className="
w-full
h-full
object-contain
p-2
"
/>

</div>



<div>

<h1
className="
text-2xl
md:text-3xl
font-bold
text-white
leading-tight
"
>

{profil?.nama_koperasi || "Profil Koperasi"}

</h1>


<p
className="
mt-2
text-base
font-bold
text-gray-300
"
>

Koperasi Desa Merah Putih
<br/>
Bukit Jaya Kecamatan Bulik Timur

</p>


<div
className="
mt-3
inline-flex
px-3
py-1
rounded-full
bg-green-500/20
border
border-green-400/40
text-green-300
text-xs
font-semibold
"
>

🟢 Aktif

</div>


</div>


</div>


</div>


{/* PROFIL UTAMA */}

{
profil && (

<div
className="
mb-8
rounded-2xl
p-6
bg-black/40
border
border-white/20
backdrop-blur-xl
shadow-xl
"
>

<h2
className="
text-xl
font-bold
text-red-300
mb-4
"
>
🏢 Tentang Koperasi
</h2>


<p
className="
text-gray-200
leading-relaxed
whitespace-pre-line
"
>
{profil.deskripsi}
</p>



<div
className="
grid
grid-cols-1
sm:grid-cols-2
gap-4
mt-5
"
>


<div
className="
rounded-xl
p-4
bg-white/5
border
border-white/10
"
>

<p
className="
text-xs
text-gray-400
"
>
Status Badan Hukum
</p>


<p
className="
text-green-300
font-bold
mt-1
"
>
🟢 {profil.status_badan_hukum || "Aktif"}
</p>

</div>



<div
className="
rounded-xl
p-4
bg-white/5
border
border-white/10
"
>

<p
className="
text-xs
text-gray-400
"
>
Alamat
</p>


<p
className="
text-white
font-semibold
mt-1
"
>
📍 {profil.alamat || "Bukit Jaya"}
</p>

</div>


</div>


</div>

)
}


{/* VISI MISI */}

{
profil && (

<div
className="
grid
grid-cols-1
md:grid-cols-2
gap-5
mb-8
"
>


{/* VISI */}

<div
className="
rounded-3xl
p-6
bg-gradient-to-br
from-blue-600/20
to-black/50
border
border-blue-400/40
shadow-xl
backdrop-blur-xl
"
>

<div
className="
flex
items-center
gap-3
mb-4
"
>

<div
className="
w-10
h-10
rounded-xl
bg-blue-500/20
border
border-blue-400/40
flex
items-center
justify-center
"
>
🎯
</div>


<h2
className="
text-xl
font-bold
text-blue-300
"
>
Visi
</h2>


</div>



<p
className="
text-gray-200
leading-relaxed
whitespace-pre-line
text-base
font-bold
"
>
{profil.visi}
</p>


</div>





{/* MISI */}

<div
className="
rounded-3xl
p-6
bg-gradient-to-br
from-red-600/20
to-black/50
border
border-red-400/40
shadow-xl
backdrop-blur-xl
"
>


<div
className="
flex
items-center
gap-3
mb-4
"
>


<div
className="
w-10
h-10
rounded-xl
bg-red-500/20
border
border-red-400/40
flex
items-center
justify-center
"
>
🚀
</div>


<h2
className="
text-xl
font-bold
text-red-300
"
>
Misi
</h2>


</div>



<p
className="
text-gray-200
leading-relaxed
whitespace-pre-line
text-base
font-bold
"
>
{profil.misi}
</p>


</div>



</div>

)
}


{/* PENGURUS */}

<div className="mb-10">

  <h2 className="text-2xl font-bold mb-2 text-red-300">
    👔 Pengurus Koperasi
  </h2>

  <p className="text-gray-400 mb-6">
    Struktur Organisasi Koperasi Desa Merah Putih Bukit Jaya
  </p>

  {/* ======================= KETUA ======================= */}

  {
    ketua.map((item) => (

      <div
        key={item.id}
        className="
        mb-8
        rounded-3xl
        p-6
        bg-gradient-to-br
        from-red-500/20
        to-purple-600/20
        border
        border-red-400/40
        shadow-2xl
        backdrop-blur-xl
        text-center
        "
      >

        <div
          className="
          w-40
          h-40
          mx-auto
          rounded-full
          overflow-hidden
          border-[5px]
          border-red-400
          shadow-xl
          bg-black/40
          "
        >

          {
            item.warga?.foto ?

              <img
                src={item.warga.foto}
                alt={item.warga.nama}
                className="w-full h-full object-cover"
              />

              :

              <div className="flex items-center justify-center h-full text-6xl">
                👤
              </div>

          }

        </div>

        <h3 className="text-3xl font-bold text-white mt-5">
          {item.warga?.nama}
        </h3>

        <div
          className="
          inline-block
          mt-3
          px-5
          py-2
          rounded-full
          bg-red-500/20
          border
          border-red-400
          text-red-300
          font-bold
          "
        >
          {item.jabatan}
        </div>

        <div className="mt-5 text-gray-300">
          Kode :
          <span className="text-green-300 font-bold ml-2">
            {item.warga?.kode_warga}
          </span>
        </div>

        <div className="text-gray-400 text-base
font-bold mt-2">
          No. KK : {item.warga?.no_kk}
        </div>

      </div>

    ))
  }


  {/* ======================= PENGURUS LAIN ======================= */}

  <div
    className="
    grid
    grid-cols-1
    md:grid-cols-2
    lg:grid-cols-3
    gap-6
    "
  >

    {
      pengurusLain.map((item) => (

        <div
          key={item.id}
          className="
          rounded-3xl
          p-5
          bg-white/5
          border
          border-white/20
          backdrop-blur-xl
          shadow-xl
          text-center
          hover:border-red-400
          hover:-translate-y-2
hover:scale-105
hover:shadow-2xl
          transition-all
          duration-300
          "
        >

          <div
className="
w-40
h-40
mx-auto
rounded-full
overflow-hidden
border-[5px]
border-red-400
bg-black/40
shadow-xl
mb-5
"
>

            {
              item.warga?.foto ?

                <img
                  src={item.warga.foto}
                  alt={item.warga.nama}
                  className="w-full h-full object-cover"
                />

                :

                <div className="flex items-center justify-center h-full text-4xl">
                  👤
                </div>

            }

          </div>

          <h3 className="font-bold text-lg text-white">
            {item.warga?.nama}
          </h3>

          <div
            className="
            inline-block
            mt-2
            px-3
            py-1
            rounded-full
            bg-red-500/20
            border
            border-red-400/40
            text-red-300
            text-base
font-bold
            "
          >
            {item.jabatan}
          </div>

          <div className="mt-4 text-base
font-bold text-gray-300">
            Kode :
            <span className="text-green-300 font-bold ml-1">
              {item.warga?.kode_warga}
            </span>
          </div>

          <div className="text-xs text-gray-400 mt-2">
            KK : {item.warga?.no_kk}
          </div>

        </div>

      ))
    }

  </div>

</div>


{/* PENGAWAS */}

<div className="mt-12">

  <h2 className="text-2xl font-bold mb-2 text-blue-300">
    🛡️ Dewan Pengawas
  </h2>

  <p className="text-gray-400 mb-6">
    Pengawas Internal Koperasi Desa Merah Putih Bukit Jaya
  </p>

  <div
    className="
    grid
    grid-cols-1
    md:grid-cols-2
    lg:grid-cols-3
    gap-6
    "
  >

    {
      pengawas.map((item) => (

        <div
          key={item.id}
          className="
          rounded-3xl
          p-5
          bg-gradient-to-br
          from-blue-500/15
          to-cyan-500/10
          border
          border-blue-400/40
          backdrop-blur-xl
          shadow-xl
          text-center
          hover:border-cyan-300
          hover:-translate-y-2
hover:scale-105
hover:shadow-2xl
          transition-all
          duration-300
          "
        >

          <div
className="
w-40
h-40
mx-auto
rounded-full
overflow-hidden
border-[5px]
border-red-400
bg-black/40
shadow-xl
mb-5
"
>

            {
              item.warga?.foto ?

                <img
                  src={item.warga.foto}
                  alt={item.warga.nama}
                  className="w-full h-full object-cover"
                />

                :

                <div className="flex items-center justify-center h-full text-4xl">
                  👤
                </div>

            }

          </div>

          <h3 className="text-lg font-bold text-white">
            {item.warga?.nama}
          </h3>

          <div
            className="
            inline-block
            mt-2
            px-3
            py-1
            rounded-full
            bg-blue-500/20
            border
            border-blue-400/40
            text-blue-300
            text-base
font-bold
            font-semibold
            "
          >
            {item.jabatan}
          </div>

          <div className="mt-4 text-base
font-bold text-gray-300">
            Kode :
            <span className="text-green-300 font-bold ml-1">
              {item.warga?.kode_warga}
            </span>
          </div>

          <div className="text-xs text-gray-400 mt-2">
            KK : {item.warga?.no_kk}
          </div>

        </div>

      ))
    }

  </div>

</div>



</div>


</Layout>

);


}
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getPortalAnggota
} from "../services/simpanan";
import {
  getLabaKoperasi
} from "../services/laba_koperasi";

import {
  cekTransaksiAnggota
} from "../services/transaksi";

export default function PortalAnggota(){
const navigate = useNavigate();
const [idAnggota,setIdAnggota] = useState("");
const [nama,setNama] = useState("");
const [infoAnggota,setInfoAnggota] = useState<any>(null);
const [infoTransaksi,setInfoTransaksi] = useState<any>(null);
const [loading,setLoading] = useState(false);
const [dataLaba,setDataLaba] = useState<any>(null);
const [loadingLaba,setLoadingLaba] = useState(false);
const [halaman,setHalaman] = useState<
"menu" | "rekening" | "laba"
>("menu");

async function bukaLaporanLaba(){

try{

setLoadingLaba(true);

const data = await getLabaKoperasi();

console.log(
"DATA LABA KOPERASI:",
data
);

setDataLaba(data);

}

catch(err){

console.error(err);

alert(
"Gagal mengambil laporan laba"
);

}

finally{

setLoadingLaba(false);

}

}
async function cekInformasiAnggota(){

try{

setLoading(true);


const data =
await getPortalAnggota(
idAnggota.trim(),
nama.trim()
);



setInfoAnggota(data);
const transaksi =
await cekTransaksiAnggota(
  idAnggota.trim()
);


setInfoTransaksi(transaksi);


console.log(
  "DATA TRANSAKSI ANGGOTA:",
  transaksi
);
console.log(
  "DATA ANGGOTA PORTAL:",
  data
);

}

catch(err){

console.error(err);

alert(
"Data anggota tidak ditemukan"
);

}

finally{

setLoading(false);

}

}



return (

<div
className="
min-h-screen
bg-[#050816]
text-white
p-5
"
>


<div
className="
max-w-xl
mx-auto
rounded-3xl
p-6
bg-white/5
border
border-purple-500/30
shadow-[0_0_40px_rgba(168,85,247,.25)]
"
>


<h1
className="
text-3xl
font-black
bg-gradient-to-r
from-red-400
via-purple-400
to-blue-400
bg-clip-text
text-transparent
"
>
💳 Portal Anggota
</h1>


<p className="text-gray-400 mt-2">
Informasi Simpanan & SHU Anggota Koperasi
</p>


{/* =========================
    MENU PORTAL ANGGOTA
========================= */}



{
halaman === "menu" && (

<div className="mt-6 space-y-5">


{/* KARTU CEK REKENING */}

<div
className="
rounded-2xl
p-5
bg-gradient-to-br
from-blue-900/40
to-purple-900/40
border
border-blue-400/30
"
>

<h2 className="text-xl font-bold">
🪪 Cek Rekening Anggota
</h2>


<p className="text-gray-400 mt-2">
Cek simpanan, transaksi BBM, dan SHU anggota
</p>


<button

onClick={()=>{
setHalaman("rekening");
}}

className="
mt-4
w-full
p-3
rounded-xl
bg-gradient-to-r
from-blue-600
to-purple-600
font-bold
"

>

Buka Cek Rekening

</button>


</div>




{/* KARTU LABA */}

<div
className="
rounded-2xl
p-5
bg-gradient-to-br
from-green-900/40
to-cyan-900/40
border
border-green-400/30
"
>

<h2 className="text-xl font-bold">
📊 Laporan Laba Koperasi
</h2>


<p className="text-gray-400 mt-2">
Lihat laporan perkembangan laba koperasi
</p>


<button

onClick={()=>{
setHalaman("laba");
bukaLaporanLaba();
}}

className="
mt-4
w-full
p-3
rounded-xl
bg-gradient-to-r
from-green-600
to-cyan-600
font-bold
"

>

📊 Buka Laporan Laba

</button>


</div>


</div>

)
}


{
halaman === "rekening" && (

<div className="mt-6 space-y-6">


<button
onClick={()=>setHalaman("menu")}
className="
px-4
py-2
rounded-xl
bg-gray-700
"
>
⬅ Kembali
</button>


<div
className="
rounded-2xl
p-5
bg-black/30
border
border-blue-500/30
"
>


<h2 className="text-2xl font-bold text-blue-300">
🪪 Cek Rekening Anggota
</h2>


<p className="text-gray-400 mt-2">
Masukkan kode anggota dan nama untuk melihat informasi rekening.
</p>


<input

value={idAnggota}

onChange={(e)=>setIdAnggota(e.target.value)}

placeholder="Kode Anggota contoh KDMP0200"

className="
mt-5
w-full
p-3
rounded-xl
bg-black/30
border
border-white/20
"

/>


<input

value={nama}

onChange={(e)=>setNama(e.target.value)}

placeholder="Nama Anggota"

className="
mt-3
w-full
p-3
rounded-xl
bg-black/30
border
border-white/20
"

/>


<button

onClick={cekInformasiAnggota}

className="
mt-4
w-full
rounded-xl
p-4
bg-gradient-to-r
from-red-600
to-purple-600
font-bold
"

>

{
loading
?
"⏳ Memeriksa..."
:
"🔍 Cek Informasi"
}

</button>
{
infoTransaksi && (

<div
className="
mt-6
rounded-2xl
p-5
bg-white/5
border
border-blue-500/30
"
>

<h3 className="text-xl font-bold text-blue-300">
⛽ Riwayat Transaksi BBM
</h3>


<p className="mt-3">
Total Liter:
{" "}
{infoTransaksi.totalLiter}
 Liter
</p>


<p>
Total Nominal:
{" "}
Rp {infoTransaksi.totalNominal?.toLocaleString("id-ID")}
</p>


<div className="mt-4 space-y-3">

{
infoTransaksi.riwayat?.map(
(item:any,index:number)=>(

<div
key={index}
className="
p-3
rounded-xl
bg-black/20
"
>

<p>
Tanggal : {item.tanggal}
</p>

<p>
BBM : {item.jenis}
</p>

<p>
Liter : {item.liter} L
</p>

<p>
Total :
Rp {item.total?.toLocaleString("id-ID")}
</p>


</div>

)

)

}

</div>

</div>

)
}

</div>


</div>

)
}


{
halaman === "rekening" && infoAnggota && (
<>
<div
className="
mt-8
rounded-2xl
p-5
bg-black/30
border
border-white/10
"
>

<h2 className="text-xl font-bold">
Informasi Rekening Anggota
</h2>



<div
className="
mt-4
space-y-3
text-gray-300
"
>


<p>
Nama :
{infoAnggota?.nama || "-"}
</p>



<p>
Kode Anggota :
{infoAnggota?.kode_warga || "-"}
</p>



<p>
Status :
{infoAnggota?.status || "-"}
</p>

<button

onClick={()=>{

  navigate(
    "/print-id-card-saya",
    {
      state:{
        anggota: infoAnggota
      }
    }
  );

}}

className="
mt-4
px-6
py-3
rounded-xl
font-bold
text-white
bg-gradient-to-r
from-cyan-500
to-blue-600
shadow-lg
hover:scale-105
transition
"

>
🎫 Download ID Card

</button>

<hr className="border-white/10"/>



<p>
Simpanan Pokok :

Rp {

Number(
infoAnggota?.pokok || 0
)
.toLocaleString("id-ID")

}

</p>




<p>
Simpanan Wajib :

Rp {

Number(
infoAnggota?.wajib || 0
)
.toLocaleString("id-ID")

}

</p>




<p>
Simpanan Sukarela :

Rp {

Number(
infoAnggota?.sukarela || 0
)
.toLocaleString("id-ID")

}

</p>


{/* ============================
    RIWAYAT SIMPANAN
============================ */}

<h3
className="
mt-8
text-xl
font-bold
text-cyan-400
"
>
📜 Riwayat Simpanan
</h3>

<div className="overflow-x-auto mt-4">

<table
className="
w-full
text-sm
border
border-white/10
"
>

<thead>

<tr
className="
bg-white/10
"
>

<th className="p-2">
Tanggal
</th>

<th className="p-2 text-right">
Pokok
</th>

<th className="p-2 text-right">
Wajib
</th>

<th className="p-2 text-right">
Sukarela
</th>

</tr>

</thead>

<tbody>

{
infoAnggota?.riwayat?.length
?

infoAnggota.riwayat.map(
(item:any,index:number)=>(

<tr
key={index}
className="
border-t
border-white/10
"
>

<td className="p-2">

{
item.tanggal_setor
?

new Date(item.tanggal_setor)
.toLocaleDateString("id-ID")

:

"-"
}

</td>

<td className="p-2 text-right">

Rp {

Number(
item.simpanan_pokok || 0
)
.toLocaleString("id-ID")

}

</td>

<td className="p-2 text-right">

Rp {

Number(
item.simpanan_wajib || 0
)
.toLocaleString("id-ID")

}

</td>

<td className="p-2 text-right">

Rp {

Number(
item.simpanan_sukarela || 0
)
.toLocaleString("id-ID")

}

</td>

</tr>

))

:

<tr>

<td
colSpan={4}
className="
text-center
p-4
text-gray-400
"
>

Belum ada riwayat simpanan

</td>

</tr>

}

</tbody>

</table>

</div>


<hr className="border-white/10"/>



<h3
className="
text-xl
font-bold
text-yellow-400
"
>
📊 Rincian SHU
</h3>




<p className="mt-3">
SHU Jasa
</p>

<p>
Rp {

Number(
infoAnggota?.shu_jasa || 0
)
.toLocaleString("id-ID")

}

</p>





<p className="mt-3">
SHU Simpanan
</p>

<p>
Rp {

Number(
infoAnggota?.shu_simpanan || 0
)
.toLocaleString("id-ID")

}

</p>





{
infoAnggota?.shu_pengurus > 0 &&

<>
<p className="mt-3">
SHU Pengurus
</p>

<p>
Rp {
Number(
infoAnggota.shu_pengurus
)
.toLocaleString("id-ID")
}
</p>

</>

}




{

infoAnggota?.status==="Pengawas" &&

<>

<p className="mt-3">
SHU Pengawas
</p>

<p>
Rp {

Number(
infoAnggota?.shu_pengawas || 0
)
.toLocaleString("id-ID")

}

</p>

</>

}





<hr className="border-white/10"/>



<p className="font-bold text-green-400">
TOTAL SHU
</p>


<h2
className="
text-2xl
text-green-400
font-bold
"
>

Rp {

Number(
infoAnggota?.total_shu || 0
)

.toLocaleString("id-ID")

}

</h2>




{
infoAnggota?.tahunSHU &&

<p className="mt-3">

Tahun SHU :
{infoAnggota.tahunSHU}

</p>

}


</div>


</div>


</>
)

}
{
halaman === "laba" && (

<div className="mt-6 space-y-6">


<button
onClick={()=>setHalaman("menu")}
className="
px-4
py-2
rounded-xl
bg-gray-700
"
>
⬅ Kembali
</button>


<div
className="
rounded-2xl
p-5
bg-black/30
border
border-green-500/30
"
>

<h2 className="text-2xl font-bold text-green-400">
📊 Laporan Laba Koperasi
</h2>


{
loadingLaba
?
<p className="mt-4">
⏳ Memuat laporan...
</p>

:

dataLaba &&

<div className="mt-5 space-y-4">


<div>
Total Penjualan

<h3 className="text-xl font-bold">
Rp {Number(
dataLaba.totalPenjualan || 0
).toLocaleString("id-ID")}
</h3>

</div>


<div>
Modal Berputar

<h3 className="text-xl font-bold">
Rp {Number(
dataLaba.totalModalBerputar || 0
).toLocaleString("id-ID")}
</h3>

</div>


<div>
Laba Kotor

<h3 className="text-xl font-bold text-yellow-400">
Rp {Number(
dataLaba.labaKotor || 0
).toLocaleString("id-ID")}
</h3>

</div>


<div>
Total Pengeluaran

<h3 className="text-xl font-bold text-red-400">
Rp {Number(
dataLaba.totalPengeluaran || 0
).toLocaleString("id-ID")}
</h3>

</div>


<div>
SHU Koperasi

<h3 className="text-xl font-bold text-green-400">
Rp {Number(
dataLaba.shuKoperasi || 0
).toLocaleString("id-ID")}
</h3>

</div>


</div>

}


</div>


</div>

)
}
</div>
</div>


);
}
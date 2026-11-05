import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getPortalAnggota
} from "../services/simpanan";

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



<div className="mt-6 space-y-4">


<input

value={idAnggota}

onChange={
(e)=>setIdAnggota(e.target.value)
}

placeholder="Kode Anggota contoh KDMP0200"

className="
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

onChange={
(e)=>setNama(e.target.value)
}

placeholder="Nama Anggota"

className="
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

<h2
className="
text-xl
font-bold
text-blue-300
"
>
⛽ Riwayat Transaksi BBM
</h2>


<p className="mt-3">
Total Pengambilan:
{" "}
{infoTransaksi.totalLiter}
 Liter
</p>


<p>
Total Transaksi:
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
border
border-white/10
"
>

<p>
Tanggal:
{" "}
{item.tanggal}
</p>


<p>
BBM:
{" "}
{item.jenis}
</p>


<p>
Liter:
{" "}
{item.liter} L
</p>


<p>
Total:
{" "}
Rp {item.total.toLocaleString("id-ID")}
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


</div>


</div>


);


}
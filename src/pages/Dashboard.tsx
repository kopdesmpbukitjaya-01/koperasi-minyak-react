import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getDashboardBBM } from "../services/dashboard";
import { getPeriode } from "../services/periode";

import banner from "../assets/banner.png";


export default function Dashboard() {
const navigate = useNavigate();

const [periodeAktif,setPeriodeAktif] =
useState<any>(null);


const [dataBBM,setDataBBM] =
useState<any[]>([]);





useEffect(()=>{

loadDashboard();
loadDataBBM();

},[]);





async function loadDashboard(){

try{

const data =
await getPeriode();


const aktif =
data.find(
(p:any)=>p.aktif === true
);


setPeriodeAktif(aktif);


}catch(err){

console.log(err);

}

}





async function loadDataBBM(){

try{

const data =
await getDashboardBBM();


setDataBBM(data);


}catch(err:any){

console.error(err);

}

}







return (

<div className="space-y-8">



{/* =====================
        BANNER
===================== */}


<div
className="
rounded-3xl
overflow-hidden

border
border-purple-500/40

shadow-[0_0_40px_rgba(168,85,247,.35)]

"
>


<img
src={banner}
alt="Banner"
className="
w-full
aspect-[16/6]
object-cover
rounded-3xl
"
/>


</div>







{/* =====================
      PROFILE HEADER
===================== */}

<div
className="
flex
flex-col
md:flex-row
items-center
justify-between
gap-6

p-5
md:p-6
"
>

  <div>

    <h1
    className="
    text-2xl
    md:text-5xl
    font-black

    bg-gradient-to-r
    from-red-400
    via-purple-400
    to-blue-400

    bg-clip-text
    text-transparent
    "
    >
      KOPERASI DESA MERAH PUTIH
    </h1>

    <h2
    className="
    text-xl
    md:text-3xl
    font-bold
    text-blue-200
    "
    >
      BUKIT JAYA
    </h2>

    <p
    className="
    text-gray-300
    mt-2
    "
    >
      Kecamatan Bulik Timur
    </p>

  </div>

  <div>

    <h2 className="font-bold text-xl">
      Dashboard
    </h2>

    <p className="text-sm text-gray-300">
      Sistem Informasi Koperasi Desa Merah Putih Bukit Jaya
    </p>

  </div>

</div>



{/* =====================
      STAT CARD
===================== */}

{/* =====================
      MOBILE QUICK MENU
===================== */}

<div
className="
grid
grid-cols-2
gap-4
md:hidden
mb-5
"
>

<button
onClick={()=>navigate("/warga")}
className="
rounded-2xl
p-5
bg-gradient-to-br
from-green-500
to-green-700
shadow-lg
font-bold
"
>
👥
<br/>
Data Warga
</button>


<button
onClick={()=>navigate("/transaksi")}
className="
rounded-2xl
p-5
bg-gradient-to-br
from-blue-500
to-blue-700
shadow-lg
font-bold
"
>
⛽
<br/>
Pengambilan BBM
</button>


<button
onClick={()=>navigate("/pembelian-bbm")}
className="
rounded-2xl
p-5
bg-gradient-to-br
from-orange-500
to-red-600
shadow-lg
font-bold
"
>
📦
<br/>
Pembelian
</button>


<button
onClick={()=>navigate("/laporan")}
className="
rounded-2xl
p-5
bg-gradient-to-br
from-purple-500
to-purple-700
shadow-lg
font-bold
"
>
📊
<br/>
Laporan
</button>


</div>

<div

className="
grid

grid-cols-1

md:grid-cols-2

xl:grid-cols-4

gap-5 md:p-6

"

>





<Card

title="Periode Aktif"

value={
periodeAktif?.nama_periode || "-"
}

desc={
periodeAktif?.jenis_bbm?.nama || "-"
}

icon="📅"

/>




<Card

title="Kuota Liter"

value={
`${periodeAktif?.kuota_liter || 0} L`
}

desc="Stok periode aktif"

icon="🛢️"

/>





<Card

title="Jenis BBM"

value={
dataBBM.length
}

desc="Rekap penyaluran"

icon="⛽"

/>




<Card

title="Status"

value="AKTIF"

desc="Sistem berjalan"

icon="✅"

/>



</div>







{/* =====================
        REKAP TABLE
===================== */}



<div

className="


"

>


<h2

className="
text-2xl

font-black

mb-5

bg-gradient-to-r

from-red-400

to-purple-400

bg-clip-text

text-transparent

"

>

Rekap Penyaluran BBM

</h2>




<div
className="
overflow-x-auto
rounded-2xl
"
>


<table
className="
min-w-[650px]
w-full
"
>


<thead>


<tr

className="
border-b
border-purple-500/30
text-purple-300

"

>


<th className="p-3 text-left">

Periode

</th>


<th className="p-3">

Jenis

</th>


<th className="p-3">

KK

</th>


<th className="p-3">

Liter

</th>



</tr>


</thead>



<tbody>


{
dataBBM.map(
(item:any,index:number)=>(


<tr

key={index}

className="
border-b
border-white/10
hover:bg-purple-500/10
transition-all
duration-300

"

>


<td className="p-3">

{item.periode}

</td>


<td className="p-3 font-bold">

{item.jenis_bbm}

</td>


<td className="p-3 text-center">

{item.jumlah_kk}

</td>


<td className="
p-3
text-center
text-blue-300
font-bold
">

{item.liter}

</td>


</tr>


)

)

}



</tbody>


</table>


</div>


</div>





</div>



);


}







function Card(
{
title,
value,
desc,
icon
}:any
){

return (

<div

className="
relative

overflow-hidden

rounded-3xl

p-5 md:p-6

bg-gradient-to-br

from-[#101633]

to-[#080b20]

border

border-purple-500/30

shadow-[0_0_30px_rgba(139,92,246,.25)]

hover:scale-[1.02]

transition-all
duration-300

"

>


<div

className="
absolute

right-0

top-0

w-32

h-32

bg-purple-600/20

rounded-full

blur-3xl

"

/>



<p className="
text-gray-400
text-sm
uppercase
">

{title}

</p>



<h2

className="
text-2xl md:text-3xl

font-black

mt-3

bg-gradient-to-r

from-red-400

via-purple-400

to-blue-400

bg-clip-text

text-transparent

"

>

{value}

</h2>



<p className="text-gray-300 mt-2">

{desc}

</p>



<div className="text-4xl md:text-5xl mt-4">

{icon}

</div>



</div>


)

}
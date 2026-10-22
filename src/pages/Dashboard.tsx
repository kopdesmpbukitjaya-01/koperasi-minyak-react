import { useEffect, useState } from "react";
import Layout from "../components/Layout";

import { getDashboardBBM } from "../services/dashboard";
import { getPeriode } from "../services/periode";

import logo from "../assets/logo.png";
import banner from "../assets/banner.png";


export default function Dashboard() {


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

<Layout>


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
lg:flex-row
justify-between
items-center

gap-6

bg-white/5

backdrop-blur-xl

rounded-3xl

p-6

border
border-white/10

shadow-xl

"

>




<div
className="
flex
items-center
gap-5
"
>


<div

className="
p-1

rounded-full

bg-gradient-to-r
from-red-500
via-purple-500
to-blue-500

shadow-[0_0_30px_rgba(168,85,247,.8)]
"

>


<img

src={logo}

className="
w-24
h-24

rounded-full

bg-white

p-2

object-contain
"

/>


</div>




<div>


<h1

className="
text-3xl
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



</div>





<div

className="
px-8
py-5

rounded-2xl

bg-gradient-to-r

from-red-600

to-purple-700

shadow-[0_0_30px_rgba(239,68,68,.5)]

"

>


<h2 className="font-bold text-xl">

Dashboard

</h2>


<p className="text-sm">

Sistem Informasi Pertashop

</p>


</div>






</div>







{/* =====================
      STAT CARD
===================== */}



<div

className="
grid

grid-cols-1

md:grid-cols-2

xl:grid-cols-4

gap-6

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
bg-white/5

backdrop-blur-xl

rounded-3xl

border
border-white/10

shadow-xl

p-6

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




<div className="overflow-x-auto">


<table className="w-full">


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
transition

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


</Layout>

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

p-6

bg-gradient-to-br

from-[#101633]

to-[#080b20]

border

border-purple-500/30

shadow-[0_0_30px_rgba(139,92,246,.25)]

hover:scale-105

transition

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
text-3xl

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



<div className="text-5xl mt-4">

{icon}

</div>



</div>


)

}
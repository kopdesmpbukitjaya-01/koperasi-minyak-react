import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getDashboardBBM } from "../services/dashboard";
import { getPeriode } from "../services/periode";

import banner from "../assets/banner.png";


export default function DashboardMobile(){

const navigate = useNavigate();


const [periodeAktif,setPeriodeAktif] =
useState<any>(null);


const [dataBBM,setDataBBM] =
useState<any[]>([]);



useEffect(()=>{

load();

},[]);



async function load(){

try{


const periode =
await getPeriode();


const aktif =
periode.find(
(p:any)=>p.aktif === true
);


setPeriodeAktif(aktif);



const bbm =
await getDashboardBBM();


setDataBBM(bbm);



}catch(err){

console.log(err);

}


}





return (

<div
className="
min-h-screen
bg-[#050816]
text-white
p-4
space-y-5
"
>



{/* BANNER */}

<div
className="
shadow-[0_0_35px_rgba(168,85,247,.5)]
border
border-purple-500/40
"
>

<img

src={banner}

className="
w-full
h-40
object-cover
"

/>

</div>







{/* STATUS PERIODE */}


<div
className="
rounded-3xl
p-5
bg-gradient-to-br
from-red-600
to-purple-700
shadow-[0_0_30px_rgba(239,68,68,.5)]
"
>

<p className="text-sm">

Periode Aktif

</p>


<h2 className="text-2xl font-black">

{periodeAktif?.nama_periode ?? "-"}

</h2>


<p>

{periodeAktif?.jenis_bbm?.nama ?? "-"}

</p>


</div>








{/* STAT CARD */}


<div
className="
grid
grid-cols-2
gap-4
"
>


<Card

icon="🛢️"

title="Kuota"

value={`${periodeAktif?.kuota_liter ?? 0} L`}

/>



<Card

icon="⛽"

title="Jenis BBM"

value={dataBBM.length}

/>



</div>







{/* MENU CEPAT */}


<h2
className="
text-xl
font-black
mt-5
"
>

Menu Cepat

</h2>



<div
className="
grid
grid-cols-2
gap-4
"
>
<Menu

icon="🏢"

title="Profil Koperasi"

click={()=>navigate("/profil-koperasi")}

/>


<Menu

icon="💳"

title="Cek Rekening"

click={()=>navigate("/portal-anggota")}

/>

<Menu

icon="👥"

title="Warga"

click={()=>navigate("/warga")}

/>

<Menu

icon="💵"

title="Alokasi SHU"

click={()=>navigate("/alokasi-shu")}

/>

<Menu

icon="⛽"

title="Transaksi"

click={()=>navigate("/transaksi")}

/>



<Menu

icon="📦"

title="Pembelian"

click={()=>navigate("/pembelian-bbm")}

/>



<Menu

icon="📄"

title="Laporan"

click={()=>navigate("/laporan")}

/>



</div>



</div>


);


}





function Card(
{
icon,
title,
value
}:any
){

return (

<div
className="
rounded-3xl
p-4
bg-[#101633]
border
border-purple-500/30
shadow-[0_0_20px_rgba(139,92,246,.25)]
"
>

<div className="text-3xl">

{icon}

</div>


<p className="text-gray-400 text-sm">

{title}

</p>


<h3 className="
text-xl
font-black
">

{value}

</h3>


</div>

)

}





function Menu(
{
icon,
title,
click
}:any
){

return (

<button

onClick={click}

className="
rounded-3xl
p-5
bg-white/5
border
border-white/10
shadow-lg
active:scale-95
transition
"

>

<div className="text-4xl">

{icon}

</div>


<p className="
mt-2
font-bold
">

{title}

</p>


</button>


)

}

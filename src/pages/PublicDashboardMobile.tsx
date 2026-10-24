import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getJumlahAnggota,
  getRekapPenjualanBBM,
  getLabaBersih,
} from "../services/dashboardPublic";

import logo from "../assets/logo_transparan.png";
import banner from "../assets/banner.png";


export default function PublicDashboardMobile(){
console.log("PUBLIC MOBILE AKTIF");
const navigate = useNavigate();


const [jumlahAnggota,setJumlahAnggota] = useState(0);
const [rekap,setRekap] = useState<any[]>([]);
const [labaBersih,setLabaBersih] = useState(0);



useEffect(()=>{

loadDashboard();

},[]);




async function loadDashboard(){

try{

console.log("=== PUBLIC DASHBOARD START ===");


console.log("CEK JUMLAH ANGGOTA");

const anggota =
await getJumlahAnggota();

console.log(
"JUMLAH ANGGOTA :",
anggota
);



console.log("CEK REKAP BBM");

const data =
await getRekapPenjualanBBM();

console.log(
"REKAP BBM :",
data
);



console.log("CEK LABA");

const laba =
await getLabaBersih();

console.log(
"LABA BERSIH :",
laba
);



setJumlahAnggota(
anggota || 0
);


setRekap(
data || []
);


setLabaBersih(
Number(laba) || 0
);


}catch(err:any){

console.error(
  "PUBLIC DASHBOARD ERROR :",
  err
);

console.error(
  "MESSAGE :",
  err?.message
);

console.error(
  "DETAILS :",
  err?.details
);

console.error(
  "HINT :",
  err?.hint
);

}

}




const totalBBM =
rekap.reduce(
(total,item)=>
total + Number(item.terjual || 0),
0
);





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



{/* HEADER */}

<div
className="
bg-white/5
border
border-white/10
rounded-3xl
p-5
shadow-xl
"
>


<div
className="
flex
items-center
gap-4
"
>


<img
src={logo}
className="
w-24
h-24
object-contain
"
/>



<div>


<h1
className="
text-xl
font-black
bg-gradient-to-r
from-red-400
via-purple-400
to-blue-400
bg-clip-text
text-transparent
"
>

KDMP BUKIT JAYA

</h1>


<p
className="
text-blue-200
text-sm
"
>

Kecamatan Bulik Timur

</p>


<p
className="
text-gray-400
text-xs
"
>

Sistem Informasi Koperasi

</p>


</div>


</div>


</div>






{/* BANNER */}

<div
className="
rounded-3xl
overflow-hidden
border
border-purple-500/40
shadow-[0_0_35px_rgba(168,85,247,.4)]
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







{/* LOGIN */}

<button

onClick={()=>navigate("/login")}

className="
w-full
py-4
rounded-2xl
font-black
text-lg

bg-gradient-to-r
from-red-600
to-purple-700

shadow-[0_0_25px_rgba(239,68,68,.5)]

active:scale-95
transition
"

>

🔐 LOGIN ADMIN

</button>







{/* STAT CARD */}


<div
className="
grid
grid-cols-2
gap-4
"
>



<Card

icon="👥"

title="Anggota"

value={jumlahAnggota}

/>



<Card

icon="⛽"

title="BBM Terjual"

value={`${totalBBM} L`}

/>



</div>







<div

className="
rounded-3xl
p-5

bg-gradient-to-br
from-green-600
to-emerald-800

shadow-xl
"

>


<div className="text-4xl">

💰

</div>


<p className="text-sm">

Laba Bersih

</p>


<h2 className="
text-2xl
font-black
mt-2
">

Rp {labaBersih.toLocaleString("id-ID")}

</h2>


</div>







{/* INFO */}

<div

className="
rounded-3xl
p-5

bg-white/5

border
border-white/10
"

>


<h2 className="
font-black
text-lg
mb-3
"
>

⛽ Informasi BBM

</h2>


{

rekap.map(

(item,index)=>(


<div

key={index}

className="
flex
justify-between
py-3
border-b
border-white/10
"

>


<span>

{item.jenis || "-"}

</span>


<span
className="
font-bold
text-blue-300
"
>

{item.terjual || 0} L

</span>


</div>


)

)

}


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

shadow-[0_0_25px_rgba(139,92,246,.25)]

"

>


<div className="text-3xl">

{icon}

</div>


<p className="
text-gray-400
text-sm
"
>

{title}

</p>


<h2 className="
text-2xl
font-black
mt-2
"
>

{value}

</h2>

<div
className="
text-center
text-xs
text-gray-500
pb-5
"
>

Koperasi Desa Merah Putih  
KDMP Bukit Jaya  
Kecamatan Bulik Timur

</div>
</div>


)

}


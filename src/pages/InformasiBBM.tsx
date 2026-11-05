import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getRekapPenjualanBBM
} from "../services/dashboardPublic";

export default function InformasiBBM(){

const navigate = useNavigate();


const [dataBBM,setDataBBM] = useState<any[]>([]);


useEffect(()=>{

loadData();

},[]);



async function loadData(){

const data =
await getRekapPenjualanBBM();


console.log(
"INFORMASI BBM DETAIL:",
JSON.stringify(data, null, 2)
);


setDataBBM(
data || []
);

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


<button

onClick={()=>navigate(-1)}

className="
mb-5
px-5
py-3
rounded-xl
bg-white/10
border
border-white/20
"

>
← Kembali
</button>



<div
className="
rounded-3xl
p-6
bg-white/5
border
border-white/10
shadow-xl
"
>

<h1
className="
text-2xl
font-black
bg-gradient-to-r
from-orange-400
via-red-400
to-purple-400
bg-clip-text
text-transparent
"
>
⛽ Informasi BBM
</h1>


<p
className="
text-gray-400
mt-2
"
>
Riwayat distribusi BBM KDMP Bukit Jaya
</p>


</div>



<div
className="
mt-6
space-y-4
"
>

{
dataBBM.map((item,index)=>(

<div

key={index}

className="
rounded-3xl
p-5
bg-gradient-to-br
from-orange-600/30
to-red-900/40
border
border-orange-400/30
shadow-[0_0_25px_rgba(249,115,22,.25)]
"

>

<div
className="
flex
justify-between
items-center
"
>


<div>

<h2
className="
text-xl
font-black
"
>
{item.jenis}
</h2>


<p
className="
text-sm
text-white/70
"
>
{item.tanggal}
</p>

</div>



<div
className="
text-right
"
>

<div
className="
text-right
"
>

<p
className="
text-xs
text-white/60
"
>
⛽ Terjual
</p>


<p
className="
text-2xl
font-black
text-orange-300
"
>
{item.terjual || 0} L
</p>


<p
className="
text-xs
text-white/60
mt-2
"
>
Kuota
</p>


<p
className="
font-bold
text-white
"
>
{item.jumlahLiter || 0} L
</p>


<div
className="
mt-3
w-32
h-2
bg-white/20
rounded-full
overflow-hidden
"
>

<div
className="
h-full
bg-gradient-to-r
from-green-400
to-emerald-500
rounded-full
"
style={{
width:
`${Math.min(
((item.terjual || 0) /
(item.jumlahLiter || 1)) * 100,
100
)}%`
}}
/>

</div>


<p
className="
text-xs
text-green-300
mt-2
font-bold
"
>
{
(item.terjual >= item.jumlahLiter)
?
"✅ Kuota Habis"
:
`Sisa ${item.jumlahLiter - item.terjual} L`
}
</p>


</div>


</div>


</div>


</div>


))

}

</div>



</div>


)

}
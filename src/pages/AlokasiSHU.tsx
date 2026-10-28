import { useState } from "react";
import Layout from "../components/Layout";

import { useEffect } from "react";
import {
getAlokasiSHU,
simpanAlokasiSHU
} from "../services/alokasi_shu";
function rupiah(value:number){

return new Intl.NumberFormat(
"id-ID",
{
style:"currency",
currency:"IDR",
maximumFractionDigits:0
}
).format(value);

}
export default function AlokasiSHU(){


const [tahun,setTahun]=useState(2026);
const [totalSHU,setTotalSHU]=useState(0);

const [cadangan,setCadangan]=useState(25);
const [jasaAnggota,setJasaAnggota]=useState(40);
const [jasaPengurus,setJasaPengurus]=useState(10);
const [jasaPengawas,setJasaPengawas]=useState(5);
const [pendidikan,setPendidikan]=useState(10);
const [sosial,setSosial]=useState(5);
const [pembangunan,setPembangunan]=useState(5);


const total =
cadangan+
jasaAnggota+
jasaPengurus+
jasaPengawas+
pendidikan+
sosial+
pembangunan;

const nominalSHU = {

cadangan:
(totalSHU * cadangan) / 100,

jasaAnggota:
(totalSHU * jasaAnggota) / 100,

jasaPengurus:
(totalSHU * jasaPengurus) / 100,

jasaPengawas:
(totalSHU * jasaPengawas) / 100,

pendidikan:
(totalSHU * pendidikan) / 100,

sosial:
(totalSHU * sosial) / 100,

pembangunan:
(totalSHU * pembangunan) / 100,

};

useEffect(()=>{

loadAlokasi();

},[]);



async function loadAlokasi(){

try{

const data = await getAlokasiSHU(tahun);


if(data){

setTotalSHU(
Number(data.total_shu)
);

setCadangan(Number(data.cadangan));
setJasaAnggota(Number(data.jasa_anggota));
setJasaPengurus(Number(data.jasa_pengurus));
setJasaPengawas(Number(data.jasa_pengawas));
setPendidikan(Number(data.dana_pendidikan));
setSosial(Number(data.dana_sosial));
setPembangunan(Number(data.dana_pembangunan));

}
}catch(err){

console.log(err);

}

}





return (

<Layout>

<div className="space-y-8">


<div
className="
rounded-3xl
p-8
bg-gradient-to-r
from-red-600/20
via-purple-600/20
to-blue-600/20
border
border-white/10
shadow-xl
"
>


<h1
className="
text-4xl
font-black
text-white
"
>
📊 Alokasi SHU RAT
</h1>


<p className="text-gray-300 mt-3">
Pengaturan persentase pembagian Sisa Hasil Usaha
</p>


</div>





<div
className="
rounded-3xl
p-8
bg-white/5
border
border-white/10
"
>


<h2 className="
text-2xl
font-bold
text-white
mb-6
">
Alokasi Pembagian SHU Tahun RAT
</h2>



<div className="mb-6">


<label className="text-white font-semibold">
Tahun RAT
</label>


<input

type="number"

value={tahun}

onChange={(e)=>
setTahun(
Number(e.target.value)
)
}

className="
block
mt-2
w-40
p-3
rounded-xl
bg-black/40
border
border-white/20
text-white
"

/>


</div>

<div className="mb-6">

<label className="text-white font-semibold">
Total SHU Koperasi
</label>

<input

type="number"

value={totalSHU}

onChange={(e)=>
setTotalSHU(
Number(e.target.value)
)
}

className="
block
mt-2
w-60
p-3
rounded-xl
bg-black/40
border
border-white/20
text-white
"

/>

</div>


<FormSHU
label="Cadangan (%)"
value={cadangan}
setValue={setCadangan}
/>


<FormSHU
label="Jasa Anggota (%)"
value={jasaAnggota}
setValue={setJasaAnggota}
/>


<FormSHU
label="Jasa Pengurus (%)"
value={jasaPengurus}
setValue={setJasaPengurus}
/>


<FormSHU
label="Jasa Pengawas (%)"
value={jasaPengawas}
setValue={setJasaPengawas}
/>


<FormSHU
label="Dana Pendidikan (%)"
value={pendidikan}
setValue={setPendidikan}
/>


<FormSHU
label="Dana Sosial (%)"
value={sosial}
setValue={setSosial}
/>


<FormSHU
label="Dana Pembangunan (%)"
value={pembangunan}
setValue={setPembangunan}
/>



<button

onClick={async()=>{

try{

await simpanAlokasiSHU({

tahun,

total_shu: totalSHU,

cadangan,

jasa_anggota:jasaAnggota,

jasa_pengurus:jasaPengurus,

jasa_pengawas:jasaPengawas,

dana_pendidikan:pendidikan,

dana_sosial:sosial,

dana_pembangunan:pembangunan

});


alert(
"✅ Alokasi SHU berhasil disimpan"
);


}catch(error:any){

console.error(
"ERROR SIMPAN ALOKASI SHU:",
error
);


alert(
"Gagal simpan: "
+
error.message
);


}


}}

className="
mt-6
px-6
py-3
rounded-xl
font-bold
text-white
bg-gradient-to-r
from-red-600
to-purple-600
shadow-lg
"

>

💾 Simpan Alokasi SHU

</button>

<div
className="
mt-8
p-5
rounded-xl
bg-black/40
text-xl
font-bold
text-white
"
>


Total :

<span
className={
total===100
?
"ml-2 text-green-400"
:
"ml-2 text-red-400"
}
>

{total}%

</span>


</div>
<div
className="
mt-8
grid
md:grid-cols-2
gap-4
"
>


<CardSHU
label="Cadangan"
value={nominalSHU.cadangan}
/>


<CardSHU
label="Jasa Anggota"
value={nominalSHU.jasaAnggota}
/>


<CardSHU
label="Jasa Pengurus"
value={nominalSHU.jasaPengurus}
/>


<CardSHU
label="Jasa Pengawas"
value={nominalSHU.jasaPengawas}
/>


<CardSHU
label="Dana Pendidikan"
value={nominalSHU.pendidikan}
/>


<CardSHU
label="Dana Sosial"
value={nominalSHU.sosial}
/>


<CardSHU
label="Dana Pembangunan"
value={nominalSHU.pembangunan}
/>


</div>






</div>


</div>


</Layout>


);


}





function FormSHU({
label,
value,
setValue
}:any){


return (

<div
className="
flex
items-center
justify-between
mb-5
"
>


<label
className="
text-white
font-semibold
"
>

{label}

</label>



<input

type="number"

value={value}

onChange={(e)=>
setValue(
Number(e.target.value)
)
}

className="
w-32
p-3
rounded-xl
bg-black/40
border
border-white/20
text-white
text-center
"

/>


</div>


);

}
function CardSHU({
label,
value
}:any){

return (

<div
className="
p-5
rounded-2xl
bg-white/5
border
border-white/10
text-white
"
>

<p className="text-gray-300">
{label}
</p>

<p
className="
text-xl
font-black
text-green-400
"
>

{rupiah(value)}

</p>

</div>

);

}
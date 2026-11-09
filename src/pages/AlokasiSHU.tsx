import { useState } from "react";
import Layout from "../components/Layout";
import { supabase } from "../lib/supabase";
import { useEffect } from "react";
import { getLabaKoperasi } from "../services/laba_koperasi";
import {
getAlokasiSHU,
simpanAlokasiSHU,
resetPembagianSHU,
resetAlokasiSHU as resetAlokasiDatabase
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
const [shuAnggota,setShuAnggota]=useState(60);

const [shuSimpanan,setShuSimpanan]=useState(50);

const [shuJasa,setShuJasa]=useState(50);

const [shuPengurus,setShuPengurus]=useState(15);

const [shuPengawas,setShuPengawas]=useState(2.5);
const [pendidikan,setPendidikan]=useState(10);
const [sosial,setSosial]=useState(5);
const [pembangunan,setPembangunan]=useState(5);


const total =
cadangan+
shuAnggota+
shuPengurus+
shuPengawas+
pendidikan+
sosial+
pembangunan;

const nominalSHU = {

cadangan:
(totalSHU * cadangan) / 100,


shuAnggota:
(totalSHU * shuAnggota) / 100,


shuSimpanan:
(
(totalSHU * shuAnggota) / 100
*
shuSimpanan
/100
),


shuJasa:
(
(totalSHU * shuAnggota) / 100
*
shuJasa
/100
),


shuPengurus:
(totalSHU * shuPengurus) / 100,


shuPengawas:
(totalSHU * shuPengawas) / 100,


pendidikan:
(totalSHU * pendidikan) / 100,


sosial:
(totalSHU * sosial) / 100,


pembangunan:
(totalSHU * pembangunan) / 100,

};

useEffect(()=>{

loadAlokasi();
loadTotalSHU();

},[]);


async function loadTotalSHU(){

try{

const laba =
await getLabaKoperasi();


console.log(
"SHU DARI LABA KOPERASI",
laba.shuKoperasi
);


setTotalSHU(
Number(laba.shuKoperasi || 0)
);


}catch(err){

console.error(
"LOAD TOTAL SHU ERROR",
err
);

}

}
async function loadAlokasi(){

try{

const data = await getAlokasiSHU(tahun);


if(data){


/*
JANGAN SET TOTAL SHU DI SINI

SHU DIAMBIL DARI LABA KOPERASI
*/


setCadangan(
Number(data.cadangan || 0)
);


setShuAnggota(
Number(data.shu_anggota || 0)
);


setShuSimpanan(
Number(data.shu_simpanan || 0)
);


setShuJasa(
Number(data.shu_jasa || 0)
);


setShuPengurus(
Number(data.shu_pengurus || 0)
);


setShuPengawas(
Number(data.shu_pengawas || 0)
);


setPendidikan(
Number(data.dana_pendidikan || 0)
);


setSosial(
Number(data.dana_sosial || 0)
);


setPembangunan(
Number(data.dana_pembangunan || 0)
);


}

}catch(err){

console.log(err);

}

}


async function handleResetAlokasiSHU(){

const yakin = confirm(
"Reset Alokasi SHU tahun "+tahun+"?\n\nSemua persentase akan dikembalikan menjadi 0."
);

if(!yakin) return;



try{

// hapus hasil pembagian SHU lama
await resetPembagianSHU(tahun);


// reset persentase alokasi SHU
await resetAlokasiDatabase(tahun);


// reset tampilan input

setTotalSHU(0);

setCadangan(0);
setShuAnggota(0);
setShuSimpanan(50);
setShuJasa(50);
setShuPengurus(0);
setShuPengawas(0);
setPendidikan(0);
setSosial(0);
setPembangunan(0);


alert(
"✅ Alokasi SHU berhasil direset"
);


}catch(error:any){

console.error(
"ERROR RESET ALOKASI SHU:",
error
);


alert(
"Gagal reset: "+error.message
);


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
label="SHU Anggota (%)"
value={shuAnggota}
setValue={setShuAnggota}
/>

<FormSHU
label="SHU Simpanan (%)"
value={shuSimpanan}
setValue={setShuSimpanan}
/>


<FormSHU
label="SHU Jasa (%)"
value={shuJasa}
setValue={setShuJasa}
/>
<FormSHU
label="SHU Pengurus (%)"
value={shuPengurus}
setValue={setShuPengurus}
/>


<FormSHU
label="SHU Pengawas (%)"
value={shuPengawas}
setValue={setShuPengawas}
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

const session =
await supabase.auth.getSession();

console.log(
"SESSION RESET",
session.data.session?.user
);


await simpanAlokasiSHU({

tahun,

total_shu: totalSHU,

cadangan,

shu_anggota: shuAnggota,

shu_simpanan: shuSimpanan,

shu_jasa: shuJasa,

shu_pengurus: shuPengurus,

shu_pengawas: shuPengawas,

dana_pendidikan: pendidikan,

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
<button
onClick={handleResetAlokasiSHU}
className="
mt-6
ml-3
px-6
py-3
rounded-xl
font-bold
text-white

bg-gradient-to-r
from-gray-600
to-gray-800

shadow-lg

"

>

🔄 Reset Alokasi SHU

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
label="SHU Anggota"
value={nominalSHU.shuAnggota}
/>
<CardSHU
label="SHU Simpanan Anggota"
value={nominalSHU.shuSimpanan}
/>


<CardSHU
label="SHU Jasa Anggota"
value={nominalSHU.shuJasa}
/>

<CardSHU
label="SHU Pengurus"
value={nominalSHU.shuPengurus}
/>


<CardSHU
label="SHU Pengawas"
value={nominalSHU.shuPengawas}
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
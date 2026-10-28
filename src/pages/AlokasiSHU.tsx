import { useState } from "react";
import Layout from "../components/Layout";
import { supabase } from "../lib/supabase";
import { useEffect } from "react";
import {
getAlokasiSHU,
simpanAlokasiSHU
} from "../services/alokasi_shu";

export default function AlokasiSHU(){


const [tahun,setTahun]=useState(2026);


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



useEffect(()=>{

loadAlokasi();

},[]);



async function loadAlokasi(){

try{

const data = await getAlokasiSHU(tahun);


if(data){

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


async function simpan(){


if(total!==100){

alert(
"Total alokasi harus 100%"
);

return;

}



const {error}=await supabase
.from("alokasi_shu")
.insert({

tahun,

cadangan,

jasa_anggota:jasaAnggota,

jasa_pengurus:jasaPengurus,

jasa_pengawas:jasaPengawas,

dana_pendidikan:pendidikan,

dana_sosial:sosial,

dana_pembangunan:pembangunan

});



if(error){

alert(error.message);

return;

}



alert(
"Alokasi SHU berhasil disimpan"
);


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


await simpanAlokasiSHU({

tahun,

cadangan,

jasa_anggota:jasaAnggota,

jasa_pengurus:jasaPengurus,

jasa_pengawas:jasaPengawas,

dana_pendidikan:pendidikan,

dana_sosial:sosial,

dana_pembangunan:pembangunan

});


alert(
"Alokasi SHU berhasil disimpan"
);


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



<button

onClick={simpan}

className="
mt-6
px-8
py-3
rounded-xl
bg-gradient-to-r
from-green-600
to-emerald-500
text-white
font-bold
shadow-lg
"

>

💾 Simpan Alokasi SHU

</button>



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
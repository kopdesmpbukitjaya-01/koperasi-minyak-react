import { useState } from "react";

import {
  getPortalAnggota
} from "../services/simpanan";
export default function PortalAnggota(){

const [idAnggota,setIdAnggota] = useState("");
const [nama,setNama] = useState("");
const [infoAnggota,setInfoAnggota] = useState<any>(null);
const [loading,setLoading] = useState(false);
async function cekInformasiAnggota(){

try{

setLoading(true);


const data =
await getPortalAnggota(
  idAnggota.trim(),
  nama.trim()
);



setInfoAnggota({

id:data.id,

kode_warga:data.kode_warga,

nama:data.nama,

pokok:data.pokok,

wajib:data.wajib,

sukarela:data.sukarela,

shu:""

});


}
catch(err:any){

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


<p
className="
text-gray-400
mt-2
"
>
Informasi Simpanan & SHU Anggota Koperasi
</p>



<div className="mt-6 space-y-4">


<input
value={idAnggota}
onChange={(e)=>setIdAnggota(e.target.value)}
placeholder="Kode Anggota (contoh: KDMP0011)"
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
onChange={(e)=>setNama(e.target.value)}
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

<h2
className="
text-xl
font-bold
"
>
Informasi Rekening Anggota
</h2>


<div className="mt-4 space-y-3 text-gray-300">


<p>
Nama :
{infoAnggota?.nama || "-"}
</p>


<p>
Kode Anggota :
{infoAnggota?.kode_warga || "-"}
</p>


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


<p>
SHU :
{infoAnggota?.shu || "-"}
</p>


</div>


</div>


</div>


</div>


);


}
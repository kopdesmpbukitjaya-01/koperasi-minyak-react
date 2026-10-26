import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import {
  addLaporanRat,
  getLaporanRat,
  updateLaporanRat,
  deleteLaporanRat,
} from "../services/rat";


export default function Rat(){


const [tahun,setTahun]=useState(
new Date().getFullYear()
);

const [namaKoperasi,setNamaKoperasi]=useState(
"Koperasi Desa Merah Putih KDMP Bukit Jaya"
);

const [alamat,setAlamat]=useState("");

const [ketua,setKetua] = useState("");

const [wakilKetuaUsaha,setWakilKetuaUsaha] = useState("");

const [wakilKetuaKeanggotaan,setWakilKetuaKeanggotaan] = useState("");

const [sekretaris,setSekretaris] = useState("");

const [bendahara1,setBendahara1] = useState("");

const [bendahara2,setBendahara2] = useState("");


const [dataRat,setDataRat]=useState<any[]>([]);
const [editId,setEditId] = useState<number | null>(null);


useEffect(()=>{

loadData();

},[]);



async function loadData(){

try{

const data =
await getLaporanRat();

setDataRat(data || []);


}catch(err){

console.error(err);

}

}




async function simpanRat(){

try{


const data = {

tahun,

nama_koperasi:namaKoperasi,

alamat,

ketua,

wakil_ketua_usaha:wakilKetuaUsaha,

wakil_ketua_keanggotaan:wakilKetuaKeanggotaan,

sekretaris,

bendahara_1:bendahara1,

bendahara_2:bendahara2,

};



if(editId){

await updateLaporanRat(
editId,
data
);

alert(
"Data RAT berhasil diperbarui"
);


}else{


await addLaporanRat(data);


alert(
"Laporan RAT berhasil disimpan"
);


}


// RESET FORM SETELAH BERHASIL

setEditId(null);

setAlamat("");
setKetua("");
setWakilKetuaUsaha("");
setWakilKetuaKeanggotaan("");
setSekretaris("");
setBendahara1("");
setBendahara2("");


// LOAD ULANG ARSIP RAT

loadData();



}catch(err:any){

console.error(err);

alert(
"Gagal menyimpan RAT"
);

}


}

function editRat(item:any){

setEditId(item.id);

setTahun(item.tahun);

setNamaKoperasi(
item.nama_koperasi || ""
);

setAlamat(
item.alamat || ""
);

setKetua(
item.ketua || ""
);


setWakilKetuaUsaha(
item.wakil_ketua_usaha || ""
);


setWakilKetuaKeanggotaan(
item.wakil_ketua_keanggotaan || ""
);


setSekretaris(
item.sekretaris || ""
);


setBendahara1(
item.bendahara_1 || ""
);


setBendahara2(
item.bendahara_2 || ""
);


window.scrollTo({
top:0,
behavior:"smooth"
});


}


async function hapusRat(id:number){


const yakin =
confirm(
"Yakin menghapus laporan RAT ini?"
);


if(!yakin)
return;



try{


await deleteLaporanRat(id);


alert(
"Laporan RAT berhasil dihapus"
);


loadData();



}catch(error){


console.error(error);


alert(
"Gagal menghapus RAT"
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
🏛️ Laporan RAT Koperasi
</h1>


<p className="text-gray-300 mt-3">
Pengelolaan Rapat Anggota Tahunan
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


<h2
className="
text-2xl
font-bold
text-white
mb-6
"
>
📋 Identitas RAT
</h2>



<div
className="
grid
grid-cols-1
md:grid-cols-2
gap-5
"
>


<input
value={tahun}
type="number"
onChange={(e)=>setTahun(Number(e.target.value))}
placeholder="Tahun RAT"
className="inputRAT"
/>


<input
value={namaKoperasi}
onChange={(e)=>setNamaKoperasi(e.target.value)}
placeholder="Nama Koperasi"
className="inputRAT"
/>


<input
value={alamat}
onChange={(e)=>setAlamat(e.target.value)}
placeholder="Alamat Koperasi"
className="inputRAT"
/>


<input
value={ketua}
onChange={(e)=>setKetua(e.target.value)}
placeholder="Ketua Pengurus"
className="inputRAT"
/>
<input
value={wakilKetuaUsaha}
onChange={(e)=>setWakilKetuaUsaha(e.target.value)}
placeholder="Wakil Ketua Bidang Usaha"
className="
w-full
p-3
rounded-xl
bg-black/30
border
border-white/20
text-white
"
/>


<input
value={wakilKetuaKeanggotaan}
onChange={(e)=>setWakilKetuaKeanggotaan(e.target.value)}
placeholder="Wakil Ketua Bidang Keanggotaan"
className="
w-full
p-3
rounded-xl
bg-black/30
border
border-white/20
text-white
"
/>

<input
value={sekretaris}
onChange={(e)=>setSekretaris(e.target.value)}
placeholder="Sekretaris"
className="inputRAT"
/>


<input
value={bendahara1}
onChange={(e)=>setBendahara1(e.target.value)}
placeholder="Bendahara 1"
className="
w-full
p-3
rounded-xl
bg-black/30
border
border-white/20
text-white
"
/>


<input
value={bendahara2}
onChange={(e)=>setBendahara2(e.target.value)}
placeholder="Bendahara 2"
className="
w-full
p-3
rounded-xl
bg-black/30
border
border-white/20
text-white
"
/>



</div>




<button

onClick={simpanRat}

className="
mt-8
px-8
py-3
rounded-xl

bg-gradient-to-r
from-red-600
to-purple-600

text-white
font-bold
"

>
{
editId
?
"💾 Update RAT"
:
"💾 Simpan RAT"
}
</button>



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


<h2
className="
text-2xl
font-bold
text-white
mb-5
"
>
📚 Arsip RAT
</h2>


{
dataRat.map((item:any)=>(

<div
key={item.id}
className="
p-4
rounded-xl
bg-black/30
mb-3
text-gray-200
"
>

<h3 className="font-bold">
RAT Tahun {item.tahun}
</h3>


<p>
{item.nama_koperasi}
</p>



<div className="mt-4 flex gap-3">


<button

onClick={()=>editRat(item)}

className="
px-4
py-2
rounded-lg
bg-blue-600
text-white
font-bold
"

>
✏️ Edit
</button>



<button

onClick={()=>hapusRat(item.id)}

className="
px-4
py-2
rounded-lg
bg-red-600
text-white
font-bold
"

>
🗑️ Hapus
</button>


</div>



</div>

))
}



</div>



</div>



</Layout>

);


}
import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../assets/logo_transparan.png";
import Layout from "../components/Layout";
import {
  addLaporanRat,
  getLaporanRat,
  updateLaporanRat,
  deleteLaporanRat,
} from "../services/rat";
import {
  getRingkasanRat
} from "../services/rat_keuangan";

const IDENTITAS_KOPERASI = {
  badanHukum:
  "AHU-0023468.AH.01.29.TAHUN 2025",

  alamat:
  "Jl. Sunan Giri No.05 RT.001 RW.000 Desa Bukit Jaya Kode Pos: 74667"
};
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
const [ringkasan,setRingkasan]=useState<any>(null);

useEffect(()=>{

loadData();

},[]);



async function loadData(){

try{

const data =
await getLaporanRat();

setDataRat(data || []);


const keuangan =
await getRingkasanRat();


console.log("DATA RAT :", keuangan);


setRingkasan(keuangan);


}catch(err){

console.error("ERROR RAT :", err);

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
function downloadPDF(){

const doc = new jsPDF({

  orientation:"portrait",

  unit:"mm",

  format:[215,330]

});



/* =====================
      HEADER LOGO
===================== */


doc.addImage(
  logo,
  "PNG",
  15,
  12,
  25,
  25
);


// =========================
// HEADER KOPERASI
// =========================

doc.setFontSize(18);

doc.setFont("helvetica","bold");


doc.text(
"KOPERASI DESA MERAH PUTIH",
105,
17,
{
align:"center"
}
);



doc.setFontSize(16);

doc.text(
"BUKIT JAYA",
105,
26,
{
align:"center"
}
);

// =========================
// IDENTITAS KOPERASI
// =========================

doc.setFontSize(10);

doc.setFont("helvetica", "italic");


doc.text(
"Nomor Badan Hukum: AHU-0023468.AH.01.29.TAHUN 2025",
105,
35,
{
align:"center"
}
);


doc.text(
"Jl. Sunan Giri No.05 RT.001 RW.000 Desa Bukit Jaya Kode Pos: 74667",
105,
41,
{
align:"center"
}
);



doc.line(
15,
47,
200,
47
);


// GARIS KOP

doc.line(
  15,
  53,
  195,
  53
);


// =========================
// JUDUL LAPORAN
// =========================

doc.setFont("helvetica","bold");

doc.setFontSize(14);


doc.text(
  "LAPORAN RAPAT ANGGOTA TAHUNAN (RAT)",
  105,
  65,
  {
    align:"center"
  }
);


let y = 82;


// =========================
// IDENTITAS RAT
// =========================

doc.setFontSize(11);


doc.setFont("helvetica","bold");


doc.text(
  "Tahun Buku",
  20,
  y
);


doc.text(
  "Nomor Badan Hukum",
  20,
  y + 8
);


doc.text(
  "Alamat",
  20,
  y + 16
);



doc.setFont("helvetica","normal");


doc.text(
  `: ${tahun}`,
  70,
  y
);


doc.text(
  `: ${IDENTITAS_KOPERASI.badanHukum}`,
  70,
  y + 8
);


doc.text(
  `: ${IDENTITAS_KOPERASI.alamat}`,
  70,
  y + 16
);



// =========================
// PENGURUS
// =========================


doc.setFont("helvetica","bold");

doc.text(
  "Pengurus Koperasi",
  20,
  112
);



autoTable(doc,{

startY:120,


head:[

[
"Jabatan",
"Nama"
]

],


body:[

[
"Ketua",
ketua
],

[
"Wakil Ketua Usaha",
wakilKetuaUsaha
],

[
"Wakil Ketua Keanggotaan",
wakilKetuaKeanggotaan
],

[
"Sekretaris",
sekretaris
],

[
"Bendahara 1",
bendahara1
],

[
"Bendahara 2",
bendahara2
],

]


});




autoTable(doc,{

startY:
(doc as any).lastAutoTable.finalY + 15,


head:[

[
"Keterangan",
"Jumlah"
]

],


body:[

[
"Jumlah Anggota",
ringkasan?.jumlahAnggota || 0
],


[
"Simpanan Pokok",
`Rp ${Number(
ringkasan?.simpananPokok || 0
).toLocaleString("id-ID")}`
],


[
"Simpanan Wajib",
`Rp ${Number(
ringkasan?.simpananWajib || 0
).toLocaleString("id-ID")}`
],


[
"Simpanan Sukarela",
`Rp ${Number(
ringkasan?.simpananSukarela || 0
).toLocaleString("id-ID")}`
],


[
"Omzet Penjualan BBM",
`Rp ${Number(
ringkasan?.omzetPenjualan || 0
).toLocaleString("id-ID")}`
],


[
"SHU Bersih",
`Rp ${Number(
ringkasan?.shuBersih || 0
).toLocaleString("id-ID")}`
],


]

});



// ===============================
// TANDA TANGAN PENGURUS
// ===============================

const signY = 250;

doc.setFont("helvetica", "normal");
doc.setFontSize(11);

doc.text(`Bukit Jaya, ${new Date().toLocaleDateString("id-ID")}`, 145, signY);
doc.text("Pengurus Koperasi", 155, signY + 7);

// Ketua
doc.text("Ketua", 25, signY + 20);
doc.text("(........................................)", 15, signY + 55);
doc.text(ketua || "-", 25, signY + 62);

// Sekretaris
doc.text("Sekretaris", 95, signY + 20);
doc.text("(........................................)", 85, signY + 55);
doc.text(sekretaris || "-", 95, signY + 62);

// Bendahara
doc.text("Bendahara", 165, signY + 20);
doc.text("(........................................)", 155, signY + 55);
doc.text(bendahara1 || "-", 165, signY + 62);
doc.save(
`Laporan_RAT_KDMP_Bukit_Jaya_${tahun}.pdf`
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

<button

onClick={downloadPDF}

className="
mt-8
ml-3
px-8
py-3
rounded-xl

bg-gradient-to-r
from-blue-600
to-cyan-500

text-white
font-bold

shadow-lg
"

>
📄 Download PDF RAT
</button>
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
📊 Ringkasan Keuangan RAT
</h2>


<div
className="
grid
grid-cols-1
md:grid-cols-3
gap-4
"
>


<div className="p-4 rounded-xl bg-black/30">
<p className="text-gray-400">
Jumlah Anggota
</p>

<h3 className="text-2xl font-bold text-white">
{ringkasan?.jumlahAnggota || 0}
</h3>

</div>



<div className="p-4 rounded-xl bg-black/30">
<p className="text-gray-400">
Simpanan Pokok
</p>

<h3 className="text-xl font-bold text-white">
Rp {Number(ringkasan?.simpananPokok || 0)
.toLocaleString("id-ID")}
</h3>

</div>



<div className="p-4 rounded-xl bg-black/30">
<p className="text-gray-400">
Simpanan Wajib
</p>

<h3 className="text-xl font-bold text-white">
Rp {Number(ringkasan?.simpananWajib || 0)
.toLocaleString("id-ID")}
</h3>

</div>



<div className="p-4 rounded-xl bg-black/30">
<p className="text-gray-400">
Simpanan Sukarela
</p>

<h3 className="text-xl font-bold text-white">
Rp {Number(ringkasan?.simpananSukarela || 0)
.toLocaleString("id-ID")}
</h3>

</div>



<div className="p-4 rounded-xl bg-black/30">
<p className="text-gray-400">
Omzet Penjualan BBM
</p>

<h3 className="text-xl font-bold text-white">
Rp {Number(ringkasan?.omzetPenjualan || 0)
.toLocaleString("id-ID")}
</h3>

</div>



<div className="p-4 rounded-xl bg-black/30">
<p className="text-gray-400">
SHU Bersih
</p>

<h3 className="text-xl font-bold text-green-400">
Rp {Number(ringkasan?.shuBersih || 0)
.toLocaleString("id-ID")}
</h3>

</div>


</div>


</div>
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
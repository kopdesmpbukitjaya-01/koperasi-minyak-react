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
import {
  getPembagianSHUAnggota
} from "../services/shu_anggota";

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
const [shuAnggota,setShuAnggota]=useState<any[]>([]);
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
const dataSHU =
await getPembagianSHUAnggota(
  Number(keuangan?.shuBersih || 0) * 0.50
);


setShuAnggota(dataSHU || []);

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
// HALAMAN SHU & TANDA TANGAN
// ===============================


let posisiY = (doc as any).lastAutoTable?.finalY || 60;


// beri jarak
posisiY += 20;


// ===============================
// CEK HALAMAN SHU
// ===============================

if(posisiY > 220){

doc.addPage();

posisiY = 40;

}



// ===============================
// JUDUL SHU
// ===============================


doc.setFontSize(14);

doc.setFont(
"helvetica",
"bold"
);


doc.text(
"ALOKASI SISA HASIL USAHA (SHU)",
105,
posisiY,
{
align:"center"
}
);



posisiY += 10;



const shu =
Number(ringkasan?.shuBersih || 0);



const alokasiSHU = [

[
"SHU Bersih",
shu
],

[
"Cadangan Koperasi 25%",
shu * 0.25
],

[
"Bagian Anggota 50%",
shu * 0.50
],

[
"Dana Pengurus dan Pengawas 5%",
shu * 0.05
],

[
"Dana Pendidikan 5%",
shu * 0.05
],

[
"Dana Sosial 5%",
shu * 0.05
]

];




autoTable(doc,{

startY: posisiY,

head:[

[
"Keterangan",
"Jumlah"
]

],

body:

alokasiSHU.map((item:any)=>[

item[0],

"Rp "+
Number(item[1])
.toLocaleString("id-ID")

]),


theme:"grid",

styles:{

fontSize:11

},

headStyles:{

fillColor:[40,40,40],

textColor:255,

fontStyle:"bold"

}


});





// ===============================
// TANDA TANGAN
// ===============================




doc.setFont(
"helvetica",
"normal"
);


doc.setFontSize(11);




// ==============================
// HALAMAN PEMBAGIAN SHU ANGGOTA
// ==============================


doc.addPage();


let shuAnggotaY = 30;



doc.setFontSize(14);

doc.setFont(
"helvetica",
"bold"
);


doc.text(
"PEMBAGIAN SISA HASIL USAHA (SHU) ANGGOTA",
105,
shuAnggotaY,
{
align:"center"
}
);



shuAnggotaY += 15;



doc.setFontSize(11);

doc.setFont(
"helvetica",
"normal"
);



autoTable(doc,{


startY:shuAnggotaY,


head:[

[
"No",
"Nama Anggota",
"Simpanan",
"Transaksi",
"SHU Diterima"
]

],


body:

shuAnggota.map(
(item:any,index:number)=>[

index+1,

item.nama,

"Rp "+
Number(item.simpanan)
.toLocaleString("id-ID"),


"Rp "+
Number(item.transaksi)
.toLocaleString("id-ID"),


"Rp "+
Number(item.shu)
.toLocaleString("id-ID")

]
),


theme:"grid",


styles:{

fontSize:9

},


headStyles:{

fontStyle:"bold"

}


});




// TOTAL SHU ANGGOTA


const totalSHUAnggota = shuAnggota.reduce(

(total,item)=>

total+
Number(item.shu||0)

,0);



const posisiTotal =
((doc as any)
.lastAutoTable
.finalY || shuAnggotaY)
+15;



doc.setFontSize(11);

doc.setFont(
"helvetica",
"bold"
);


doc.text(

"TOTAL SHU DITERIMA ANGGOTA : Rp "+
Number(totalSHUAnggota)
.toLocaleString("id-ID"),

20,

posisiTotal

);


// Tempat tanggal

doc.setFont("helvetica","normal");
doc.setFontSize(11);


// ===============================
// HALAMAN TANDA TANGAN PENGURUS
// ===============================

doc.addPage();

doc.setFont("helvetica","normal");
doc.setFontSize(11);


// posisi headline halaman
const tandaTanganY = 10;


// tanggal
doc.text(
`Bukit Jaya, ${new Date().toLocaleDateString("id-ID")}`,
145,
tandaTanganY
);


// pengurus koperasi
doc.text(
"Pengurus Koperasi",
155,
tandaTanganY + 6
);



// ===============================
// KOLOM TANDA TANGAN
// ===============================


// Jabatan
doc.text(
"Ketua",
35,
tandaTanganY + 18
);


doc.text(
"Sekretaris",
100,
tandaTanganY + 18
);


doc.text(
"Bendahara",
165,
tandaTanganY + 18
);




// Garis tanda tangan
doc.text(
"(................................)",
20,
tandaTanganY + 38
);


doc.text(
"(................................)",
85,
tandaTanganY + 38
);


doc.text(
"(................................)",
150,
tandaTanganY + 38
);




// Nama pengurus

doc.text(
ketua || "-",
35,
tandaTanganY + 45
);


doc.text(
sekretaris || "-",
100,
tandaTanganY + 45
);


doc.text(
bendahara1 || "-",
165,
tandaTanganY + 45
);


// ===============================
// SIMPAN PDF
// ===============================

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
💰 Pembagian SHU Anggota
</h2>


<div className="overflow-auto">


<table className="w-full text-sm">


<thead>

<tr className="bg-black/30">

<th className="p-3 text-left">
No
</th>

<th className="p-3 text-left">
Nama Anggota
</th>

<th className="p-3 text-left">
Simpanan
</th>

<th className="p-3 text-left">
Transaksi
</th>

<th className="p-3 text-left">
SHU Diterima
</th>

</tr>

</thead>



<tbody>


{
shuAnggota.map(
(item:any,index:number)=>(


<tr
key={index}
className="
border-b
border-white/10
"
>


<td className="p-3">
{index+1}
</td>


<td className="p-3">
{item.nama}
</td>


<td className="p-3">
Rp {Number(item.simpanan)
.toLocaleString("id-ID")}
</td>


<td className="p-3">
Rp {Number(item.transaksi)
.toLocaleString("id-ID")}
</td>


<td className="
p-3
font-bold
text-green-400
">

Rp {Number(item.shu)
.toLocaleString("id-ID")}

</td>


</tr>


)
)
}


</tbody>


</table>


</div>


</div>
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
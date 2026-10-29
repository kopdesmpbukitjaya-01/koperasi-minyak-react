import { Capacitor } from "@capacitor/core";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { FileOpener } from "@capacitor-community/file-opener";
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
  getPembagianSHUAnggota,
  simpanSHUAnggota
} from "../services/shu_anggota";

import {
  getPembagianSHUPengurus,
  getPembagianSHUPengawas
} from "../services/shu_pengurus";

import {
  getAlokasiSHU
} from "../services/alokasi_shu";
import {
simpanSHUStruktur
} from "../services/shu_struktur";

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
const [shuPengurus,setShuPengurus]=useState<any[]>([]);

const [shuPengawas,setShuPengawas]=useState<any[]>([]);
const [tahunSHU, setTahunSHU] = useState("");
const [tampilkanSHU, setTampilkanSHU] = useState(false);
const [savingSHU,setSavingSHU] = useState(false);
useEffect(()=>{

loadData();

},[]);



async function loadData(){

try{


const data =
await getLaporanRat();

setDataRat(
data || []
);



const keuangan =
await getRingkasanRat();


console.log(
"DATA RAT :",
keuangan
);


setRingkasan(
keuangan
);



const totalSHU =
Number(
keuangan?.shuBersih || 0
);


// SHU ANGGOTA
const totalSHUAnggota =
totalSHU *
0.5;


const dataSHU =
await getPembagianSHUAnggota(
  totalSHUAnggota
);
setShuAnggota(
dataSHU || []
);



// SHU PENGURUS
const dataPengurus =
await getPembagianSHUPengurus(
totalSHU,
tahun
);

setShuPengurus(
dataPengurus || []
);


console.log(
"SHU PENGURUS:",
dataPengurus
);



// SHU PENGAWAS
const dataPengawas =
await getPembagianSHUPengawas(
totalSHU,
tahun
);
await simpanSHUStruktur(
[
...dataPengurus,
...dataPengawas
],
tahun
);
setShuPengawas(
dataPengawas || []
);


console.log(
"SHU PENGAWAS:",
dataPengawas
);



}catch(err){

console.error(
"ERROR RAT :",
err
);

}

}





// ============================
// SIMPAN SHU ANGGOTA
// ============================

async function simpanPembagianSHU(){

try{

setSavingSHU(true);


const alokasi =
await getAlokasiSHU(tahun);


const totalSHU =
Number(
ringkasan?.shuBersih || 0
);
const totalSHUAnggota =
totalSHU *
(
Number(
alokasi?.jasa_anggota || 0
)
/100
);

(
Number(
alokasi?.jasa_anggota || 0
)
/100
);



const dataSHU =
await getPembagianSHUAnggota(
  totalSHUAnggota
);
console.log(
"TOTAL JASA ANGGOTA SEHARUSNYA",
totalSHU * Number(alokasi.jasa_anggota)/100
);


await simpanSHUAnggota(

tahun,

dataSHU

);

const dataPengurus =
await getPembagianSHUPengurus(
totalSHU,
tahun
);


const dataPengawas =
await getPembagianSHUPengawas(
totalSHU,
tahun
);



await simpanSHUStruktur(
[
...dataPengurus,
...dataPengawas
],
tahun
);

alert(
"Pembagian SHU anggota berhasil disimpan"
);



}catch(error){

console.error(error);

}finally{

setSavingSHU(false);

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
async function downloadPDF(){

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



const alokasi =
await getAlokasiSHU(tahun);
const totalAlokasiSHU =
Number(alokasi?.cadangan || 0) +
Number(alokasi?.jasa_anggota || 0) +
Number(alokasi?.jasa_pengurus || 0) +
Number(alokasi?.jasa_pengawas || 0) +
Number(alokasi?.dana_pendidikan || 0) +
Number(alokasi?.dana_sosial || 0) +
Number(alokasi?.dana_pembangunan || 0);
if(totalAlokasiSHU !== 100){

console.error(
"TOTAL ALOKASI SHU TIDAK 100%",
totalAlokasiSHU
);

}

const alokasiSHU = [

[
"SHU Bersih",
shu
],


[
`Cadangan Koperasi ${alokasi?.cadangan || 0}%`,
shu * Number(alokasi?.cadangan || 0) / 100
],


[
`Jasa Anggota ${alokasi?.jasa_anggota || 0}%`,
shu * Number(alokasi?.jasa_anggota || 0) / 100
],


[
`Jasa Pengurus ${alokasi?.jasa_pengurus || 0}%`,
shu * Number(alokasi?.jasa_pengurus || 0) / 100
],


[
`Jasa Pengawas ${alokasi?.jasa_pengawas || 0}%`,
shu * Number(alokasi?.jasa_pengawas || 0) / 100
],


[
`Dana Pendidikan ${alokasi?.dana_pendidikan || 0}%`,
shu * Number(alokasi?.dana_pendidikan || 0) / 100
],


[
`Dana Sosial ${alokasi?.dana_sosial || 0}%`,
shu * Number(alokasi?.dana_sosial || 0) / 100
],


[
`Dana Pembangunan ${alokasi?.dana_pembangunan || 0}%`,
shu * Number(alokasi?.dana_pembangunan || 0) / 100
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

console.log(
"JUMLAH DATA SHU PDF",
shuAnggota.length,
shuAnggota
);
const totalSHUAnggota = shuAnggota.reduce(

(total,item)=>

total+
Number(item.shu||0)

,0);
const totalSHUPengurus =
shuPengurus.reduce(
(a,b)=>
a + Number(b.shu || 0),
0
);


const totalSHUPengawas =
shuPengawas.reduce(
(a,b)=>
a + Number(b.shu || 0),
0
);
console.log(
"VALIDASI SHU",
{
SHU_Bersih:ringkasan?.shuBersih,

Anggota:totalSHUAnggota,

Pengurus:totalSHUPengurus,

Pengawas:totalSHUPengawas,

Total:
totalSHUAnggota+
totalSHUPengurus+
totalSHUPengawas

}
);

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
// HALAMAN PEMBAGIAN SHU PENGURUS
// ===============================

doc.addPage();


doc.setFontSize(14);

doc.setFont(
"helvetica",
"bold"
);


doc.text(
"PEMBAGIAN SISA HASIL USAHA (SHU) PENGURUS",
105,
30,
{
align:"center"
}
);


autoTable(doc,{

startY:45,

head:[
[
"No",
"Nama",
"Jabatan",
"SHU Diterima"
]
],


body:

shuPengurus.map(
(item:any,index:number)=>
[
index+1,
item.nama,
item.jabatan || "-",
"Rp "+
Number(item.shu)
.toLocaleString("id-ID")
]
),


theme:"grid",

styles:{
fontSize:10
}

});
// ===============================
// HALAMAN PEMBAGIAN SHU PENGAWAS
// ===============================

doc.addPage();


doc.setFontSize(14);

doc.setFont(
"helvetica",
"bold"
);


doc.text(
"PEMBAGIAN SISA HASIL USAHA (SHU) PENGAWAS",
105,
30,
{
align:"center"
}
);



autoTable(doc,{

startY:45,


head:[
[
"No",
"Nama",
"Jabatan",
"SHU Diterima"
]
],



body:

shuPengawas.map(
(item:any,index:number)=>
[
index+1,
item.nama,
item.jabatan || "-",
"Rp "+
Number(item.shu)
.toLocaleString("id-ID")
]
),


theme:"grid",


styles:{
fontSize:10
}


});
// ===============================
// SIMPAN PDF
// ===============================

// ===============================
// SIMPAN PDF
// ===============================

const fileName =
`Laporan_RAT_KDMP_Bukit_Jaya_${tahun}.pdf`;


if (Capacitor.isNativePlatform()) {


  const pdfBase64 =
  doc.output("datauristring")
  .split(",")[1];


  const savedFile =
  await Filesystem.writeFile({

    path:fileName,

    data:pdfBase64,

    directory:Directory.Documents,

  });


  await FileOpener.open({

    filePath:savedFile.uri,

    contentType:"application/pdf",

  });


}
else{


  doc.save(fileName);


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
<button

disabled={savingSHU}

onClick={simpanPembagianSHU}

className="
mt-8
ml-3
px-8
py-3
rounded-xl

bg-gradient-to-r
from-green-600
to-emerald-500

text-white
font-bold

shadow-lg

disabled:opacity-50
"

>
{
savingSHU
?
"⏳ Menyimpan SHU..."
:
"💰 Simpan Pembagian SHU Anggota"
}

</button>
<div
className="
mt-6
p-5
rounded-2xl
bg-black/30
border
border-white/10
"
>

<h3
className="
text-xl
font-bold
text-white
mb-4
"
>
📊 Pilih Tahun RAT Pembagian SHU
</h3>


<select

value={tahunSHU}

onChange={(e)=>
setTahunSHU(e.target.value)
}

className="
w-full
md:w-72
p-3
rounded-xl
bg-black/40
border
border-white/20
text-white
"

>

<option value="">
Pilih Tahun RAT
</option>

<option value="2026">
2026
</option>


</select>


<button

onClick={()=>
setTampilkanSHU(true)
}

className="
mt-4
px-6
py-3
rounded-xl
bg-gradient-to-r
from-blue-600
to-cyan-500
text-white
font-bold
"

>

🔍 Tampilkan SHU

</button>


<button

onClick={()=>
setTampilkanSHU(false)
}

className="
mt-4
ml-3
px-6
py-3
rounded-xl
bg-gradient-to-r
from-gray-600
to-gray-800
text-white
font-bold
"

>

🙈 Sembunyikan

</button>


</div>
{
tampilkanSHU && tahunSHU && (

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
            <th>
Status
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


<td
className="
p-3
font-bold
text-green-400
"
>
Rp {Number(item.shu)
.toLocaleString("id-ID")}
</td>


<td className="p-3">

<span
className={`
px-3
py-1
rounded-full
text-xs
font-black

${
item.status === "Pengurus"

?

"bg-green-500/20 text-green-400 border border-green-400"

:

item.status === "Pengawas"

?

"bg-yellow-500/20 text-yellow-400 border border-yellow-400"

:

"bg-blue-500/20 text-blue-400 border border-blue-400"

}

`}
>

{item.status.toUpperCase()}

</span>

</td>


</tr>

)
)
}

</tbody>

      </table>

    </div>
    {/* ==========================
PEMBAGIAN SHU PENGURUS
========================== */}

<div className="mt-10">

<h2 className="
text-2xl
font-black
text-white
mb-4
">
👔 Pembagian SHU Pengurus
</h2>


<div className="overflow-auto">

<table className="w-full text-sm">

<thead>

<tr className="bg-black/30 text-white">

<th className="p-3 text-left">
No
</th>

<th className="p-3 text-left">
Nama
</th>

<th className="p-3 text-left">
Jabatan
</th>

<th className="p-3 text-left">
SHU Diterima
</th>

</tr>

</thead>


<tbody>

{
shuPengurus.map(
(item:any,index:number)=>(

<tr
key={index}
className="
border-b
border-white/10
text-white
"
>

<td className="p-3">
{index+1}
</td>


<td className="p-3">
{item.nama}
</td>


<td className="p-3 uppercase">
{item.jabatan}
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
{/* ===========================
    PEMBAGIAN SHU PENGAWAS
=========================== */}

<div className="
mt-10
rounded-3xl
p-6
bg-white/5
border
border-white/10
">


<h3 className="
text-2xl
font-black
text-yellow-400
mb-5
">
🛡️ Pembagian SHU Pengawas
</h3>


<table className="w-full text-sm">

<thead>

<tr className="bg-black/30">

<th className="p-3">
No
</th>

<th className="p-3 text-left">
Nama
</th>

<th className="p-3 text-left">
Jabatan
</th>

<th className="p-3 text-left">
Status
</th>

<th className="p-3 text-left">
SHU Diterima
</th>

</tr>

</thead>


<tbody>

{
shuPengawas.map(
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
{item.jabatan}
</td>


<td className="p-3">

<span
className="
px-3
py-1
rounded-full
text-xs
font-black
bg-yellow-500/20
text-yellow-400
border
border-yellow-400
"
>

{item.kategori.toUpperCase()}

</span>

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

)

}
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
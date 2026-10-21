import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  getJumlahAnggota,
  getRekapPenjualanBBM,
  getLabaBersih,
} from "../services/dashboardPublic";


export default function PublicDashboard() {


  const navigate = useNavigate();


  const [jumlahAnggota,setJumlahAnggota] = useState(0);

  const [rekap,setRekap] = useState<any[]>([]);

  const [labaBersih,setLabaBersih] = useState(0);



  useEffect(()=>{

    loadDashboard();

  },[]);



  async function loadDashboard(){

    try{


      const anggota =
        await getJumlahAnggota();


      const data =
        await getRekapPenjualanBBM();
console.log("REKAP BBM :", data);

      const laba =
        await getLabaBersih();



      setJumlahAnggota(anggota);

      setRekap(data);

      setLabaBersih(laba);



    }catch(error){

      console.error(
        "Gagal mengambil dashboard",
        error
      );

    }

  }




  const totalPertalite =
  rekap
  .filter(
    item =>
    item.jenis?.toLowerCase().includes("pertalite")
  )
    .reduce(
      (a,b)=>
      a + Number(b.terjual || 0),
      0
    );



  const totalPertamax =
  rekap
  .filter(
    item =>
    item.jenis?.toLowerCase().includes("pertamax")
  )
    .reduce(
      (a,b)=>
      a + Number(b.terjual || 0),
      0
    );

const totalPenjualanBBM =
  totalPertalite + totalPertamax;


return (

<div
className="
min-h-screen
bg-gradient-to-br
from-red-700
via-red-500
to-yellow-400
p-6
"
>


<div
className="
max-w-6xl
mx-auto
"
>



{/* HEADER */}

<div
className="
bg-white/90
backdrop-blur
rounded-3xl
shadow-2xl
p-8
flex
justify-between
items-center
"
>


<div>

<h1
className="
text-4xl
font-extrabold
text-red-700
"
>
KDMP BUKIT JAYA
</h1>


<h2
className="
text-xl
font-semibold
text-gray-700
mt-2
"
>
Kecamatan Bulik Timur
</h2>


<p
className="
text-gray-500
mt-2
"
>
Sistem Informasi Koperasi Desa Merah Putih
</p>


</div>



<button

onClick={()=>navigate("/login")}

className="
bg-red-700
text-white
px-6
py-3
rounded-xl
font-bold
shadow-lg
hover:bg-red-800
"
>

🔐 LOGIN ADMIN

</button>


</div>






{/* KARTU */}

<div
className="
mt-8
grid
grid-cols-1
md:grid-cols-3
gap-8
"
>



<div
className="
aspect-square
bg-white/90
rounded-3xl
shadow-2xl
p-8
flex
flex-col
justify-center
"
>

<div className="text-5xl">
👥
</div>


<h3 className="mt-5 font-bold text-gray-500">
Anggota Koperasi
</h3>


<p
className="
text-5xl
font-extrabold
text-red-700
mt-3
"
>
{jumlahAnggota}
</p>


<p>
Orang
</p>


</div>





<div
className="
aspect-square
bg-white/90
rounded-3xl
shadow-2xl
p-8
flex
flex-col
justify-center
"
>

<div className="text-5xl">
⛽
</div>


<h3 className="mt-5 font-bold text-gray-500">
Total Penjualan BBM
</h3>


<p
className="
text-5xl
font-extrabold
text-red-700
mt-3
"
>
{totalPenjualanBBM.toLocaleString("id-ID")}
</p>


<p className="text-gray-500">
Liter
</p>


<div
className="
mt-5
text-sm
text-gray-700
"
>

<p>
⛽ Pertalite :
<strong>
{" "}
{totalPertalite.toLocaleString("id-ID")} L
</strong>
</p>


<p>
⛽ Pertamax :
<strong>
{" "}
{totalPertamax.toLocaleString("id-ID")} L
</strong>
</p>


</div>


</div>





<div
className="
aspect-square
bg-white/90
rounded-3xl
shadow-2xl
p-8
flex
flex-col
justify-center
"
>

<div className="text-5xl">
💰
</div>


<h3 className="mt-5 font-bold text-gray-500">
Laba Bersih
</h3>


<p
className="
text-3xl
font-extrabold
text-red-700
mt-4
"
>
Rp {labaBersih.toLocaleString("id-ID")}
</p>


<p>
Koperasi
</p>


</div>



</div>






{/* TABEL REKAP */}


<div
className="
mt-10
bg-white/90
rounded-3xl
shadow-2xl
p-8
"
>


<h2
className="
text-2xl
font-extrabold
text-red-700
mb-6
"
>
REKAP PENJUALAN BBM
</h2>



<div className="overflow-x-auto">


<table
className="
w-full
text-sm
"
>


<thead>

<tr
className="
bg-red-700
text-white
"
>

<th className="p-3">
No
</th>

<th className="p-3">
Periode
</th>

<th className="p-3">
Tanggal Penjualan
</th>

<th className="p-3">
Jenis BBM
</th>

<th className="p-3">
Jumlah Liter
</th>

<th className="p-3">
Terjual
</th>

<th className="p-3">
Sisa
</th>

<th className="p-3">
Jumlah
</th>

</tr>

</thead>



<tbody>


{
rekap.map((item,index)=>(

<tr
key={index}
className="border-b"
>


<td className="p-3 text-center">
{index+1}
</td>


<td className="p-3">
{item.periode}
</td>


<td className="p-3">
{item.tanggal}
</td>


<td className="p-3">
{item.jenis}
</td>


<td className="p-3">
{item.jumlahLiter} L
</td>


<td className="p-3">
{item.terjual} L
</td>


<td className="p-3">
{item.sisa} L
</td>


<td className="p-3">
Rp {item.jumlah.toLocaleString("id-ID")}
</td>


</tr>


))
}



</tbody>


</table>


</div>


</div>



</div>


</div>


);


}
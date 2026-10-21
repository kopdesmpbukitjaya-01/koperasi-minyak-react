import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "../assets/logo_crop.png";
import {
  getJumlahAnggota,
  getRekapPenjualanBBM,
  getLabaBersih,
} from "../services/dashboardPublic";



export default function PublicDashboard() {


  const navigate = useNavigate();



  // =====================================
  // STATE DASHBOARD
  // =====================================


  const [
    jumlahAnggota,
    setJumlahAnggota
  ] = useState(0);



  const [
    rekap,
    setRekap
  ] = useState<any[]>([]);



  const [
    labaBersih,
    setLabaBersih
  ] = useState(0);





  // =====================================
  // LOAD DATA AWAL
  // =====================================


  useEffect(() => {

    loadDashboard();

  }, []);






  // =====================================
  // AMBIL DATA DASHBOARD
  // =====================================


  async function loadDashboard() {


    try {


      const anggota =
        await getJumlahAnggota();



      const data =
        await getRekapPenjualanBBM();



      console.log(
        "REKAP BBM :",
        data
      );



      const laba =
        await getLabaBersih();




      setJumlahAnggota(
        anggota || 0
      );



      setRekap(
        data || []
      );



      setLabaBersih(
        Number(laba) || 0
      );



    } catch(error) {


      console.error(
        "Gagal mengambil dashboard",
        error
      );


    }


  }






  // =====================================
  // HITUNG TOTAL BBM
  // =====================================


  const totalPertalite =

    rekap

    .filter(
      item =>
        item.jenis
        ?.toLowerCase()
        .includes("pertalite")
    )

    .reduce(
      (
        total,
        item
      ) =>

        total +
        Number(
          item.terjual || 0
        ),

      0

    );







  const totalPertamax =

    rekap

    .filter(
      item =>
        item.jenis
        ?.toLowerCase()
        .includes("pertamax")
    )

    .reduce(
      (
        total,
        item
      ) =>

        total +
        Number(
          item.terjual || 0
        ),

      0

    );






  const totalPenjualanBBM =

    totalPertalite +
    totalPertamax;
    return (

<div
  className="
  min-h-screen
  bg-gradient-to-br
  from-slate-950
  via-slate-900
  to-indigo-950
  p-6
  "
>


<div
  className="
  max-w-6xl
  mx-auto
  "
>





{/* ================================
    HEADER
================================ */}


{/* ================================
    HEADER
================================ */}


<div
className="
bg-slate-900/80
backdrop-blur
border
border-cyan-400/30
rounded-3xl
shadow-2xl
p-8
flex
justify-between
items-center
gap-6
flex-wrap
"
>



{/* LOGO + TEXT */}


<div
className="
flex
items-center
gap-5
"
>


<div
className="
w-28
h-28
rounded-full
bg-slate-800
border-4
border-cyan-400
flex
items-center
justify-center
shadow-xl
shadow-cyan-500/30
overflow-hidden
"
>


<img

src={logo}

alt="Logo Koperasi"

className="
w-24
h-24
object-contain
rounded-full
"

/>


</div>



<div>


<h1
className="
text-4xl
font-extrabold
text-white
"
>

KDMP BUKIT JAYA

</h1>




<h2
className="
text-xl
font-semibold
text-cyan-400
mt-2
"
>

Kecamatan Bulik Timur

</h2>



<p
className="
text-slate-300
mt-2
"
>

Sistem Informasi Koperasi Desa Merah Putih

</p>


</div>


</div>







{/* LOGIN */}


<button

onClick={()=>
navigate("/login")
}

className="
px-6
py-3
rounded-xl
font-bold
text-white
bg-gradient-to-r
from-red-600
to-red-800
shadow-lg
shadow-red-500/30
hover:scale-105
transition
"

>

🔐 LOGIN ADMIN

</button>



</div>







{/* ================================
    KARTU STATISTIK
================================ */}



<div
className="
mt-8
grid
grid-cols-1
md:grid-cols-3
gap-6
"
>





{/* ANGGOTA */}


<div
className="
bg-slate-900/80
border
border-cyan-400/30
rounded-3xl
p-8
shadow-xl
shadow-cyan-500/10
"
>


<div
className="
text-5xl
"
>
👥
</div>



<h3
className="
mt-5
text-slate-400
font-bold
"
>

Anggota Koperasi

</h3>



<p
className="
text-5xl
font-extrabold
text-cyan-400
mt-3
"
>

{jumlahAnggota}

</p>



<p
className="
text-slate-400
"
>

Orang

</p>



</div>







{/* PENJUALAN BBM */}


<div
className="
bg-slate-900/80
border
border-yellow-400/30
rounded-3xl
p-8
shadow-xl
shadow-yellow-500/10
"
>


<div
className="
text-5xl
"
>
⛽
</div>



<h3
className="
mt-5
text-slate-400
font-bold
"
>

Total Penjualan BBM

</h3>




<p
className="
text-5xl
font-extrabold
text-yellow-400
mt-3
"
>

{
 totalPenjualanBBM
 .toLocaleString("id-ID")
}

</p>



<p
className="
text-slate-400
"
>

Liter

</p>




<div
className="
mt-5
text-sm
text-slate-300
space-y-2
"
>


<p>

⛽ Pertalite :

<b
className="
text-yellow-400
"
>

{" "}
{
totalPertalite
.toLocaleString("id-ID")
} L

</b>

</p>




<p>

⛽ Pertamax :

<b
className="
text-blue-400
"
>

{" "}
{
totalPertamax
.toLocaleString("id-ID")
} L

</b>

</p>



</div>


</div>








{/* LABA BERSIH */}



<div
className="
bg-slate-900/80
border
border-green-400/30
rounded-3xl
p-8
shadow-xl
shadow-green-500/10
"
>



<div
className="
text-5xl
"
>

💰

</div>




<h3
className="
mt-5
text-slate-400
font-bold
"
>

Laba Bersih

</h3>




<p
className="
text-3xl
font-extrabold
text-green-400
mt-5
"
>

Rp{" "}
{
labaBersih
.toLocaleString("id-ID")
}

</p>



<p
className="
text-slate-400
"
>

Koperasi

</p>



</div>




</div>




{/* ================================
    TABEL REKAP BBM
================================ */}



<div
className="
mt-10
bg-slate-900/80
border
border-red-400/30
rounded-3xl
p-8
shadow-2xl
"
>



<h2
className="
text-2xl
font-extrabold
text-red-400
mb-6
"
>

⛽ REKAP PENJUALAN BBM

</h2>





<div
className="
overflow-x-auto
"
>



<table
className="
w-full
text-sm
"
>



<thead>


<tr
className="
bg-gradient-to-r
from-red-700
to-red-900
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
Tanggal
</th>


<th className="p-3">
Jenis BBM
</th>


<th className="p-3">
Kuota
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
rekap.length > 0 ?


rekap.map(
(item,index)=>(


<tr

key={index}

className="
border-b
border-slate-700
text-slate-200
hover:bg-slate-800
transition
"

>


<td
className="
p-3
text-center
"
>

{index + 1}

</td>





<td
className="
p-3
"
>

{item.periode || "-"}

</td>





<td
className="
p-3
"
>

{item.tanggal || "-"}

</td>





<td
className="
p-3
font-bold
"
>

{item.jenis || "-"}

</td>





<td
className="
p-3
text-center
"
>

{
Number(
item.jumlahLiter || 0
)
.toLocaleString("id-ID")
}

 L

</td>





<td
className="
p-3
text-center
text-green-400
font-bold
"
>

{
Number(
item.terjual || 0
)
.toLocaleString("id-ID")
}

 L

</td>





<td
className="
p-3
text-center
text-yellow-400
"
>

{
Number(
item.sisa || 0
)
.toLocaleString("id-ID")
}

 L

</td>





<td
className="
p-3
text-right
font-bold
text-cyan-400
"
>

Rp{" "}

{
Number(
item.jumlah || 0
)
.toLocaleString("id-ID")
}

</td>





</tr>


)

)



:


<tr>


<td

colSpan={8}

className="
p-8
text-center
text-slate-400
"

>

Belum ada data penjualan BBM

</td>


</tr>


}



</tbody>




</table>


</div>



</div>






</div>

</div>


);

}
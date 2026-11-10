import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { getLabaKoperasi } from "../services/laba_koperasi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid
} from "recharts";
export default function LabaKoperasi() {

  const [data,setData]=useState<any>(null);


  const grafik = data
  ? [
      {
        nama:"Penjualan BBM",
        nilai:Number(data.totalPenjualan || 0)
      },
      {
        nama:"Modal BBM",
        nilai:Number(data.totalModalBerputar || 0)
      },
      {
        nama:"Pengeluaran",
        nilai:Number(data.totalPengeluaran || 0)
      },
      {
        nama:"SHU Bersih",
        nilai:Number(data.shuKoperasi || 0)
      }
    ]
  : [];

  useEffect(()=>{

    loadData();

  },[]);

  async function loadData(){

    const hasil =
      await getLabaKoperasi();

    console.log(
      "LABA KOPERASI",
      hasil
    );

    setData(hasil);

  }

  if(!data){

    return (
      <Layout>
        <div className="p-6">
          Memuat...
        </div>
      </Layout>
    );

  }

  return(

<Layout>

<div
className="
w-full
p-6
space-y-8
"
>


{/* HEADER */}

<div
className="
mt-10
w-full
rounded-3xl
p-8
bg-white/5
border
border-white/10
shadow-xl
"
>

<h1
className="
text-3xl
font-black
text-white
"
>
💰 Laba Koperasi
</h1>


<p
className="
text-gray-400
mt-2
"
>
Laporan keuangan usaha koperasi
</p>


</div>



{/* CARD LABA */}


<div
className="
grid
grid-cols-1
md:grid-cols-2
xl:grid-cols-5
gap-5
"
>



{/* PENJUALAN */}

<div
className="
rounded-3xl
p-6
bg-cyan-500/10
border
border-cyan-400/30
shadow-lg
"
>

<p className="text-cyan-300 font-bold">
💵 Total Penjualan
</p>

<h2
className="
text-2xl
font-black
text-white
mt-3
"
>
Rp {data.totalPenjualan.toLocaleString("id-ID")}
</h2>

</div>




{/* MODAL */}

<div
className="
rounded-3xl
p-6
bg-orange-500/10
border
border-orange-400/30
shadow-lg
"
>

<p className="text-orange-300 font-bold">
⛽ Modal BBM
</p>

<h2
className="
text-2xl
font-black
text-white
mt-3
"
>
Rp {data.totalModalBerputar.toLocaleString("id-ID")}
</h2>

</div>




{/* LABA KOTOR */}

<div
className="
rounded-3xl
p-6
bg-purple-500/10
border
border-purple-400/30
shadow-lg
"
>

<p className="text-purple-300 font-bold">
📈 Laba Kotor
</p>


<h2
className="
text-2xl
font-black
text-white
mt-3
"
>
Rp {data.labaKotor.toLocaleString("id-ID")}
</h2>

</div>




{/* PENGELUARAN */}

<div
className="
rounded-3xl
p-6
bg-red-500/10
border
border-red-400/30
shadow-lg
"
>

<p className="text-red-300 font-bold">
💸 Pengeluaran
</p>


<h2
className="
text-2xl
font-black
text-white
mt-3
"
>
Rp {data.totalPengeluaran.toLocaleString("id-ID")}
</h2>

</div>




{/* SHU */}

<div
className="
rounded-3xl
p-6
bg-green-500/10
border
border-green-400/40
shadow-lg
"
>

<p
className="
text-green-300
font-bold
"
>
🚀 SHU Koperasi
</p>


<h2
className="
text-2xl
font-black
text-green-400
mt-3
"
>
Rp {data.shuKoperasi.toLocaleString("id-ID")}
</h2>


</div>


{/* GRAFIK LABA */}

<div
className="
mt-10
w-[92%]
lg:w-[96%]
mx-auto
rounded-3xl
p-8
bg-white/5
border
border-white/10
shadow-xl
"
>

<h2
className="
text-2xl
font-black
text-white
mb-6
"
>
📊 Grafik Keuangan Koperasi
</h2>


<div
className="
w-full
h-[400px]
"
>

<ResponsiveContainer
width="100%"
height="100%"
>

<BarChart
data={grafik}
margin={{
top:20,
right:30,
left:20,
bottom:20
}}
>

<CartesianGrid
strokeDasharray="3 3"
stroke="#444"
/>


<XAxis
dataKey="nama"
stroke="#ffffff"
/>


<YAxis
stroke="#ffffff"
/>


<Tooltip
formatter={(value:any)=>
"Rp "+
Number(value)
.toLocaleString("id-ID")
}
/>


<Legend />


<Bar
dataKey="nilai"
fill="#22c55e"
barSize={70}
radius={[12,12,0,0]}
/>


</BarChart>


</ResponsiveContainer>


</div>


</div>


</div>
</div>

</Layout>
);

}
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { getStrukturOrganisasi } from "../services/struktur_organisasi";


export default function ProfilKoperasi(){

const [struktur,setStruktur]=useState<any[]>([]);


useEffect(()=>{

loadData();

},[]);



async function loadData(){

try{

const tahun = new Date().getFullYear();


const data =
await getStrukturOrganisasi(tahun);

console.log(
  "DATA STRUKTUR KOPERASI:",
  data
);
setStruktur(data || []);


}catch(error){

console.error(
"ERROR STRUKTUR:",
error
);

}

}



const pengurus =
struktur.filter(
(item)=>
String(item.kategori)
.trim()
.toLowerCase()
===
"pengurus"
);


const pengawas =
struktur.filter(
(item)=>
String(item.kategori)
.trim()
.toLowerCase()
===
"pengawas"
);



return (

<Layout>


<div className="
p-6
text-white
">


<h1 className="
text-3xl
font-bold
mb-6
">

Profil Koperasi

</h1>



<div className="
grid
md:grid-cols-2
gap-6
">



<div className="
bg-black/30
rounded-xl
p-5
border
border-white/20
">

<h2 className="
text-xl
font-bold
mb-4
">

Pengurus Koperasi

</h2>


{
pengurus.map(
(item)=>(

<div
key={item.id}
className="
mb-3
"
>

<b>
{item.jabatan}
</b>

<p>
{item.warga?.nama}
</p>

</div>

)

)
}


</div>




<div className="
bg-black/30
rounded-xl
p-5
border
border-white/20
">


<h2 className="
text-xl
font-bold
mb-4
">

Pengawas

</h2>


{
pengawas.map(
(item)=>(

<div
key={item.id}
className="
mb-3
"
>

<b>
{item.jabatan}
</b>

<p>
{item.warga?.nama}
</p>

</div>

)

)
}


</div>



</div>


</div>


</Layout>

);

}
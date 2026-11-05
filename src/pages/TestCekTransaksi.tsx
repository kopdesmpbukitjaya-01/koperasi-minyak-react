import { useEffect } from "react";
import { cekTransaksiAnggota } from "../services/transaksi";

export default function TestCekTransaksi(){

useEffect(()=>{

async function test(){

const hasil =
await cekTransaksiAnggota(
  "KDMP0200"
);


console.log(
  "HASIL TRANSAKSI ANGGOTA:",
  hasil
);

}


test();


},[]);


return (

<div className="p-10">
<h1>
Test Cek Transaksi
</h1>

<p>
Lihat Console Browser
</p>

</div>

)

}
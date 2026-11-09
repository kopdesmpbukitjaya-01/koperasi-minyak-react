import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { getLabaKoperasi } from "../services/laba_koperasi";

export default function LabaKoperasi() {

  const [data,setData]=useState<any>(null);

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

      <div className="p-6 space-y-4">

        <h1 className="text-2xl font-bold">
          Laba Koperasi
        </h1>

        <div>Total Penjualan : Rp {data.totalPenjualan.toLocaleString("id-ID")}</div>

        <div>Modal Berputar : Rp {data.totalModalBerputar.toLocaleString("id-ID")}</div>

        <div>Laba Kotor : Rp {data.labaKotor.toLocaleString("id-ID")}</div>

        <div>Pengeluaran : Rp {data.totalPengeluaran.toLocaleString("id-ID")}</div>

        <div className="text-xl font-bold text-green-600">
          SHU Koperasi : Rp {data.shuKoperasi.toLocaleString("id-ID")}
        </div>

      </div>

    </Layout>

  );

}
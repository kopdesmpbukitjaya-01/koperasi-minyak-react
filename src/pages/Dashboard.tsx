import { useEffect, useState } from "react";
import Layout from "../components/Layout";

import { getPeriode } from "../services/periode";

import logo from "../assets/logo.png";
import banner from "../assets/banner.png";
import background from "../assets/background.png";


export default function Dashboard() {


  const [periodeAktif, setPeriodeAktif] = useState<any>(null);



  useEffect(() => {

    loadDashboard();

  }, []);



  async function loadDashboard() {

    try {

      const data = await getPeriode();


      const aktif = data.find(
        (p:any) => p.aktif === true
      );


      setPeriodeAktif(aktif);


    } catch(err:any) {

      console.log(err.message);

    }

  }





  return (

    <Layout>


      <div

        className="min-h-screen bg-cover bg-center"

        style={{

          backgroundImage:`url(${background})`

        }}

      >


        <div className="bg-white/80 backdrop-blur-sm min-h-screen p-8">





          <div className="rounded-3xl overflow-hidden shadow-2xl mb-8">


            <img

              src={banner}

              alt="Banner"

              className="w-full rounded-3xl"

            />


          </div>






          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-10">


            <div className="flex items-center gap-6">


              <img

                src={logo}

                alt="Logo"

                className="w-32 h-32 object-contain bg-white rounded-full shadow-xl p-3"

              />



              <div>


                <h1 className="text-5xl font-extrabold text-red-700">
                  PERTASHOP
                </h1>


                <h2 className="text-3xl font-bold text-gray-800 mt-2">
                  KOPERASI DESA MERAH PUTIH
                </h2>


                <h3 className="text-2xl font-semibold text-gray-700">
                  BUKIT JAYA
                </h3>


                <p className="text-gray-600 mt-3 text-lg">
                  Kecamatan Bulik Timur
                </p>


              </div>


            </div>





            <div className="bg-red-700 text-white rounded-2xl shadow-xl px-8 py-6">


              <h2 className="text-xl font-bold">
                Dashboard
              </h2>


              <p className="mt-2">
                Sistem Informasi Pertashop
              </p>


            </div>



          </div>









          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">





            {/* Warga */}

            <div className="bg-white rounded-3xl shadow-xl p-7">


              <p className="text-gray-500 uppercase text-sm">
                Data Warga
              </p>


              <h2 className="text-5xl font-bold text-red-600 mt-3">
                0
              </h2>


              <div className="text-5xl mt-4">
                👥
              </div>


            </div>






            {/* Periode Aktif */}

            <div className="bg-white rounded-3xl shadow-xl p-7">


              <p className="text-gray-500 uppercase text-sm">
                Periode Aktif
              </p>



              <h2 className="text-3xl font-bold text-blue-600 mt-3">

                {periodeAktif?.nama_periode || "-"}

              </h2>



              <p className="text-gray-600 mt-3">

                {periodeAktif?.jenis_bbm?.nama || "-"}

              </p>



              <div className="text-5xl mt-4">
                📅
              </div>


            </div>








            {/* Kuota */}

            <div className="bg-white rounded-3xl shadow-xl p-7">


              <p className="text-gray-500 uppercase text-sm">
                Kuota Liter
              </p>



              <h2 className="text-5xl font-bold text-orange-600 mt-3">

                {periodeAktif?.kuota_liter || 0}

              </h2>



              <p className="text-gray-600">
                Liter
              </p>



              <div className="text-5xl mt-4">
                🛢️
              </div>


            </div>








            {/* Laporan */}

            <div className="bg-white rounded-3xl shadow-xl p-7">


              <p className="text-gray-500 uppercase text-sm">
                Laporan
              </p>



              <h2 className="text-5xl font-bold text-green-600 mt-3">
                PDF
              </h2>



              <div className="text-5xl mt-4">
                📄
              </div>


            </div>



          </div>









          <div className="mt-12 bg-white rounded-3xl shadow-xl p-8">


            <h2 className="text-3xl font-bold text-red-700 mb-8">
              Ringkasan Sistem
            </h2>





            <table className="w-full">


              <tbody>



                <tr className="border-b">

                  <td className="py-4 font-semibold">
                    Periode Aktif
                  </td>


                  <td>

                    {periodeAktif?.nama_periode || "-"}

                  </td>


                </tr>





                <tr className="border-b">

                  <td className="py-4 font-semibold">
                    Jenis BBM
                  </td>


                  <td>

                    {periodeAktif?.jenis_bbm?.nama || "-"}

                  </td>


                </tr>





                <tr>

                  <td className="py-4 font-semibold">
                    Kuota
                  </td>


                  <td>

                    {periodeAktif?.kuota_liter || 0} Liter

                  </td>


                </tr>



              </tbody>


            </table>



          </div>









          <div className="mt-10 text-center">


            <h2 className="text-xl font-bold text-red-700">

              PERTASHOP KOPERASI DESA MERAH PUTIH

            </h2>


            <p className="text-gray-600 mt-2">

              Bukit Jaya • Kecamatan Bulik Timur

            </p>


            <p className="text-gray-400 text-sm mt-4">

              © 2026 Sistem Informasi Pertashop KDMP Bukit Jaya

            </p>


          </div>





        </div>


      </div>


    </Layout>

  );

}
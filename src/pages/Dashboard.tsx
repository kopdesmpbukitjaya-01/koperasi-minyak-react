import Layout from "../components/Layout";

import logo from "../assets/logo.png";
import banner from "../assets/banner.png";
import background from "../assets/background.png";

export default function Dashboard() {
  return (
    <Layout>
      <div
        className="min-h-screen bg-cover bg-center"
        style={{
          backgroundImage: `url(${background})`,
        }}
      >
        {/* Overlay */}
        <div className="bg-white/80 backdrop-blur-sm min-h-screen p-8">

          {/* Banner */}
          <div className="rounded-3xl overflow-hidden shadow-2xl mb-8">

           <img
  src={banner}
  alt="Banner"
  className="w-full h-auto rounded-3xl shadow-2xl"
/>

          </div>

          {/* Header */}
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

              <p className="mt-2 opacity-90">
                Sistem Informasi Pertashop
              </p>

            </div>

          </div>

          {/* Statistik */}

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">

            {/* Card 1 */}

            <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition duration-300 p-7">

              <div className="flex justify-between items-center">

                <div>

                  <p className="text-gray-500 uppercase text-sm">
                    Data Warga
                  </p>

                  <h2 className="text-5xl font-bold text-red-600 mt-3">
                    0
                  </h2>

                </div>

                <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center text-5xl">
                  👥
                </div>

              </div>

            </div>

            {/* Card 2 */}

            <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition duration-300 p-7">

              <div className="flex justify-between items-center">

                <div>

                  <p className="text-gray-500 uppercase text-sm">
                    Periode Aktif
                  </p>

                  <h2 className="text-5xl font-bold text-blue-600 mt-3">
                    0
                  </h2>

                </div>

                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-5xl">
                  📅
                </div>

              </div>

            </div>

            {/* Card 3 */}

            <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition duration-300 p-7">

              <div className="flex justify-between items-center">

                <div>

                  <p className="text-gray-500 uppercase text-sm">
                    Total Liter
                  </p>

                  <h2 className="text-5xl font-bold text-orange-600 mt-3">
                    0
                  </h2>

                </div>

                <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center text-5xl">
                  🛢️
                </div>

              </div>

            </div>

            {/* Card 4 */}

            <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition duration-300 p-7">

              <div className="flex justify-between items-center">

                <div>

                  <p className="text-gray-500 uppercase text-sm">
                    Laporan
                  </p>

                  <h2 className="text-5xl font-bold text-green-600 mt-3">
                    PDF
                  </h2>

                </div>

                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">

                  <img
                    src={logo}
                    alt="Logo"
                    className="w-12 h-12"
                  />

                </div>

              </div>

            </div>

          </div>

          {/* Ringkasan Sistem */}

          <div className="mt-12 bg-white rounded-3xl shadow-xl p-8">

            <div className="flex justify-between items-center mb-8">

              <h2 className="text-3xl font-bold text-red-700">
                Ringkasan Sistem
              </h2>

              <span className="bg-green-100 text-green-700 px-5 py-2 rounded-full font-semibold">
                Aktif
              </span>

            </div>

            <table className="w-full">
              <thead>
  <tr className="border-b-2">
    <th className="text-left py-4 text-gray-600">
      Menu
    </th>

    <th className="text-left py-4 text-gray-600">
      Status
    </th>
  </tr>
</thead>

<tbody>

  <tr className="border-b">
    <td className="py-4">Data Warga</td>
    <td className="text-green-600 font-semibold">
      ✔ Aktif
    </td>
  </tr>

  <tr className="border-b">
    <td className="py-4">Periode</td>
    <td className="text-green-600 font-semibold">
      ✔ Aktif
    </td>
  </tr>

  <tr className="border-b">
    <td className="py-4">Pengambilan</td>
    <td className="text-green-600 font-semibold">
      ✔ Aktif
    </td>
  </tr>

  <tr>
    <td className="py-4">Laporan PDF</td>
    <td className="text-green-600 font-semibold">
      ✔ Aktif
    </td>
  </tr>

</tbody>

            </table>

          </div>

          {/* Footer */}

          <div className="mt-10 text-center">

            <h2 className="text-xl font-bold text-red-700">
              PERTASHOP KOPERASI DESA MERAH PUTIH
            </h2>

            <p className="text-gray-600 mt-2">
              Bukit Jaya • Kecamatan Bulik Timur
            </p>

            <p className="text-gray-400 text-sm mt-4">
              © 2025 Sistem Informasi Pertashop KDMP Bukit Jaya
            </p>

          </div>

        </div>

      </div>

    </Layout>
  );
}
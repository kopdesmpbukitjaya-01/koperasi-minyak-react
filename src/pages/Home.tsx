import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import logo from "../assets/logo_crop.png";

export default function Home() {
  const [totalKK, setTotalKK] = useState(0);
  const [sudahAmbil, setSudahAmbil] = useState(0);
  const [totalLiter, setTotalLiter] = useState(0);

  useEffect(() => {
    loadData();
  }, []);


async function loadData() {
  // =========================
  // 1. AMBIL PERIODE AKTIF
  // =========================
  const { data: periodeAktif, error: periodeError } = await supabase
    .from("periode")
    .select("id, nama_periode, kuota_liter, jenis_bbm_id")
    .eq("aktif", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (periodeError) {
    console.error("Gagal mengambil periode aktif:", periodeError);
    return;
  }

  if (!periodeAktif) {
    console.warn("Tidak ada periode aktif.");

    setTotalKK(0);
    setSudahAmbil(0);
    setTotalLiter(0);

    return;
  }

  const periodeId = periodeAktif.id;

  console.log("Periode aktif:", periodeAktif);

  // =========================
  // 2. TOTAL PELANGGAN
  // =========================
  const { count: kk, error: kkError } = await supabase
    .from("warga")
    .select("*", {
      count: "exact",
      head: true,
    });

  if (kkError) {
    console.error("Gagal mengambil total pelanggan:", kkError);
    return;
  }

  setTotalKK(kk ?? 0);

  // =========================
  // 3. AMBIL TRANSAKSI PERIODE AKTIF
  // =========================
  const { data: transaksi, error: transaksiError } = await supabase
    .from("transaksi")
    .select("warga_id, liter")
    .eq("periode_id", periodeId);

  if (transaksiError) {
    console.error("Gagal mengambil transaksi:", transaksiError);
    return;
  }

  // =========================
  // 4. HITUNG PELANGGAN UNIK
  // =========================
  const wargaSudahAmbil = new Set(
    transaksi?.map((item) => item.warga_id)
  );

  setSudahAmbil(wargaSudahAmbil.size);

  // =========================
  // 5. HITUNG TOTAL LITER
  // =========================
  const total = transaksi?.reduce(
    (total, item) => total + Number(item.liter || 0),
    0
  ) ?? 0;

  setTotalLiter(total);
}


  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-red-500 to-red-700">
      {/* Header */}
      <div className="bg-red-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-6">
          <div className="flex items-center gap-4">
            <img
              src={logo}
              alt="Logo"
              className="w-16 h-16 object-contain"
            />

            <div>
              <h1 className="text-3xl font-bold">
  PERTASHOP
</h1>

<p className="text-lg font-semibold">
  Koperasi Desa Merah Putih Bukit Jaya
</p>

<p className="text-sm text-red-100">
  Kecamatan Bulik Timur
</p>
            </div>
          </div>

          <a
            href="/login"
            className="bg-white text-red-700 px-5 py-3 rounded-xl font-semibold hover:bg-gray-100"
          >
            Login Admin
          </a>
        </div>
      </div>

      {/* Isi Dashboard */}
      <div className="max-w-7xl mx-auto py-10 px-6">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold mb-8">
            Dashboard Distribusi Minyak
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-red-50 rounded-2xl p-6">
              <p className="text-gray-600">Total KK</p>
              <h2 className="text-5xl font-bold text-red-600">
                {totalKK}
              </h2>
            </div>

            <div className="bg-green-50 rounded-2xl p-6">
              <p className="text-gray-600">Sudah Mengambil</p>
              <h2 className="text-5xl font-bold text-green-600">
                {sudahAmbil}
              </h2>
            </div>

            <div className="bg-yellow-50 rounded-2xl p-6">
              <p className="text-gray-600">Belum Mengambil</p>
              <h2 className="text-5xl font-bold text-yellow-500">
                {totalKK - sudahAmbil}
              </h2>
            </div>

            <div className="bg-blue-50 rounded-2xl p-6">
              <p className="text-gray-600">Total Liter</p>
              <h2 className="text-5xl font-bold text-blue-600">
                {totalLiter} L
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
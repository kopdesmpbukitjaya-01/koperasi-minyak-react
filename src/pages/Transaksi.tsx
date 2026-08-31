import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Html5Qrcode } from "html5-qrcode";
import Layout from "../components/Layout";

import { getWarga } from "../services/warga";
import { getPeriode } from "../services/periode";
import { getJenisBBM } from "../services/jenis_bbm";
import {
  getTransaksi,
  addTransaksi,
  updateTransaksi,
  deleteTransaksi,
  cekTransaksiWarga,
} from "../services/transaksi";

export default function Transaksi() {
  const navigate = useNavigate();

  const [list, setList] = useState<any[]>([]);
const [jenisBBM, setJenisBBM] = useState<any[]>([]);
const [jenisBBMId, setJenisBBMId] = useState("");
const [warga, setWarga] = useState<any[]>([]);
const [periode, setPeriode] = useState<any[]>([]);
const [filterPeriodeId, setFilterPeriodeId] = useState("");
const [filterNama, setFilterNama] = useState("");
const [saving, setSaving] = useState(false);
  const [wargaId, setWargaId] = useState("");
  const [periodeId, setPeriodeId] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [liter, setLiter] = useState("");
const [scannerOpen, setScannerOpen] = useState(false);
const [scanResult, setScanResult] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    loadData();
    setTanggal(new Date().toISOString().substring(0, 10));
  }, []);
useEffect(() => {
  if (!scannerOpen) return;

  const scanner = new Html5Qrcode("reader");

  scanner.start(
    { facingMode: "environment" },
    {
      fps: 10,
      qrbox: { width: 250, height: 250 },
    },
    (decodedText) => {
      console.log("QR TERBACA:", decodedText);
      setScanResult(decodedText);
    },
  () => {
  // Abaikan error pembacaan selama kamera aktif
}
  ).catch((err) => {
    console.error("Gagal membuka kamera:", err);
  });

  return () => {
    scanner
      .stop()
      .then(() => {
        scanner.clear();
      })
      .catch(() => {});
  };
}, [scannerOpen]);
  async function loadData() {
  setList(await getTransaksi());
  setWarga(await getWarga());

  const dataPeriode = await getPeriode();

  setPeriode(dataPeriode);

  // Cari periode yang aktif
  const periodeAktif = dataPeriode.find(
    (p: any) =>
      p.status === "Aktif" ||
      p.aktif === true
  );

  if (periodeAktif) {
    setFilterPeriodeId(
      periodeAktif.id.toString()
    );
  }

  const bbm = await getJenisBBM();

  console.log("BBM =", bbm);

  setJenisBBM(bbm);
}

  async function simpan() {
  if (saving) return;

  setSaving(true);

  try {
    // =====================================================
    // VALIDASI
    // =====================================================

    if (!wargaId) {
      alert("⚠️ Silakan pilih warga.");
      return;
    }

    if (!jenisBBMId) {
      alert("⚠️ Silakan pilih jenis BBM.");
      return;
    }

    if (!periodeId) {
      alert("⚠️ Silakan pilih periode.");
      return;
    }

    if (!tanggal) {
      alert("⚠️ Silakan pilih tanggal pengambilan.");
      return;
    }

    if (!liter || Number(liter) <= 0) {
      alert("⚠️ Jumlah liter harus lebih dari 0.");
      return;
    }

    // =====================================================
    // TAMBAH TRANSAKSI BARU
    // =====================================================

    if (editId === null) {
      await addTransaksi(
        Number(wargaId),
        Number(periodeId),
        Number(jenisBBMId),
        tanggal,
        Number(liter)
      );

      alert("✅ Transaksi berhasil disimpan.");
    }

    // =====================================================
    // UPDATE TRANSAKSI
    // =====================================================

    else {
      const transaksiLama = list.find(
        (t) => t.id === editId
      );

      if (!transaksiLama) {
        alert("❌ Data transaksi tidak ditemukan.");
        return;
      }

      const wargaBerubah =
        Number(transaksiLama.warga_id) !==
        Number(wargaId);

      const periodeBerubah =
        Number(transaksiLama.periode_id) !==
        Number(periodeId);

      // Hanya cek duplikat jika warga
      // atau periode memang berubah
      if (wargaBerubah || periodeBerubah) {
        const sudahAda =
          await cekTransaksiWarga(
            Number(wargaId),
            Number(periodeId)
          );

        if (sudahAda) {
          alert(
            "⚠️ Warga ini sudah melakukan pengambilan BBM pada periode tersebut."
          );

          return;
        }
      }

      await updateTransaksi(
        editId,
        Number(wargaId),
        Number(periodeId),
        Number(jenisBBMId),
        tanggal,
        Number(liter)
      );

      alert("✅ Transaksi berhasil diperbarui.");
    }

    // =====================================================
    // RESET FORM
    // =====================================================

    setEditId(null);
    setWargaId("");
    setPeriodeId("");
    setJenisBBMId("");

    setTanggal(
      new Date()
        .toISOString()
        .substring(0, 10)
    );

    setLiter("");

    // =====================================================
    // REFRESH DATA
    // =====================================================

    await loadData();

  } catch (err: any) {
    console.error(
      "Gagal menyimpan transaksi:",
      err
    );

    // PostgreSQL duplicate constraint
    if (err?.code === "23505") {
      alert(
        "⚠️ Warga ini sudah melakukan pengambilan BBM pada periode tersebut."
      );
    } else {
      alert(
        err?.message ||
        "❌ Gagal menyimpan transaksi."
      );
    }

  } finally {
    // Tombol Simpan aktif kembali
    setSaving(false);
  }
}

  function edit(item: any) {
    setEditId(item.id);
    setWargaId(item.warga_id.toString());
    setPeriodeId(item.periode_id.toString());
    setJenisBBMId(item.jenis_bbm_id.toString());
    setTanggal(item.tanggal);
    setLiter(item.liter.toString());
  }

  async function hapus(id: number) {
    if (!confirm("Yakin ingin menghapus transaksi?")) return;

    try {
      await deleteTransaksi(id);
      loadData();
      alert("Transaksi berhasil dihapus");
    } catch (err: any) {
      alert(err.message);
    }
  }

  return (
    <Layout>

      <div className="space-y-8">

        <div className="flex justify-between items-center">

          <div>
            <h1 className="text-4xl font-bold text-red-700">
              🛢️ Pengambilan Minyak
            </h1>

            <p className="text-gray-500 mt-2">
              Kelola transaksi pengambilan minyak Pertashop
            </p>
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-xl shadow-lg"
          >
            ← Dashboard
          </button>

        </div>
        {/* ================================
            FORM PENGAMBILAN MINYAK
        ================================= */}

        <div className="bg-white rounded-3xl shadow-xl p-8">

          <h2 className="text-2xl font-bold text-red-700 mb-6">
            {editId === null
              ? "Tambah Pengambilan"
              : "Edit Pengambilan"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
{/* SCANNER BARCODE */}
<div className="md:col-span-2 lg:col-span-3">
  <button
    type="button"
    onClick={() => {
      setScanResult("");
      setScannerOpen(true);
    }}
    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-lg font-semibold"
  >
    📷 Scan Barcode / QR Warga
  </button>

  {scannerOpen && (
    <div className="mt-4 max-w-md">
      <div
        id="reader"
        className="w-full rounded-xl overflow-hidden border"
      />

      {scanResult && (
        <div className="mt-3 p-3 bg-green-50 border border-green-300 rounded-xl">
          <span className="font-semibold">
            QR Terbaca:
          </span>{" "}
          {scanResult}
        </div>
      )}

      <button
        type="button"
        onClick={() => {
          setScannerOpen(false);
          setScanResult("");
        }}
        className="mt-3 bg-gray-600 hover:bg-gray-700 text-white px-5 py-2 rounded-lg"
      >
        ✖️ Tutup Scanner
      </button>
    </div>
  )}
</div>
            {/* WARGA */}
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Warga
              </label>

              <select
                value={wargaId}
                onChange={(e) =>
                  setWargaId(e.target.value)
                }
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                <option value="">
                  Pilih Warga
                </option>

                {warga.map((w) => (
                  <option
                    key={w.id}
                    value={w.id}
                  >
                    {w.nama}
                    {w.kode_warga
                      ? ` - ${w.kode_warga}`
                      : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* JENIS BBM */}
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Jenis BBM
              </label>

              <select
                value={jenisBBMId}
                onChange={(e) =>
                  setJenisBBMId(e.target.value)
                }
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                <option value="">
                  Pilih Jenis BBM
                </option>

                {jenisBBM.map((bbm) => (
                  <option
                    key={bbm.id}
                    value={bbm.id}
                  >
                    {bbm.nama}
                  </option>
                ))}
              </select>
            </div>

            {/* PERIODE */}
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Periode
              </label>

              <select
                value={periodeId}
                onChange={(e) =>
                  setPeriodeId(e.target.value)
                }
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                <option value="">
                  Pilih Periode
                </option>

                {periode.map((p) => (
                  <option
                    key={p.id}
                    value={p.id}
                  >
                    {p.nama_periode}
                  </option>
                ))}
              </select>
            </div>

            {/* TANGGAL */}
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Tanggal Pengambilan
              </label>

              <input
                type="date"
                value={tanggal}
                onChange={(e) =>
                  setTanggal(e.target.value)
                }
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            {/* LITER */}
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Jumlah Liter
              </label>

              <input
                type="number"
                min="0"
                step="0.1"
                placeholder="Contoh: 5"
                value={liter}
                onChange={(e) =>
                  setLiter(e.target.value)
                }
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

          </div>

          {/* TOMBOL */}
          <div className="flex gap-3 mt-6">

            <button
              type="button"
              onClick={simpan}
              disabled={saving}
              className="bg-red-700 hover:bg-red-800 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl shadow-lg font-semibold transition"
            >
              {saving
                ? "⏳ Menyimpan..."
                : editId === null
                ? "💾 Simpan"
                : "💾 Update"}
            </button>

            {editId !== null && (
              <button
                type="button"
                onClick={() => {
                  setEditId(null);
                  setWargaId("");
                  setJenisBBMId("");
                  setPeriodeId("");
                  setLiter("");
                  setTanggal(
                    new Date()
                      .toISOString()
                      .substring(0, 10)
                  );
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl shadow-lg font-semibold transition"
              >
                ✖️ Batal
              </button>
            )}

          </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

  <h2 className="text-2xl font-bold text-red-700">
    Daftar Pengambilan
  </h2>

  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">

    {/* KOTAK PENCARIAN NAMA */}
    <div className="relative">

      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        🔍
      </span>

      <input
        type="text"
        placeholder="Cari nama anggota..."
        value={filterNama}
        onChange={(e) => setFilterNama(e.target.value)}
        className="w-full sm:w-64 rounded-xl border border-gray-300 bg-gray-50 pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600"
      />

    </div>

    {/* FILTER PERIODE */}
    <div className="flex items-center gap-2">

      <label className="font-semibold text-gray-700 whitespace-nowrap">
        Periode:
      </label>

      <select
        value={filterPeriodeId}
        onChange={(e) =>
          setFilterPeriodeId(e.target.value)
        }
        className="rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600"
      >
        <option value="">
          Semua Periode
        </option>

        {periode.map((p) => (
          <option
            key={p.id}
            value={p.id}
          >
            {p.nama_periode}
          </option>
        ))}
      </select>

    </div>

  </div>

</div>

  <div className="overflow-x-auto">

    <table className="w-full">

      <thead className="bg-red-700 text-white">
        <tr>
          <th className="px-4 py-3 text-left">
            Nama
          </th>

          <th className="px-4 py-3 text-left">
            Jenis BBM
          </th>

          <th className="px-4 py-3 text-left">
            Periode
          </th>

          <th className="px-4 py-3 text-left">
            Tanggal
          </th>

          <th className="px-4 py-3 text-center">
            Liter
          </th>

          <th className="px-4 py-3 text-right">
            Harga/Liter
          </th>

          <th className="px-4 py-3 text-right">
            Total
          </th>

          <th className="px-4 py-3 text-center">
            Aksi
          </th>
        </tr>
      </thead>

      <tbody>

        {list
          .filter((t) => {

            if (
              filterPeriodeId &&
              Number(t.periode_id) !==
                Number(filterPeriodeId)
            ) {
              return false;
            }

            if (
              filterNama &&
              !t.warga?.nama
                ?.toLowerCase()
                .includes(
                  filterNama.toLowerCase()
                )
            ) {
              return false;
            }

            return true;
          })
          .map((t) => (

            <tr
              key={t.id}
              className="border-b hover:bg-red-50 transition"
            >

              <td className="px-4 py-4">
                {t.warga?.nama}
              </td>

              <td className="px-4 py-4">
                {t.jenis_bbm?.nama}
              </td>

              <td className="px-4 py-4">
                {t.periode?.nama_periode}
              </td>

              <td className="px-4 py-4">
                {t.tanggal}
              </td>

              <td className="px-4 py-4 text-center font-semibold text-blue-600">
                {t.liter} L
              </td>

              <td className="px-4 py-4 text-right">
                Rp{" "}
                {Number(t.harga).toLocaleString("id-ID")}
              </td>

              <td className="px-4 py-4 text-right font-bold text-green-700">
                Rp{" "}
                {Number(t.total).toLocaleString("id-ID")}
              </td>

              <td className="px-4 py-4">

                <div className="flex justify-center gap-2">

                  <button
                    onClick={() => edit(t)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition"
                  >
                    ✏️ Edit
                  </button>

                  <button
                    onClick={() => hapus(t.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow transition"
                  >
                    🗑️ Hapus
                  </button>

                </div>

              </td>

            </tr>

          ))}

        {list.filter((t) => {

          if (
            filterPeriodeId &&
            Number(t.periode_id) !==
              Number(filterPeriodeId)
          ) {
            return false;
          }

          if (
            filterNama &&
            !t.warga?.nama
              ?.toLowerCase()
              .includes(
                filterNama.toLowerCase()
              )
          ) {
            return false;
          }

          return true;

        }).length === 0 && (

          <tr>
            <td
              colSpan={8}
              className="py-10 text-center text-gray-500"
            >
              Belum ada data pengambilan.
            </td>
          </tr>

        )}

      </tbody>

    </table>

    </div>

</div>

      </div>

    </Layout>
  );
}
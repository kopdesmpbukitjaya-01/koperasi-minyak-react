import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

import { getWarga } from "../services/warga";
import { getPeriode } from "../services/periode";
import { getJenisBBM } from "../services/jenis_bbm";
import {
  getTransaksi,
  addTransaksi,
  updateTransaksi,
  deleteTransaksi,
} from "../services/transaksi";

export default function Transaksi() {
  const navigate = useNavigate();

  const [list, setList] = useState<any[]>([]);
  const [warga, setWarga] = useState<any[]>([]);
  const [periode, setPeriode] = useState<any[]>([]);
const [jenisBBM, setJenisBBM] = useState<any[]>([]);
const [jenisBBMId, setJenisBBMId] = useState("");
  const [wargaId, setWargaId] = useState("");
  const [periodeId, setPeriodeId] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [liter, setLiter] = useState("");

  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    loadData();
    setTanggal(new Date().toISOString().substring(0, 10));
  }, []);

  async function loadData() {
  const transaksi = await getTransaksi();
  const warga = await getWarga();
  const periode = await getPeriode();
  const bbm = await getJenisBBM();

  console.log("BBM:", bbm);

  setList(transaksi);
  setWarga(warga);
  setPeriode(periode);
  setJenisBBM(bbm);

}

  async function simpan() {
    try {
      if (editId === null) {
        await addTransaksi(
  Number(wargaId),
  Number(periodeId),
  Number(jenisBBMId),
  tanggal,
  Number(liter)
);

        alert("Transaksi berhasil ditambahkan");
      } else {
        await updateTransaksi(
  editId,
  Number(wargaId),
  Number(periodeId),
  Number(jenisBBMId),
  tanggal,
  Number(liter)
);
        alert("Transaksi berhasil diupdate");
      }

      setEditId(null);
      setWargaId("");
      setPeriodeId("");
      setJenisBBMId("");
      setTanggal(new Date().toISOString().substring(0, 10));
      setLiter("");

      loadData();
    } catch (err: any) {
      alert(err.message);
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

        <div className="bg-white rounded-3xl shadow-xl p-8">

          <h2 className="text-2xl font-bold text-red-700 mb-8">
            {editId === null
              ? "Tambah Pengambilan"
              : "Edit Pengambilan"}
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

<div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Pilih Warga
              </label>

              <select
                value={wargaId}
                onChange={(e) => setWargaId(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                <option value="">-- Pilih Warga --</option>

                {warga.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.nama}
                  </option>
                ))}
              </select>
            </div>
<div>
  <label className="block text-sm font-semibold text-gray-700 mb-2">
    Jenis BBM
  </label>

  <select
    value={jenisBBMId}
    onChange={(e) => setJenisBBMId(e.target.value)}
    className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3"
  >
    <option value="">-- Pilih BBM --</option>

    {jenisBBM.map((j) => (
      <option key={j.id} value={j.id}>
        {j.nama} - Rp {Number(j.harga).toLocaleString("id-ID")}
      </option>
    ))}
  </select>
</div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Periode
              </label>

              <select
                value={periodeId}
                onChange={(e) => setPeriodeId(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                <option value="">-- Pilih Periode --</option>

                {periode.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nama_periode}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tanggal Pengambilan
              </label>

              <input
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Jumlah Liter
              </label>

              <input
                type="number"
                placeholder="Contoh: 20"
                value={liter}
                onChange={(e) => setLiter(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

          </div>

          <div className="flex gap-4 mt-8">

            <button
              onClick={simpan}
              className="bg-red-700 hover:bg-red-800 text-white px-8 py-3 rounded-xl shadow-lg transition font-semibold"
            >
              {editId === null ? "💾 Simpan" : "✏️ Update"}
            </button>

            {editId !== null && (
              <button
                onClick={() => {
                  setEditId(null);
                  setWargaId("");
                  setPeriodeId("");
                  setTanggal(new Date().toISOString().substring(0, 10));
                  setLiter("");
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-xl shadow-lg transition"
              >
                Batal
              </button>
            )}

          </div>

        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8">

          <h2 className="text-2xl font-bold text-red-700 mb-6">
            Daftar Pengambilan
          </h2>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-red-700 text-white">
  <tr>
    <th className="px-4 py-3 text-left">Nama</th>

    <th className="px-4 py-3 text-left">
      Jenis BBM
    </th>

    <th className="px-4 py-3 text-left">Periode</th>
    <th className="px-4 py-3 text-left">Tanggal</th>
    <th className="px-4 py-3 text-center">Liter</th>
    <th className="px-4 py-3 text-right">Harga/Liter</th>
    <th className="px-4 py-3 text-right">Total</th>
    <th className="px-4 py-3 text-center">Aksi</th>
  </tr>
</thead>

              <tbody>
                              {list.map((t) => (
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
                    Rp {Number(t.harga).toLocaleString("id-ID")}
                  </td>

                  <td className="px-4 py-4 text-right font-bold text-green-700">
                    Rp {Number(t.total).toLocaleString("id-ID")}
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

              {list.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
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
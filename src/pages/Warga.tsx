import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import {
  getWarga,
  addWarga,
  updateWarga,
  deleteWarga,
} from "../services/warga";

export default function Warga() {
  const navigate = useNavigate();

  const [list, setList] = useState<any[]>([]);

  const [nik, setNik] = useState("");
  const [nama, setNama] = useState("");
  const [alamat, setAlamat] = useState("");
  const [noHp, setNoHp] = useState("");

  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const data = await getWarga();
    setList(data);
  }

  function edit(w: any) {
    setEditId(w.id);
    setNik(w.nik);
    setNama(w.nama);
    setAlamat(w.alamat);
    setNoHp(w.no_hp);
  }

  async function hapus(id: number) {
    if (!confirm("Yakin ingin menghapus data ini?")) return;

    try {
      await deleteWarga(id);
      loadData();
      alert("Data berhasil dihapus");
    } catch (err: any) {
      alert(err.message);
    }
  }

  async function simpan() {
    try {
      if (editId === null) {
        await addWarga(nik, nama, alamat, noHp);
        alert("Data berhasil ditambahkan");
      } else {
        await updateWarga(editId, nik, nama, alamat, noHp);
        alert("Data berhasil diupdate");
        setEditId(null);
      }

      setNik("");
      setNama("");
      setAlamat("");
      setNoHp("");

      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  }

  return (
    <Layout>
      <div className="space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">

          <div>
            <h1 className="text-4xl font-bold text-red-700">
              👥 Data Warga
            </h1>

            <p className="text-gray-500 mt-2">
              Kelola data warga Pertashop KDMP Bukit Jaya
            </p>
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-xl shadow-lg transition"
          >
            ← Dashboard
          </button>

        </div>

        {/* Form */}
        <div className="bg-white rounded-3xl shadow-xl p-8">

          <h2 className="text-2xl font-bold text-red-700 mb-8">
            {editId === null ? "Tambah Warga" : "Edit Warga"}
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                NIK
              </label>

              <input
                type="text"
                placeholder="Masukkan NIK"
                value={nik}
                onChange={(e) => setNik(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nama Lengkap
              </label>

              <input
                type="text"
                placeholder="Masukkan Nama"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Alamat
              </label>

              <input
                type="text"
                placeholder="Masukkan Alamat"
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nomor HP
              </label>

              <input
                type="text"
                placeholder="08xxxxxxxxxx"
                value={noHp}
                onChange={(e) => setNoHp(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600"
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
                  setNik("");
                  setNama("");
                  setAlamat("");
                  setNoHp("");
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-xl shadow-lg transition font-semibold"
              >
                Batal
              </button>
            )}

          </div>

        </div>

        {/* Tabel */}
        <div className="bg-white rounded-3xl shadow-xl p-8">

          <h2 className="text-2xl font-bold text-red-700 mb-6">
            Daftar Warga
          </h2>

          <div className="overflow-x-auto">

            <table className="w-full">
              <thead className="bg-red-700 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">NIK</th>
                  <th className="px-4 py-3 text-left">Nama</th>
                  <th className="px-4 py-3 text-left">Alamat</th>
                  <th className="px-4 py-3 text-left">No HP</th>
                  <th className="px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>

              <tbody>
                                {list.map((w) => (
                  <tr
                    key={w.id}
                    className="border-b hover:bg-red-50 transition"
                  >
                    <td className="px-4 py-4">{w.nik}</td>

                    <td className="px-4 py-4 font-semibold">
                      {w.nama}
                    </td>

                    <td className="px-4 py-4">
                      {w.alamat}
                    </td>

                    <td className="px-4 py-4">
                      {w.no_hp}
                    </td>

                    <td className="px-4 py-4">

                      <div className="flex justify-center gap-3">

                        <button
                          onClick={() => edit(w)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition"
                        >
                          ✏️ Edit
                        </button>

                        <button
                          onClick={() => hapus(w.id)}
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
                      colSpan={5}
                      className="text-center py-10 text-gray-500"
                    >
                      Belum ada data warga.
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
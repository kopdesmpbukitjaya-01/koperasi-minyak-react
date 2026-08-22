import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

import {
  getPeriode,
  addPeriode,
  updatePeriode,
  deletePeriode,
} from "../services/periode";

export default function Periode() {
  const navigate = useNavigate();

  const [list, setList] = useState<any[]>([]);

  const [namaPeriode, setNamaPeriode] = useState("");
  const [kuotaLiter, setKuotaLiter] = useState(0);
  const [aktif, setAktif] = useState(false);

  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const data = await getPeriode();
      setList(data);
    } catch (err: any) {
      alert(err.message);
    }
  }

  async function simpan() {
    try {
      if (namaPeriode.trim() === "") {
        alert("Nama periode harus diisi");
        return;
      }

      if (editId === null) {
        await addPeriode(
          namaPeriode,
          kuotaLiter,
          aktif
        );

        alert("Periode berhasil ditambahkan");
      } else {
        await updatePeriode(
          editId,
          namaPeriode,
          kuotaLiter,
          aktif
        );

        alert("Periode berhasil diupdate");
      }

      setEditId(null);
      setNamaPeriode("");
      setKuotaLiter(0);
      setAktif(false);

      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  }

  function edit(p: any) {
    setEditId(p.id);
    setNamaPeriode(p.nama_periode);
    setKuotaLiter(p.kuota_liter);
    setAktif(p.aktif);
  }

  async function hapus(id: number) {
    if (!confirm("Yakin ingin menghapus periode ini?")) return;

    try {
      await deletePeriode(id);

      loadData();

      alert("Periode berhasil dihapus");
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
              📅 Data Periode
            </h1>

            <p className="text-gray-500 mt-2">
              Kelola periode distribusi minyak Pertashop
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
              ? "Tambah Periode"
              : "Edit Periode"}
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

<div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nama Periode
              </label>

              <input
                type="text"
                placeholder="Contoh: Januari 2025"
                value={namaPeriode}
                onChange={(e) => setNamaPeriode(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Kuota Liter
              </label>

              <input
                type="number"
                placeholder="Contoh: 2000"
                value={kuotaLiter}
                onChange={(e) =>
                  setKuotaLiter(Number(e.target.value))
                }
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-3 bg-gray-50 border border-gray-300 rounded-xl px-4 py-4 cursor-pointer hover:bg-gray-100 transition">

                <input
                  type="checkbox"
                  checked={aktif}
                  onChange={(e) => setAktif(e.target.checked)}
                  className="w-5 h-5 accent-red-600"
                />

                <span className="font-semibold text-gray-700">
                  Jadikan sebagai Periode Aktif
                </span>

              </label>
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
                  setNamaPeriode("");
                  setKuotaLiter(0);
                  setAktif(false);
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
            Daftar Periode
          </h2>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-red-700 text-white">

                <tr>
                  <th className="px-4 py-3 text-left">
                    Nama Periode
                  </th>

                  <th className="px-4 py-3 text-center">
                    Kuota Liter
                  </th>

                  <th className="px-4 py-3 text-center">
                    Status
                  </th>

                  <th className="px-4 py-3 text-center">
                    Aksi
                  </th>
                </tr>

              </thead>

              <tbody>
                              {list.map((p) => (
                <tr
                  key={p.id}
                  className="border-b hover:bg-red-50 transition"
                >
                  <td className="px-4 py-4 font-medium">
                    {p.nama_periode}
                  </td>

                  <td className="px-4 py-4 text-center">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">
                      {p.kuota_liter} Liter
                    </span>
                  </td>

                  <td className="px-4 py-4 text-center">
                    {p.aktif ? (
                      <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full font-semibold">
                        ✔ Aktif
                      </span>
                    ) : (
                      <span className="bg-gray-200 text-gray-600 px-4 py-1 rounded-full font-semibold">
                        Tidak Aktif
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex justify-center gap-2">

                      <button
                        onClick={() => edit(p)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition"
                      >
                        ✏️ Edit
                      </button>

                      <button
                        onClick={() => hapus(p.id)}
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
                    colSpan={4}
                    className="py-10 text-center text-gray-500"
                  >
                    Belum ada data periode.
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
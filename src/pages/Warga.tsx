import { useEffect, useState } from "react";
import IdCard from "../components/IdCard";
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
  const [search, setSearch] = useState("");
  const [nama, setNama] = useState("");
  const [noKK, setNoKK] = useState("");
  const [status, setStatus] = useState("Anggota");
  const [alamat, setAlamat] = useState("");
  const [noHp, setNoHp] = useState("");

  const [editId, setEditId] = useState<number | null>(null);
const [selectedWarga, setSelectedWarga] = useState<any | null>(null);



  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const data = await getWarga();
    setList(data);
  }

  function edit(w: any) {
    setEditId(w.id);

    setNoKK(w.no_kk);
    setNama(w.nama);
    setStatus(w.status);
    setAlamat(w.alamat);
    setNoHp(w.no_hp);
  }

  async function hapus(id: number) {
    if (!confirm("Yakin ingin menghapus data ini?")) return;

    try {
      await deleteWarga(id);
      await loadData();
      alert("Data berhasil dihapus");
    } catch (err: any) {
      alert(err.message);
    }
  }

  async function simpan() {
    try {
      if (editId === null) {
        await addWarga(
          noKK,
          nama,
          status,
          alamat,
          noHp
        );

        alert("Data berhasil ditambahkan");
      } else {
        await updateWarga(
          editId,
          noKK,
          nama,
          status,
          alamat,
          noHp
        );

        alert("Data berhasil diupdate");
        setEditId(null);
      }

      setNoKK("");
      setNama("");
      setStatus("Anggota");
      setAlamat("");
      setNoHp("");

      await loadData();
    } catch (err: any) {
      alert(err.message);
    }
  }

  // =====================================
  // FILTER DAN URUTKAN DATA WARGA
  // =====================================

  const filteredList = [...list]
    .filter((w) =>
      String(w.nama ?? "")
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const statusA = String(a.status ?? "")
        .trim()
        .toLowerCase();

      const statusB = String(b.status ?? "")
        .trim()
        .toLowerCase();

      // Anggota selalu paling atas
      if (
        statusA === "anggota" &&
        statusB !== "anggota"
      ) {
        return -1;
      }

      if (
        statusA !== "anggota" &&
        statusB === "anggota"
      ) {
        return 1;
      }

      // Jika status sama, urutkan berdasarkan nama
      return String(a.nama ?? "").localeCompare(
        String(b.nama ?? ""),
        "id",
        {
          sensitivity: "base",
        }
      );
    });

  return (
    <Layout>
      <div className="space-y-8">

        {/* =====================================
            HEADER
        ====================================== */}

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

        {/* =====================================
            FORM DATA WARGA
        ====================================== */}

        <div className="bg-white rounded-3xl shadow-xl p-8">

          <h2 className="text-2xl font-bold text-red-700 mb-8">
            {editId === null
              ? "Tambah Data Warga"
              : "Edit Warga"}
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            {/* NOMOR KK */}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nomor KK
              </label>

              <input
                type="text"
                placeholder="Masukkan Nomor KK"
                value={noKK}
                onChange={(e) =>
                  setNoKK(e.target.value)
                }
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600"
              />
            </div>

            {/* NAMA */}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nama Lengkap
              </label>

              <input
                type="text"
                placeholder="Masukkan Nama"
                value={nama}
                onChange={(e) =>
                  setNama(e.target.value)
                }
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600"
              />
            </div>

            {/* STATUS */}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Status
              </label>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value)
                }
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                <option value="Anggota">
                  🟢 Anggota
                </option>

                <option value="Non-Anggota">
                  ⚪ Non-Anggota
                </option>
              </select>
            </div>

            {/* ALAMAT */}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Alamat
              </label>

              <input
                type="text"
                placeholder="Masukkan Alamat"
                value={alamat}
                onChange={(e) =>
                  setAlamat(e.target.value)
                }
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600"
              />
            </div>

            {/* NOMOR HP */}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nomor HP
              </label>

              <input
                type="text"
                placeholder="08xxxxxxxxxx"
                value={noHp}
                onChange={(e) =>
                  setNoHp(e.target.value)
                }
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600"
              />
            </div>

          </div>

          {/* TOMBOL */}

          <div className="flex gap-4 mt-8">

            <button
              onClick={simpan}
              className="bg-red-700 hover:bg-red-800 text-white px-8 py-3 rounded-xl shadow-lg transition font-semibold"
            >
              {editId === null
                ? "💾 Simpan"
                : "✏️ Update"}
            </button>

            {editId !== null && (
              <button
                onClick={() => {
                  setEditId(null);
                  setNoKK("");
                  setNama("");
                  setStatus("Anggota");
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

        {/* =====================================
            TABEL WARGA
        ====================================== */}

        <div className="bg-white rounded-3xl shadow-xl p-8">

          <h2 className="text-2xl font-bold text-red-700 mb-6">
            Daftar Warga
          </h2>

          {/* PENCARIAN */}

          <div className="mb-6">

            <input
              type="text"
              placeholder="🔍 Cari nama warga..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full md:w-96 rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600"
            />

          </div>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-red-700 text-white">

                <tr>

                  <th className="px-4 py-3 text-left">
                    Kode Warga
                  </th>

                  <th className="px-4 py-3 text-left">
                    Nomor KK
                  </th>

                  <th className="px-4 py-3 text-left">
                    Nama
                  </th>

                  <th className="px-4 py-3 text-center">
                    Status
                  </th>

                  <th className="px-4 py-3 text-left">
                    Alamat
                  </th>

                  <th className="px-4 py-3 text-left">
                    No HP
                  </th>

                  <th className="px-4 py-3 text-center">
                    Aksi
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredList.map((w) => (

                  <tr
                    key={w.id}
                    className="border-b hover:bg-red-50 transition"
                  >

                    {/* KODE WARGA */}

                    <td className="px-4 py-4">

                      <span className="font-bold text-red-700">
                        {w.kode_warga}
                      </span>

                    </td>

                    {/* NOMOR KK */}

                    <td className="px-4 py-4">
                      {w.no_kk}
                    </td>

                    {/* NAMA */}

                    <td className="px-4 py-4 font-semibold">
                      {w.nama}
                    </td>

                    {/* STATUS */}

                    <td className="px-4 py-4 text-center">

                      <span
                        className={
                          String(w.status ?? "")
                            .trim()
                            .toLowerCase() === "anggota"
                            ? "bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold"
                            : "bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-semibold"
                        }
                      >
                        {w.status}
                      </span>

                    </td>

                    {/* ALAMAT */}

                    <td className="px-4 py-4">
                      {w.alamat}
                    </td>

                    {/* NO HP */}

                    <td className="px-4 py-4">
                      {w.no_hp}
                    </td>

                    {/* AKSI */}

                    <td className="px-4 py-4">

                      <div className="flex justify-center gap-3">

                        {/* EDIT */}

                        <button
                          onClick={() => edit(w)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition"
                        >
                          ✏️ Edit
                        </button>

                        {/* ID CARD */}

                       

<button
  type="button"
  onClick={() => setSelectedWarga(w)}
  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow transition"
>
  🪪 ID Card
</button>



                        {/* HAPUS */}

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

              </tbody>

            </table>

          </div>

        </div>

      </div>
      

{selectedWarga && (
  <IdCard
  nama={selectedWarga.nama}
  noKK={selectedWarga.no_kk}
  kodeWarga={selectedWarga.kode_warga}
  status={selectedWarga.status}
  onClose={() => setSelectedWarga(null)}
/>
)}


    </Layout>
  );
}
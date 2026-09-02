import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { getJenisBBM } from "../services/jenis_bbm";
import { getRekapLiterPeriode } from "../services/transaksi";
import {
  getPeriode,
  addPeriode,
  updatePeriode,
  deletePeriode,
} from "../services/periode";


export default function Periode() {
  const navigate = useNavigate();

  const [list, setList] = useState<any[]>([]);
  const [rekapLiter, setRekapLiter] = useState<Record<number, number>>({});
  const [jenisBBM, setJenisBBM] = useState<any[]>([]);

  const [jenisBBMId, setJenisBBMId] = useState("");

  const [namaPeriode, setNamaPeriode] = useState("");
  const [kuotaLiter, setKuotaLiter] = useState(0);
  const [aktif, setAktif] = useState(false);

  const [editId, setEditId] = useState<number | null>(null);

 useEffect(() => {
  loadData();
  loadJenisBBM();
}, []);

  // =========================
  // LOAD PERIODE
  // =========================
  async function loadData() {
  const [dataPeriode, dataRekap] = await Promise.all([
    getPeriode(),
    getRekapLiterPeriode(),
  ]);

  setList(dataPeriode);
  setRekapLiter(dataRekap);
}

  // =========================
  // LOAD JENIS BBM
  // =========================
  async function loadJenisBBM() {
    try {
      const data = await getJenisBBM();

      setJenisBBM(data);

      // Pilih BBM pertama secara otomatis
      // hanya ketika belum ada pilihan.
      if (data.length > 0 && !jenisBBMId) {
        setJenisBBMId(String(data[0].id));
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    }
  }

  // =========================
  // RESET FORM
  // =========================
  function resetForm() {
    setEditId(null);
    setNamaPeriode("");
    setJenisBBMId("");
    setKuotaLiter(0);
    setAktif(false);
  }

  // =========================
  // SIMPAN / UPDATE
  // =========================
  async function simpan() {
    try {
      if (namaPeriode.trim() === "") {
        alert("Nama periode harus diisi");
        return;
      }

      if (!jenisBBMId) {
        alert("Jenis BBM harus dipilih");
        return;
      }

      if (kuotaLiter <= 0) {
        alert("Kuota liter harus lebih dari 0");
        return;
      }

      if (editId === null) {
        await addPeriode(
          namaPeriode.trim(),
          Number(jenisBBMId),
          kuotaLiter,
          aktif
        );

        alert("Periode berhasil ditambahkan");
      } else {
        await updatePeriode(
          editId,
          namaPeriode.trim(),
          Number(jenisBBMId),
          kuotaLiter,
          aktif
        );

        alert("Periode berhasil diupdate");
      }

      resetForm();
      await loadData();
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    }
  }

  // =========================
  // EDIT
  // =========================
  function edit(p: any) {
    setEditId(p.id);
    setNamaPeriode(p.nama_periode);
    setJenisBBMId(
      p.jenis_bbm_id ? String(p.jenis_bbm_id) : ""
    );
    setKuotaLiter(Number(p.kuota_liter || 0));
    setAktif(Boolean(p.aktif));
  }

  // =========================
  // HAPUS
  // =========================
  async function hapus(id: number) {
    if (!confirm("Yakin ingin menghapus periode ini?")) {
      return;
    }

    try {
      await deletePeriode(id);

      await loadData();

      alert("Periode berhasil dihapus");
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    }
  }

  return (
    <Layout>
      <div className="space-y-8">

        {/* HEADER */}
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

        {/* FORM */}
        <div className="bg-white rounded-3xl shadow-xl p-8">

          <h2 className="text-2xl font-bold text-red-700 mb-8">
            {editId === null
              ? "Tambah Periode"
              : "Edit Periode"}
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            {/* NAMA PERIODE */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nama Periode
              </label>

              <input
                type="text"
                placeholder="Contoh: Januari 2025"
                value={namaPeriode}
                onChange={(e) =>
                  setNamaPeriode(e.target.value)
                }
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3"
              />
            </div>

            {/* JENIS BBM */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Jenis BBM
              </label>

              <select
                value={jenisBBMId}
                onChange={(e) =>
                  setJenisBBMId(e.target.value)
                }
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3"
              >
                <option value="">
                  -- Pilih Jenis BBM --
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

            {/* KUOTA */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Kuota Liter
              </label>

              <input
                type="number"
                min="1"
                value={kuotaLiter}
                onChange={(e) =>
                  setKuotaLiter(Number(e.target.value))
                }
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3"
              />
            </div>

            {/* AKTIF */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-3 bg-gray-50 border rounded-xl px-4 py-4">

                <input
                  type="checkbox"
                  checked={aktif}
                  onChange={(e) =>
                    setAktif(e.target.checked)
                  }
                  className="w-5 h-5 accent-red-600"
                />

                <span className="font-semibold">
                  Jadikan sebagai Periode Aktif
                </span>

              </label>
            </div>
          </div>

          {/* BUTTON */}
          <div className="flex gap-4 mt-8">

            <button
              onClick={simpan}
              className="bg-red-700 hover:bg-red-800 text-white px-8 py-3 rounded-xl"
            >
              {editId === null
                ? "💾 Simpan"
                : "✏️ Update"}
            </button>

            {editId !== null && (
              <button
                onClick={resetForm}
                className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-xl"
              >
                Batal
              </button>
            )}

          </div>
        </div>

        {/* DAFTAR PERIODE */}
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

      <th className="px-4 py-3">
        Jenis BBM
      </th>

      <th className="px-4 py-3">
        Kuota
      </th>

      <th className="px-4 py-3">
        Terjual
      </th>

      <th className="px-4 py-3">
        Sisa
      </th>

      <th className="px-4 py-3">
        Status
      </th>

      <th className="px-4 py-3">
        Aksi
      </th>
    </tr>

  </thead>

  <tbody>

    {list.map((p) => {
      const terjual = rekapLiter[p.id] || 0;
      const sisa = Number(p.kuota_liter) - terjual;

      return (
        <tr
          key={p.id}
          className="border-b"
        >

          <td className="px-4 py-4">
            {p.nama_periode}
          </td>

          <td className="px-4 py-4 text-center">
            {p.jenis_bbm?.nama || "-"}
          </td>

          <td className="px-4 py-4 text-center">
            {p.kuota_liter} Liter
          </td>

          <td className="px-4 py-4 text-center font-semibold">
            {terjual} Liter
          </td>

          <td className="px-4 py-4 text-center font-semibold">
            {sisa} Liter
          </td>

          <td className="px-4 py-4 text-center">
            {p.aktif
              ? "✔ Aktif"
              : "Tidak Aktif"}
          </td>

          <td className="px-4 py-4 text-center">

            <button
              onClick={() => edit(p)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg mr-2"
            >
              Edit
            </button>

            <button
              onClick={() => hapus(p.id)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
            >
              Hapus
            </button>

          </td>

        </tr>
      );
    })}

    {list.length === 0 && (
      <tr>
        <td
          colSpan={7}
          className="text-center py-8 text-gray-500"
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

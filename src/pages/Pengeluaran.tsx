import { useEffect, useState } from "react";
import Layout from "../components/Layout";

import {
  getPengeluaran,
  addPengeluaran,
  updatePengeluaran,
  deletePengeluaran,
} from "../services/pengeluaran";

import { getPeriode } from "../services/periode";

type Periode = {
  id: number;
  nama_periode: string;
};

type PengeluaranData = {
  id: number;
  tanggal: string;
  periode_id: number | null;
  keterangan: string;
  jumlah: number;
};

export default function Pengeluaran() {
  const [data, setData] = useState<PengeluaranData[]>([]);
  const [periode, setPeriode] = useState<Periode[]>([]);

  const [tanggal, setTanggal] = useState("");
  const [periodeId, setPeriodeId] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [jumlah, setJumlah] = useState("");

  const [editId, setEditId] = useState<number | null>(null);

  async function loadData() {
    try {
      const [pengeluaran, periodeData] = await Promise.all([
        getPengeluaran(),
        getPeriode(),
      ]);

      setData(pengeluaran);
      setPeriode(periodeData);
    } catch (error) {
      console.error(error);
      alert("Gagal mengambil data pengeluaran.");
    }
  }

  useEffect(() => {
    loadData();

    const today = new Date().toISOString().split("T")[0];
    setTanggal(today);
  }, []);

  function resetForm() {
    const today = new Date().toISOString().split("T")[0];

    setEditId(null);
    setTanggal(today);
    setPeriodeId("");
    setKeterangan("");
    setJumlah("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!tanggal || !keterangan || !jumlah) {
      alert("Tanggal, keterangan, dan jumlah wajib diisi.");
      return;
    }

    const nominal = Number(jumlah);

    if (nominal <= 0) {
      alert("Jumlah pengeluaran harus lebih dari 0.");
      return;
    }

    const selectedPeriode =
      periodeId === "" ? null : Number(periodeId);

    try {
      if (editId !== null) {
        await updatePengeluaran(
          editId,
          tanggal,
          selectedPeriode,
          keterangan,
          nominal
        );

        alert("Data pengeluaran berhasil diperbarui.");
      } else {
        await addPengeluaran(
          tanggal,
          selectedPeriode,
          keterangan,
          nominal
        );

        alert("Data pengeluaran berhasil ditambahkan.");
      }

      resetForm();
      await loadData();
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan data pengeluaran.");
    }
  }

  function handleEdit(item: PengeluaranData) {
    setEditId(item.id);
    setTanggal(item.tanggal);
    setPeriodeId(
      item.periode_id !== null ? String(item.periode_id) : ""
    );
    setKeterangan(item.keterangan);
    setJumlah(String(item.jumlah));

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleDelete(id: number) {
    const yakin = window.confirm(
      "Yakin ingin menghapus data pengeluaran ini?"
    );

    if (!yakin) return;

    try {
      await deletePengeluaran(id);
      await loadData();

      alert("Data pengeluaran berhasil dihapus.");
    } catch (error: any) {
      console.error(error);

      alert(
        "Gagal menghapus data pengeluaran.\n\n" +
          (error?.message || "")
      );
    }
  }

  const totalPengeluaran = data.reduce(
    (total, item) => total + Number(item.jumlah || 0),
    0
  );

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Layout>
      <div className="space-y-6">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            💰 Pengeluaran
          </h1>

          <p className="text-gray-500 mt-1">
            Catat pengeluaran koperasi untuk kebutuhan operasional.
          </p>
        </div>

        {/* FORM */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-5">
            {editId !== null
              ? "✏️ Edit Pengeluaran"
              : "➕ Tambah Pengeluaran"}
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >

            {/* TANGGAL */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tanggal
              </label>

              <input
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3"
              />
            </div>

            {/* PERIODE */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Periode
              </label>

              <select
                value={periodeId}
                onChange={(e) => setPeriodeId(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3"
              >
                <option value="">
                  -- Umum / Tanpa Periode --
                </option>

                {periode.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nama_periode}
                  </option>
                ))}
              </select>
            </div>

            {/* JUMLAH */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Jumlah Pengeluaran
              </label>

              <input
                type="number"
                min="0"
                step="1"
                value={jumlah}
                onChange={(e) => setJumlah(e.target.value)}
                placeholder="Contoh: 50000"
                className="w-full border border-gray-300 rounded-xl px-4 py-3"
              />
            </div>

            {/* KETERANGAN */}
            <div className="md:col-span-2 lg:col-span-3">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Keterangan
              </label>

              <input
                type="text"
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                placeholder="Contoh: Ongkos kirim BBM"
                className="w-full border border-gray-300 rounded-xl px-4 py-3"
              />
            </div>

            {/* BUTTON */}
            <div className="lg:col-span-3 flex gap-3">
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl"
              >
                {editId !== null
                  ? "💾 Simpan Perubahan"
                  : "➕ Simpan Pengeluaran"}
              </button>

              {editId !== null && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold px-6 py-3 rounded-xl"
                >
                  ❌ Batal
                </button>
              )}
            </div>
          </form>
        </div>

        {/* RINGKASAN */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <div className="bg-white rounded-2xl shadow p-5">
            <p className="text-gray-500 text-sm">
              Jumlah Pengeluaran
            </p>

            <p className="text-3xl font-bold text-gray-800 mt-2">
              {data.length}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow p-5">
            <p className="text-gray-500 text-sm">
              Total Pengeluaran
            </p>

            <p className="text-2xl font-bold text-red-700 mt-2">
              {formatRupiah(totalPengeluaran)}
            </p>
          </div>

        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-800">
              📋 Riwayat Pengeluaran
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">

              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left">
                    No
                  </th>

                  <th className="px-4 py-3 text-left">
                    Tanggal
                  </th>

                  <th className="px-4 py-3 text-left">
                    Periode
                  </th>

                  <th className="px-4 py-3 text-left">
                    Keterangan
                  </th>

                  <th className="px-4 py-3 text-right">
                    Jumlah
                  </th>

                  <th className="px-4 py-3 text-center">
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody>

                {data.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-10 text-gray-500"
                    >
                      Belum ada data pengeluaran.
                    </td>
                  </tr>
                ) : (
                  data.map((item, index) => {

                    const namaPeriode =
                      periode.find(
                        (p) => p.id === item.periode_id
                      )?.nama_periode ?? "Umum";

                    return (
                      <tr
                        key={item.id}
                        className="border-t hover:bg-gray-50"
                      >

                        <td className="px-4 py-3">
                          {index + 1}
                        </td>

                        <td className="px-4 py-3">
                          {item.tanggal}
                        </td>

                        <td className="px-4 py-3">
                          {namaPeriode}
                        </td>

                        <td className="px-4 py-3">
                          {item.keterangan}
                        </td>

                        <td className="px-4 py-3 text-right font-semibold">
                          {formatRupiah(
                            Number(item.jumlah)
                          )}
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex justify-center gap-2">

                            <button
                              onClick={() =>
                                handleEdit(item)
                              }
                              className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg"
                            >
                              ✏️
                            </button>

                            <button
                              onClick={() =>
                                handleDelete(item.id)
                              }
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg"
                            >
                              🗑️
                            </button>

                          </div>
                        </td>

                      </tr>
                    );
                  })
                )}

              </tbody>

            </table>
          </div>
        </div>

      </div>
    </Layout>
  );
}
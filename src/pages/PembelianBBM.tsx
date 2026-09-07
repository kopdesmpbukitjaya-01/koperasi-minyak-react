import { useEffect, useState } from "react";
import Layout from "../components/Layout";

import {
  getPembelianBBM,
  addPembelianBBM,
  updatePembelianBBM,
  deletePembelianBBM,
} from "../services/pembelian_bbm";

import { getJenisBBM } from "../services/jenis_bbm";

type JenisBBM = {
  id: number;
  nama: string;
  harga: number;
};

type PembelianBBMData = {
  id: number;
  tanggal_pembelian: string;
  jenis_bbm_id: number;
  jumlah_liter: number;
  harga_modal_per_liter: number;
  total_modal: number;
  keterangan: string | null;
  jenis_bbm?: JenisBBM;
};

export default function PembelianBBM() {
  const [data, setData] = useState<PembelianBBMData[]>([]);
  const [jenisBBM, setJenisBBM] = useState<JenisBBM[]>([]);

  const [tanggal, setTanggal] = useState("");
  const [jenisBBMId, setJenisBBMId] = useState("");
  const [jumlahLiter, setJumlahLiter] = useState("");
  const [hargaModal, setHargaModal] = useState("");
  const [keterangan, setKeterangan] = useState("");

  const [editId, setEditId] = useState<number | null>(null);

  async function loadData() {
    try {
      const [pembelian, jenis] = await Promise.all([
        getPembelianBBM(),
        getJenisBBM(),
      ]);

      setData(pembelian);
setJenisBBM(jenis);


    } catch (error) {
      console.error(error);
      alert("Gagal mengambil data pembelian BBM.");
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
    setJenisBBMId("");
    setJumlahLiter("");
    setHargaModal("");
    setKeterangan("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!tanggal || !jenisBBMId || !jumlahLiter || !hargaModal) {
      alert("Tanggal, jenis BBM, jumlah liter, dan harga modal wajib diisi.");
      return;
    }

    const liter = Number(jumlahLiter);
    const modal = Number(hargaModal);
    const jenisId = Number(jenisBBMId);

    if (liter <= 0) {
      alert("Jumlah liter harus lebih dari 0.");
      return;
    }

    if (modal < 0) {
      alert("Harga modal tidak boleh negatif.");
      return;
    }

    try {
      if (editId !== null) {
        await updatePembelianBBM(
          editId,
          tanggal,
          jenisId,
          liter,
          modal,
          keterangan
        );

        alert("Data pembelian berhasil diperbarui.");
      } else {
        await addPembelianBBM(
          tanggal,
          jenisId,
          liter,
          modal,
          keterangan
        );

        alert("Data pembelian berhasil ditambahkan.");
      }

      resetForm();
      await loadData();
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan data pembelian BBM.");
    }
  }

  function handleEdit(item: PembelianBBMData) {
    setEditId(item.id);
    setTanggal(item.tanggal_pembelian);
    setJenisBBMId(String(item.jenis_bbm_id));
    setJumlahLiter(String(item.jumlah_liter));
    setHargaModal(String(item.harga_modal_per_liter));
    setKeterangan(item.keterangan ?? "");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleDelete(id: number) {
  const yakin = window.confirm(
    "Yakin ingin menghapus data pembelian BBM ini?"
  );

  if (!yakin) return;

  try {
    await deletePembelianBBM(id);
    await loadData();

    alert("Data pembelian berhasil dihapus.");
  } catch (error: any) {
    console.error(error);

    alert(
      error?.message ||
      "Gagal menghapus data pembelian BBM."
    );
  }
}

  const totalLiter = data.reduce(
    (total, item) => total + Number(item.jumlah_liter || 0),
    0
  );

  const totalModal = data.reduce(
    (total, item) => total + Number(item.total_modal || 0),
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
            ⛽ Pembelian BBM
          </h1>

          <p className="text-gray-500 mt-1">
            Catat pembelian BBM dan harga modal per liter.
          </p>
        </div>

        {/* FORM */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-5">
            {editId !== null
              ? "✏️ Edit Pembelian BBM"
              : "➕ Tambah Pembelian BBM"}
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {/* TANGGAL */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tanggal Pembelian
              </label>

              <input
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3"
              />
            </div>

            {/* JENIS BBM */}
            <div>
             <label className="block text-sm font-semibold text-gray-700 mb-2">
  Jenis BBM ({jenisBBM.length})
</label>
              <select
  value={jenisBBMId}
  onChange={(e) => setJenisBBMId(e.target.value)}
  className="w-full border border-gray-300 rounded-xl px-4 py-3"
>
  <option value="">-- Pilih Jenis BBM --</option>

  {jenisBBM.map((item) => (
    <option key={item.id} value={item.id}>
      {item.nama}
    </option>
  ))}
</select>
            </div>

            {/* JUMLAH LITER */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Jumlah Liter
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                value={jumlahLiter}
                onChange={(e) => setJumlahLiter(e.target.value)}
                placeholder="Contoh: 1000"
                className="w-full border border-gray-300 rounded-xl px-4 py-3"
              />
            </div>

            {/* HARGA MODAL */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Harga Modal / Liter
              </label>

              <input
                type="number"
                min="0"
                step="1"
                value={hargaModal}
                onChange={(e) => setHargaModal(e.target.value)}
                placeholder="Contoh: 12500"
                className="w-full border border-gray-300 rounded-xl px-4 py-3"
              />

              <p className="text-xs text-gray-500 mt-1">
                Harga modal dapat diubah setiap pembelian.
              </p>
            </div>

            {/* KETERANGAN */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Keterangan
              </label>

              <input
                type="text"
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                placeholder="Contoh: Pembelian dari SPBU"
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
                  : "➕ Simpan Pembelian"}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl shadow p-5">
            <p className="text-gray-500 text-sm">
              Jumlah Pembelian
            </p>

            <p className="text-3xl font-bold text-gray-800 mt-2">
              {data.length}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow p-5">
            <p className="text-gray-500 text-sm">
              Total Liter Dibeli
            </p>

            <p className="text-3xl font-bold text-gray-800 mt-2">
              {totalLiter.toLocaleString("id-ID")} L
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow p-5">
            <p className="text-gray-500 text-sm">
              Total Modal
            </p>

            <p className="text-2xl font-bold text-red-700 mt-2">
              {formatRupiah(totalModal)}
            </p>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-800">
              📋 Riwayat Pembelian BBM
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left">No</th>
                  <th className="px-4 py-3 text-left">Tanggal</th>
                  <th className="px-4 py-3 text-left">Jenis BBM</th>
                  <th className="px-4 py-3 text-right">Liter</th>
                  <th className="px-4 py-3 text-right">
                    Modal/Liter
                  </th>
                  <th className="px-4 py-3 text-right">
                    Total Modal
                  </th>
                  <th className="px-4 py-3 text-left">
                    Keterangan
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
                      colSpan={8}
                      className="text-center py-10 text-gray-500"
                    >
                      Belum ada data pembelian BBM.
                    </td>
                  </tr>
                ) : (
                  data.map((item, index) => (
                    <tr
                      key={item.id}
                      className="border-t hover:bg-gray-50"
                    >
                      <td className="px-4 py-3">
                        {index + 1}
                      </td>

                      <td className="px-4 py-3">
                        {item.tanggal_pembelian}
                      </td>

                      <td className="px-4 py-3 font-semibold">
                        {item.jenis_bbm?.nama ?? "-"}
                      </td>

                      <td className="px-4 py-3 text-right">
                        {Number(item.jumlah_liter).toLocaleString(
                          "id-ID"
                        )}
                      </td>

                      <td className="px-4 py-3 text-right">
                        {formatRupiah(
                          Number(item.harga_modal_per_liter)
                        )}
                      </td>

                      <td className="px-4 py-3 text-right font-semibold">
                        {formatRupiah(
                          Number(item.total_modal)
                        )}
                      </td>

                      <td className="px-4 py-3">
                        {item.keterangan || "-"}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg"
                          >
                            ✏️
                          </button>

                          <button
                            onClick={() => handleDelete(item.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
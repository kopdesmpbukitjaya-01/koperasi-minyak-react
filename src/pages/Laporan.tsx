import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getPeriode } from "../services/periode";
import { getLaporan } from "../services/laporan";

export default function Laporan() {
  const navigate = useNavigate();

  const [periode, setPeriode] = useState<any[]>([]);
  const [periodeId, setPeriodeId] = useState("");
  const [data, setData] = useState<any[]>([]);
  const [petugas, setPetugas] = useState("");

  useEffect(() => {
    loadPeriode();
  }, []);

  async function loadPeriode() {
    try {
      const hasil = await getPeriode();
      setPeriode(hasil);
    } catch (err) {
      console.error(err);
      alert("Gagal memuat data periode.");
    }
  }

  async function tampilkan() {
    if (!periodeId) {
      alert("Silakan pilih periode.");
      return;
    }

    try {
      const hasil = await getLaporan(Number(periodeId));
      setData(hasil);

      if (hasil.length === 0) {
        alert("Tidak ada data pada periode ini.");
      }
    } catch (err) {
      console.error(err);
      alert("Gagal mengambil data laporan.");
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>📄 Laporan Pengambilan Minyak</h1>

      <button
        onClick={() => navigate("/dashboard")}
        style={{
          padding: "8px 16px",
          marginBottom: 15,
          cursor: "pointer",
        }}
      >
        ← Kembali
      </button>

      <hr />

      <div
        style={{
          display: "flex",
          gap: 10,
          alignItems: "center",
          marginTop: 15,
          marginBottom: 15,
          flexWrap: "wrap",
        }}
      >
        <select
          value={periodeId}
          onChange={(e) => setPeriodeId(e.target.value)}
          style={{
            padding: 8,
            minWidth: 220,
          }}
        >
          <option value="">Pilih Periode</option>

          {periode.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nama_periode}
            </option>
          ))}
        </select>

        <button
          onClick={tampilkan}
          style={{
            padding: "8px 15px",
            cursor: "pointer",
          }}
        >
          Tampilkan
        </button>

        <button
  onClick={() =>
    window.open(
      `/print-laporan?periode=${periodeId}&petugas=${encodeURIComponent(
        petugas
      )}`,
      "_blank"
    )
  }
>
  🖨️ Cetak
</button>
      </div>

      <div
        style={{
          marginBottom: 20,
        }}
      >
        <label>
          <b>Petugas Pencatat</b>
        </label>

        <br />

        <input
          type="text"
          value={petugas}
          placeholder="Masukkan nama petugas"
          onChange={(e) => setPetugas(e.target.value)}
          style={{
            marginTop: 8,
            padding: 8,
            width: 300,
          }}
        />
      </div>

      <table
        border={1}
        cellPadding={8}
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead
          style={{
            background: "#c62828",
            color: "white",
          }}
        >
          <tr>
            <th>No</th>
            <th>Nama</th>
            <th>Tanggal</th>
            <th>Liter</th>
            <th>Harga/Liter</th>
            <th>Total</th>
          </tr>
        </thead>

        <tbody>
          {data.length > 0 ? (
            data.map((t, index) => (
              <tr key={t.id}>
                <td align="center">{index + 1}</td>

                <td>{t.warga.nama}</td>

                <td>{t.tanggal}</td>

                <td align="center">
                  {t.liter} L
                </td>

                <td align="right">
                  Rp {Number(t.harga).toLocaleString("id-ID")}
                </td>

                <td align="right">
                  Rp {Number(t.total).toLocaleString("id-ID")}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={6}
                align="center"
                style={{
                  padding: 20,
                }}
              >
                Belum ada data.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
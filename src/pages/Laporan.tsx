import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import { getPeriode } from "../services/periode";
import { getLaporan } from "../services/laporan";

export default function Laporan() {
  const navigate = useNavigate();

  const [periode, setPeriode] = useState<any[]>([]);
  const [periodeId, setPeriodeId] = useState("");
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    loadPeriode();
  }, []);

  async function loadPeriode() {
    const p = await getPeriode();
    setPeriode(p);
  }

  async function tampilkan() {
    if (!periodeId) {
      alert("Pilih periode");
      return;
    }

    const hasil = await getLaporan(Number(periodeId));
    setData(hasil);
  }

  function downloadPDF() {
    if (data.length === 0) {
      alert("Data masih kosong");
      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("KOPERASI DESA MERAH PUTIH", 14, 15);

    doc.setFontSize(13);
    doc.text("LAPORAN PENGAMBILAN MINYAK", 14, 24);

    doc.setFontSize(10);
    doc.text(
      "Periode : " + data[0].periode.nama_periode,
      14,
      32
    );

    let totalLiter = 0;
    let totalRupiah = 0;

    const rows = data.map((t, index) => {
      totalLiter += Number(t.liter);
      totalRupiah += Number(t.total);

      return [
        index + 1,
        t.warga.nama,
        t.tanggal,
        t.liter,
        Number(t.harga).toLocaleString("id-ID"),
        Number(t.total).toLocaleString("id-ID"),
      ];
    });

    autoTable(doc, {
      startY: 38,
      head: [[
        "No",
        "Nama",
        "Tanggal",
        "Liter",
        "Harga",
        "Total"
      ]],
      body: rows,
    });

    const akhir = (doc as any).lastAutoTable.finalY + 10;

    doc.text(
      "Total Liter : " + totalLiter,
      14,
      akhir
    );

    doc.text(
      "Total Rupiah : Rp " +
      totalRupiah.toLocaleString("id-ID"),
      14,
      akhir + 8
    );

    doc.save(
      "laporan-" +
      data[0].periode.nama_periode +
      ".pdf"
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>📄 Laporan Pengambilan</h1>

      <button onClick={() => navigate("/dashboard")}>
        ← Kembali
      </button>

      <hr />

      <select
        value={periodeId}
        onChange={(e) => setPeriodeId(e.target.value)}
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
        style={{ marginLeft: 10 }}
      >
        Tampilkan
      </button>

      <button
        onClick={downloadPDF}
        style={{ marginLeft: 10 }}
      >
        Download PDF
      </button>

      <hr />

      <table border={1} cellPadding={8}>
        <thead>
          <tr>
            <th>Nama</th>
            <th>Tanggal</th>
            <th>Liter</th>
            <th>Harga</th>
            <th>Total</th>
          </tr>
        </thead>

        <tbody>
          {data.map((t) => (
            <tr key={t.id}>
              <td>{t.warga.nama}</td>
              <td>{t.tanggal}</td>
              <td>{t.liter}</td>
              <td>
                Rp {Number(t.harga).toLocaleString("id-ID")}
              </td>
              <td>
                Rp {Number(t.total).toLocaleString("id-ID")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
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
  const [petugas, setPetugas] = useState("");

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

doc.setFontSize(12);
doc.text("PERTASHOP BUKIT JAYA", 14, 22);

doc.setFontSize(13);
doc.text("LAPORAN PENGAMBILAN MINYAK", 14, 30);

doc.setFontSize(10);
doc.text(
  "Periode : " + data[0].periode.nama_periode,
  14,
  38
);

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
      startY: 45,
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
  "Jumlah KK Mengambil : " + data.length,
  14,
  akhir + 8
);

doc.text(
  "Total Rupiah : Rp " +
  totalRupiah.toLocaleString("id-ID"),
  14,
  akhir + 16
);

   doc.text(
  "Total Rupiah : Rp " +
  totalRupiah.toLocaleString("id-ID"),
  14,
  akhir + 8
);


const tanggalCetak = new Date().toLocaleDateString("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

doc.setFontSize(10);

doc.text(
  "Bukit Jaya, " + tanggalCetak,
  120,
  akhir + 20
);

doc.setFontSize(11);

doc.text(
  "Mengetahui,",
  14,
  akhir + 32
);

doc.text(
  "Ketua KDMP Bukit Jaya",
  14,
  akhir + 42
);

doc.text(
  "Kecamatan Bulik Timur",
  14,
  akhir + 49
);

doc.text(
  "Petugas Pencatat",
  130,
  akhir + 42
);

doc.text(
  "(_____________________)",
  14,
  akhir + 72
);

doc.text(
  "(_____________________)",
  130,
  akhir + 72
);

doc.text(
  "Nama :",
  14,
  akhir + 82
);

doc.text(
  "Nama : " + (petugas || "........................."),
  130,
  akhir + 82
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

<div style={{ marginTop: 15, marginBottom: 15 }}>
  <label>
    <b>Petugas Pencatat :</b>
  </label>

  <br />

  <input
    type="text"
    placeholder="Masukkan nama petugas"
    value={petugas}
    onChange={(e) => setPetugas(e.target.value)}
    style={{
      marginTop: 8,
      padding: 8,
      width: 300,
    }}
  />
</div>


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
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo_crop.png";
import jsPDF from "jspdf";
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

  // =====================================================
  // DOWNLOAD PDF
  // =====================================================

  async function downloadPdf() {
    if (!periodeId) {
      alert("Silakan pilih periode terlebih dahulu.");
      return;
    }

    try {
      const hasil = await getLaporan(Number(periodeId));

      if (!hasil || hasil.length === 0) {
        alert("Tidak ada data pada periode ini.");
        return;
      }

      const doc = new jsPDF("p", "mm", "a4");

      const namaPeriode =
        hasil[0]?.periode?.nama_periode || "-";

      const namaBBM =
        hasil[0]?.periode?.jenis_bbm?.nama || "-";

      const kuotaLiter =
        Number(hasil[0]?.periode?.kuota_liter || 0);

      let totalLiter = 0;
      let totalRupiah = 0;

      hasil.forEach((item: any) => {
        totalLiter += Number(item.liter) || 0;
        totalRupiah += Number(item.total) || 0;
      });

      const sisaKuota = kuotaLiter - totalLiter;

// =====================================================
// LOAD LOGO
// =====================================================

const logoImg = new Image();

await new Promise<void>((resolve, reject) => {
  logoImg.onload = () => resolve();
  logoImg.onerror = () => reject(new Error("Logo gagal dimuat"));
  logoImg.src = logo;
});

  // =====================================================
// =====================================================
// HEADER
// =====================================================

// LOGO
doc.addImage(
  logoImg,
  "PNG",
  18,
  6,
  24,
  24
);

// NAMA KOPERASI
doc.setFont("helvetica", "bold");
doc.setFontSize(17);

doc.text(
  "KOPERASI DESA MERAH PUTIH",
  105,
  15,
  { align: "center" }
);

doc.setFontSize(16);

doc.text(
  "BUKIT JAYA",
  105,
  23,
  { align: "center" }
);

doc.setFontSize(13);

doc.text(
  "PERTASHOP",
  105,
  30,
  { align: "center" }
);

// JUDUL LAPORAN
doc.setFont("helvetica", "bold");
doc.setFontSize(15);

doc.text(
  "LAPORAN PENGAMBILAN BBM",
  105,
  40,
  { align: "center" }
);

doc.setFont("helvetica", "normal");
doc.setFontSize(10);

doc.text(
  `Periode: ${namaPeriode}`,
  105,
  47,
  { align: "center" }
);

doc.line(15, 52, 195, 52);
      // =====================================================
      // RINGKASAN
      // =====================================================

      autoTable(doc, {
        startY: 56,

        theme: "grid",

        head: [
          ["Keterangan", "Nilai"],
        ],

        body: [
          ["Periode", namaPeriode],
          ["Jenis BBM", namaBBM],
          [
            "Kuota",
            `${kuotaLiter.toLocaleString("id-ID")} L`,
          ],
          [
            "Terjual",
            `${totalLiter.toLocaleString("id-ID")} L`,
          ],
          [
            "Sisa Kuota",
            `${sisaKuota.toLocaleString("id-ID")} L`,
          ],
        ],

        styles: {
          fontSize: 9,
          cellPadding: 3,
        },

        headStyles: {
          fillColor: [185, 28, 28],
          textColor: 255,
          fontStyle: "bold",
        },

        columnStyles: {
          0: {
            cellWidth: 55,
          },
          1: {
            cellWidth: 115,
          },
        },
      });

      // =====================================================
      // TABEL TRANSAKSI
      // =====================================================

      const tableData = hasil.map(
        (item: any, index: number) => [
          index + 1,
          item.warga?.nama || "-",
          item.tanggal || "-",
          `${Number(item.liter || 0).toLocaleString(
            "id-ID"
          )} L`,
          `Rp ${Number(item.harga || 0).toLocaleString(
            "id-ID"
          )}`,
          `Rp ${Number(item.total || 0).toLocaleString(
            "id-ID"
          )}`,
        ]
      );

      autoTable(doc, {
        startY:
          (doc as any).lastAutoTable.finalY + 8,

        head: [[
          "No",
          "Nama Warga",
          "Tanggal",
          "Liter",
          "Harga/Liter",
          "Total",
        ]],

        body: tableData,

        theme: "grid",

        styles: {
          fontSize: 8,
          cellPadding: 2.5,
        },

        headStyles: {
          fillColor: [185, 28, 28],
          textColor: 255,
          fontStyle: "bold",
          halign: "center",
        },

        columnStyles: {
          0: {
            cellWidth: 10,
            halign: "center",
          },

          1: {
            cellWidth: 55,
          },

          2: {
            cellWidth: 25,
            halign: "center",
          },

          3: {
            cellWidth: 20,
            halign: "center",
          },

          4: {
            cellWidth: 35,
            halign: "right",
          },

          5: {
            cellWidth: 35,
            halign: "right",
          },
        },
      });

      // =====================================================
      // TOTAL
      // =====================================================

      let y =
        (doc as any).lastAutoTable.finalY + 8;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);

      doc.text(
        `TOTAL PENGAMBILAN: ${totalLiter.toLocaleString(
          "id-ID"
        )} L`,
        15,
        y
      );

      doc.text(
        `TOTAL NILAI: Rp ${totalRupiah.toLocaleString(
          "id-ID"
        )}`,
        195,
        y,
        {
          align: "right",
        }
      );

      // =====================================================
      // TANDA TANGAN
      // =====================================================

      y += 15;

      doc.setFont("helvetica", "normal");

      doc.text(
        "Petugas Pencatat,",
        30,
        y
      );

      doc.text(
        "Mengetahui,",
        145,
        y
      );

      y += 22;

      doc.setFont("helvetica", "bold");

      doc.text(
        petugas || "(............................)",
        30,
        y
      );

      doc.text(
        "(............................)",
        145,
        y
      );

      // =====================================================
      // FOOTER
      // =====================================================

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);

      doc.text(
        "Dokumen Laporan Pengambilan BBM - KDMP Bukit Jaya",
        105,
        287,
        {
          align: "center",
        }
      );

      // =====================================================
      // DOWNLOAD
      // =====================================================

      const namaFile =
        `Laporan_${namaPeriode
          .replace(/\s+/g, "_")
          .replace(/[^\w-]/g, "")}.pdf`;

      doc.save(namaFile);

    } catch (err) {
      console.error(err);
      alert("Gagal membuat PDF.");
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
          <option value="">
            Pilih Periode
          </option>

          {periode.map((p) => (
            <option
              key={p.id}
              value={p.id}
            >
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
          style={{
            padding: "8px 15px",
            cursor: "pointer",
          }}
        >
          🖨️ Cetak
        </button>

        <button
          onClick={downloadPdf}
          style={{
            padding: "8px 15px",
            cursor: "pointer",
          }}
        >
          ⬇️ Download PDF
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
          onChange={(e) =>
            setPetugas(e.target.value)
          }
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

                <td align="center">
                  {index + 1}
                </td>

                <td>
                  {t.warga?.nama || "-"}
                </td>

                <td>
                  {t.tanggal}
                </td>

                <td align="center">
                  {t.liter} L
                </td>

                <td align="right">
                  Rp{" "}
                  {Number(
                    t.harga
                  ).toLocaleString("id-ID")}
                </td>

                <td align="right">
                  Rp{" "}
                  {Number(
                    t.total
                  ).toLocaleString("id-ID")}
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
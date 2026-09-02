import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getLaporan } from "../services/laporan";
import logo from "../assets/logo_crop.png";
export default function PrintLaporan() {
  const [searchParams] = useSearchParams();

  const periodeId = Number(searchParams.get("periode"));
  const petugas = searchParams.get("petugas") || "";

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const hasil = await getLaporan(periodeId);
        setData(hasil);
      } catch (err) {
        console.error("Gagal memuat laporan:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [periodeId]);

  // ==========================================
  // CETAK SETELAH DATA SELESAI DIMUAT
  // ==========================================
  useEffect(() => {
    if (!loading && data.length > 0) {
      const timer = setTimeout(() => {
        window.print();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [loading, data]);

  if (loading) {
    return (
      <div
        style={{
          padding: 40,
          textAlign: "center",
          fontFamily: "Arial, sans-serif",
        }}
      >
        Memuat laporan...
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div
        style={{
          padding: 40,
          textAlign: "center",
          fontFamily: "Arial, sans-serif",
        }}
      >
        Tidak ada data laporan.
      </div>
    );
  }

  // ==========================================
  // PERHITUNGAN
  // ==========================================

  let totalLiter = 0;
  let totalRupiah = 0;

  data.forEach((d: any) => {
    totalLiter += Number(d.liter) || 0;
    totalRupiah += Number(d.total) || 0;
  });

  const kuotaLiter = Number(
    data[0]?.periode?.kuota_liter || 0
  );

  const sisaKuota = kuotaLiter - totalLiter;

  const namaPeriode =
    data[0]?.periode?.nama_periode || "-";

  const namaBBM =
    data[0]?.periode?.jenis_bbm?.nama || "-";

  const tanggalCetak = new Date().toLocaleDateString(
    "id-ID",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  return (
    <>
      {/* =====================================================
          STYLE KHUSUS PRINT
      ===================================================== */}
      <style>
        {`
          @page {
            size: A4 portrait;
            margin: 12mm;
          }

          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            padding: 0;
            background: #f1f1f1;
            font-family: Arial, Helvetica, sans-serif;
            color: #111;
          }

          .print-page {
            width: 210mm;
            min-height: 297mm;
            margin: 20px auto;
            background: white;
            padding: 12mm;
          }

          .report-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 11px;
          }

          .report-table th {
  border: 1px solid #333;
  padding: 7px 6px;
  background: #b91c1c !important;
  color: white !important;
  font-weight: bold;
  text-align: center;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

          .report-table td {
            border: 1px solid #999;
            padding: 6px;
            vertical-align: middle;
          }

          .report-table tbody tr {
            page-break-inside: avoid;
          }

          .summary-table {
            width: 100%;
            border-collapse: collapse;
          }

          .summary-table td {
            border: 1px solid #999;
            padding: 8px 10px;
          }

          .summary-label {
            width: 55%;
            font-weight: bold;
          }

          .summary-value {
            width: 45%;
            text-align: right;
            font-weight: bold;
          }

          .signature-area {
            page-break-inside: avoid;
          }

          @media print {
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  body {
    background: white;
  }

  .print-page {
              width: 100%;
              min-height: auto;
              margin: 0;
              padding: 0;
              box-shadow: none;
            }
          }
        `}
      </style>

      {/* =====================================================
          HALAMAN LAPORAN
      ===================================================== */}
      <div className="print-page">

        {/* =================================================
            HEADER
        ================================================= */}
        <div
          style={{
            textAlign: "center",
            marginBottom: 14,
          }}
        >
          <img
  src={logo}
  alt="Logo KDMP"
  style={{
    width: 65,
    height: 65,
    objectFit: "contain",
    margin: "0 auto 8px",
    display: "block",
  }}
/>
          <div
            style={{
              fontSize: 24,
              fontWeight: "bold",
              letterSpacing: 0.5,
            }}
          >
            KOPERASI DESA MERAH PUTIH
          </div>

          <div
            style={{
              fontSize: 17,
              fontWeight: "bold",
              marginTop: 4,
            }}
          >
            BUKIT JAYA
          </div>

          <div
            style={{
              fontSize: 13,
              marginTop: 4,
            }}
          >
            PERTASHOP
          </div>

          <div
            style={{
              fontSize: 19,
              fontWeight: "bold",
              marginTop: 14,
            }}
          >
            LAPORAN PENGAMBILAN BBM
          </div>

          <div
            style={{
              fontSize: 13,
              marginTop: 5,
            }}
          >
            Periode {namaPeriode}
          </div>

          <div
            style={{
              borderBottom: "2px solid #111",
              marginTop: 12,
            }}
          />
        </div>

        {/* =================================================
            INFORMASI PERIODE
        ================================================= */}
        <div
          style={{
            marginBottom: 16,
          }}
        >
          <table className="summary-table">
            <tbody>

              <tr>
                <td className="summary-label">
                  Periode
                </td>

                <td className="summary-value">
                  {namaPeriode}
                </td>
              </tr>

              <tr>
                <td className="summary-label">
                  Jenis BBM
                </td>

                <td className="summary-value">
                  {namaBBM}
                </td>
              </tr>

              <tr>
                <td className="summary-label">
                  Kuota
                </td>

                <td className="summary-value">
                  {kuotaLiter.toLocaleString("id-ID")} Liter
                </td>
              </tr>

              <tr>
                <td className="summary-label">
                  Terjual
                </td>

                <td className="summary-value">
                  {totalLiter.toLocaleString("id-ID")} Liter
                </td>
              </tr>

              <tr>
                <td
                  className="summary-label"
                  style={{
                    fontSize: 13,
                  }}
                >
                  Sisa Kuota
                </td>

                <td
                  className="summary-value"
                  style={{
                    fontSize: 13,
                  }}
                >
                  {sisaKuota.toLocaleString("id-ID")} Liter
                </td>
              </tr>

            </tbody>
          </table>
        </div>

        {/* =================================================
            TABEL TRANSAKSI
        ================================================= */}
        <table className="report-table">

          <thead>
            <tr>
              <th style={{ width: "6%" }}>
                No
              </th>

              <th style={{ width: "32%" }}>
                Nama Warga
              </th>

              <th style={{ width: "17%" }}>
                Tanggal
              </th>

              <th style={{ width: "10%" }}>
                Liter
              </th>

              <th style={{ width: "17%" }}>
                Harga/Liter
              </th>

              <th style={{ width: "18%" }}>
                Total
              </th>
            </tr>
          </thead>

          <tbody>
            {data.map((t: any, i: number) => (
              <tr key={t.id}>

                <td
                  style={{
                    textAlign: "center",
                  }}
                >
                  {i + 1}
                </td>

                <td>
                  {t.warga?.nama || "-"}
                </td>

                <td
                  style={{
                    textAlign: "center",
                  }}
                >
                  {t.tanggal}
                </td>

                <td
                  style={{
                    textAlign: "center",
                  }}
                >
                  {Number(t.liter).toLocaleString("id-ID")}
                </td>

                <td
                  style={{
                    textAlign: "right",
                    whiteSpace: "nowrap",
                  }}
                >
                  Rp{" "}
                  {Number(t.harga).toLocaleString("id-ID")}
                </td>

                <td
                  style={{
                    textAlign: "right",
                    whiteSpace: "nowrap",
                  }}
                >
                  Rp{" "}
                  {Number(t.total).toLocaleString("id-ID")}
                </td>

              </tr>
            ))}
          </tbody>

        </table>

        {/* =================================================
            RINGKASAN TOTAL
        ================================================= */}
        <div
          style={{
            marginTop: 16,
            marginLeft: "auto",
            width: "55%",
          }}
        >
          <table
            className="summary-table"
          >
            <tbody>

              <tr>
                <td className="summary-label">
                  TOTAL PENGAMBILAN
                </td>

                <td className="summary-value">
                  {totalLiter.toLocaleString("id-ID")} Liter
                </td>
              </tr>

              <tr>
                <td className="summary-label">
                  TOTAL NILAI TRANSAKSI
                </td>

                <td className="summary-value">
                  Rp{" "}
                  {totalRupiah.toLocaleString("id-ID")}
                </td>
              </tr>

            </tbody>
          </table>
        </div>

        {/* =================================================
            TANDA TANGAN
        ================================================= */}
        <div
          className="signature-area"
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 45,
            fontSize: 13,
          }}
        >

          {/* KETUA */}
          <div
            style={{
              width: "42%",
              textAlign: "center",
            }}
          >
            <div>
              Mengetahui,
            </div>

            <div
              style={{
                marginTop: 5,
                fontWeight: "bold",
              }}
            >
              Ketua KDMP Bukit Jaya
            </div>

            <div>
              Kecamatan Bulik Timur
            </div>

            <div
              style={{
                height: 65,
              }}
            />

            <div>
              __________________________
            </div>

            <div
              style={{
                marginTop: 5,
              }}
            >
              Nama : __________________
            </div>
          </div>

          {/* PETUGAS */}
          <div
            style={{
              width: "42%",
              textAlign: "center",
            }}
          >
            <div>
              Bukit Jaya, {tanggalCetak}
            </div>

            <div
              style={{
                marginTop: 5,
                fontWeight: "bold",
              }}
            >
              Petugas Pencatat
            </div>

            <div
              style={{
                height: 65,
              }}
            />

            <div>
              __________________________
            </div>

            <div
              style={{
                marginTop: 5,
              }}
            >
              Nama : {petugas || "__________________"}
            </div>
          </div>

        </div>

        {/* =================================================
            FOOTER
        ================================================= */}
        <div
          style={{
            textAlign: "center",
            marginTop: 25,
            paddingTop: 8,
            borderTop: "1px solid #aaa",
            fontSize: 9,
            color: "#555",
          }}
        >
          KOPERASI DESA MERAH PUTIH BUKIT JAYA
          {" • "}
          Dokumen Laporan Pengambilan BBM
        </div>

      </div>
    </>
  );
}
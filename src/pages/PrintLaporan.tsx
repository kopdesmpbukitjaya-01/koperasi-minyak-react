import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getLaporan } from "../services/laporan";

export default function PrintLaporan() {
  const [searchParams] = useSearchParams();

  const periodeId = Number(searchParams.get("periode"));
  const petugas = searchParams.get("petugas") || "";

  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const hasil = await getLaporan(periodeId);
      setData(hasil);

      setTimeout(() => {
        window.print();
      }, 500);
    }

    load();
  }, []);

  let totalLiter = 0;
  let totalRupiah = 0;

  data.forEach((d: any) => {
    totalLiter += Number(d.liter);
    totalRupiah += Number(d.total);
  });

  const tanggalCetak = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  if (data.length === 0) return <p>Memuat...</p>;

  return (
    <div
      style={{
        width: "210mm",
        margin: "auto",
        padding: 30,
        fontFamily: "Arial",
      }}
    >
      <h2 style={{ textAlign: "center", margin: 0 }}>
        KOPERASI DESA MERAH PUTIH
      </h2>

      <h3 style={{ textAlign: "center", margin: 0 }}>
        PERTASHOP BUKIT JAYA
      </h3>

      <h3 style={{ textAlign: "center" }}>
        LAPORAN PENGAMBILAN MINYAK
      </h3>

      <hr />

      <p>
        <b>Periode :</b> {data[0].periode.nama_periode}
      </p>

      <table
        border={1}
        cellPadding={6}
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th>No</th>
            <th>Nama</th>
            <th>Tanggal</th>
            <th>Liter</th>
            <th>Harga</th>
            <th>Total</th>
          </tr>
        </thead>

        <tbody>
          {data.map((t: any, i: number) => (
            <tr key={t.id}>
              <td>{i + 1}</td>
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

      <br />

      <b>Total Liter : {totalLiter} Liter</b>

      <br />

      <b>
        Total Rupiah :
        Rp {totalRupiah.toLocaleString("id-ID")}
      </b>

      <br />
      <br />
      <br />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div>
          <p>Mengetahui,</p>

          <p>Ketua KDMP Bukit Jaya</p>

          <p>Kecamatan Bulik Timur</p>

          <br />
          <br />
          <br />

          _______________________

          <br />

          Nama :
        </div>

        <div style={{ textAlign: "center" }}>
          <p>Bukit Jaya, {tanggalCetak}</p>

          <p>Petugas Pencatat</p>

          <br />
          <br />
          <br />

          _______________________

          <br />

          Nama : {petugas}
        </div>
      </div>
    </div>
  );
}
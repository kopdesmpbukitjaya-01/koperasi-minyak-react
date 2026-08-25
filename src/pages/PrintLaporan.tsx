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
      <div
  style={{
    textAlign: "center",
    marginBottom: 20,
  }}
>
  <h2
    style={{
      margin: 0,
      fontSize: 26,
    }}
  >
    KOPERASI DESA MERAH PUTIH
  </h2>

  <h3
    style={{
      margin: "6px 0",
      fontWeight: "normal",
    }}
  >
    PERTASHOP BUKIT JAYA
  </h3>

  <h2
    style={{
      margin: "12px 0 8px",
    }}
  >
    LAPORAN PENGAMBILAN MINYAK
  </h2>

  <hr
    style={{
      border: "1px solid black",
      marginTop: 10,
    }}
  />
</div>

<div
  style={{
    marginBottom: 20,
    fontSize: 16,
  }}
>
  <b>Periode :</b> {data[0].periode.nama_periode}
</div>

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
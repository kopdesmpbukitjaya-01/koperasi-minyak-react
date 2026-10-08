import { useEffect, useState } from "react";
import {
  getAnggotaKoperasi,
  addSimpanan,
  getSimpananAnggota,
  updateSimpanan,
  deleteSimpanan,
} from "../services/simpanan";


export default function Anggota() {

  const [anggota, setAnggota] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [wargaId, setWargaId] = useState("");

  const [tanggalSetor, setTanggalSetor] = useState(
    new Date().toISOString().slice(0, 10)
  );

  const [simpananPokok, setSimpananPokok] = useState("");
  const [simpananWajib, setSimpananWajib] = useState("");
  const [simpananSukarela, setSimpananSukarela] = useState("");

  const [rekapSimpanan, setRekapSimpanan] = useState<any[]>([]);
const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    loadAnggota();
  }, []);



  async function loadAnggota() {

    try {

      const data = await getAnggotaKoperasi();

      setAnggota(data || []);

    } catch (error) {

      console.error(
        "Gagal mengambil anggota:",
        error
      );

    } finally {

      setLoading(false);

    }

  }



  async function loadRekapSimpanan(
  id: number
) {

  try {

    const data =
      await getSimpananAnggota(id);

    setRekapSimpanan(data || []);

  } catch (error) {

    console.error(
      "Gagal mengambil rekap:",
      error
    );

  }

}



function editSimpanan(item: any) {

  setEditId(item.id);

  setTanggalSetor(
    item.tanggal_setor
  );


  setSimpananPokok(
    String(item.simpanan_pokok || 0)
  );


  setSimpananWajib(
    String(item.simpanan_wajib || 0)
  );


  setSimpananSukarela(
    String(item.simpanan_sukarela || 0)
  );

  setSimpananSukarela(
    String(item.simpanan_sukarela || 0)
  );

}
async function hapusSimpanan(
  id: number
) {

  const yakin = window.confirm(
    "Yakin ingin menghapus data simpanan ini?"
  );


  if (!yakin) return;


  try {

    await deleteSimpanan(id);


    alert(
      "✅ Data berhasil dihapus"
    );


    if (wargaId) {

      await loadRekapSimpanan(
        Number(wargaId)
      );

    }


  } catch (error) {

    console.error(
      "Gagal hapus:",
      error
    );


    alert(
      "Gagal menghapus data"
    );

  }

}
  async function simpanSimpanan() {


    if (!wargaId) {

      alert(
        "Pilih anggota terlebih dahulu"
      );

      return;

    }


    try {


      if (editId) {

  await updateSimpanan(
    editId,
    tanggalSetor,
    Number(simpananPokok || 0),
    Number(simpananWajib || 0),
    Number(simpananSukarela || 0)
  );

} else {

  await addSimpanan(
    Number(wargaId),
    tanggalSetor,
    Number(simpananPokok || 0),
    Number(simpananWajib || 0),
    Number(simpananSukarela || 0)
  );

}


      alert(
        "✅ Simpanan berhasil disimpan"
      );


      // refresh rekap setelah simpan

      await loadRekapSimpanan(
        Number(wargaId)
      );


      setSimpananPokok("");
      setSimpananWajib("");
      setSimpananSukarela("");
      setEditId(null);


    } catch (error) {


      console.error(
        "ERROR SIMPAN:",
        error
      );


      alert(
        JSON.stringify(error)
      );


    }

  }



  if (loading) {

    return (

      <div className="p-6">

        Memuat data anggota...

      </div>

    );

  }



  return (

    <div className="p-6">


      <h1 className="text-2xl font-bold mb-6">
        Anggota Koperasi
      </h1>



      <div className="bg-white rounded-xl shadow p-5">


        <label className="block font-semibold mb-2">
          Pilih Anggota
        </label>


        <select

          value={wargaId}

          onChange={(e) => {

            const id = e.target.value;

            setWargaId(id);


            if (id) {

              loadRekapSimpanan(
                Number(id)
              );

            }

          }}

          className="w-full border rounded-lg px-3 py-2"

        >


          <option value="">
            -- Pilih Anggota --
          </option>



          {anggota.map((item) => (

            <option
              key={item.id}
              value={item.id}
            >

              {item.nama}

            </option>

          ))}


        </select>




        <div className="mt-4">

          <label className="block font-semibold mb-2">
            Tanggal Setor
          </label>


          <input

            type="date"

            value={tanggalSetor}

            onChange={(e) =>
              setTanggalSetor(e.target.value)
            }

            className="w-full border rounded-lg px-3 py-2"

          />

        </div>




        <div className="mt-4">

          <label className="block font-semibold mb-2">
            Simpanan Pokok
          </label>


          <input

            type="number"

            value={simpananPokok}

            onChange={(e) =>
              setSimpananPokok(e.target.value)
            }

            className="w-full border rounded-lg px-3 py-2"

          />

        </div>




        <div className="mt-4">

          <label className="block font-semibold mb-2">
            Simpanan Wajib
          </label>


          <input

            type="number"

            value={simpananWajib}

            onChange={(e) =>
              setSimpananWajib(e.target.value)
            }

            className="w-full border rounded-lg px-3 py-2"

          />

        </div>




        <div className="mt-4">

          <label className="block font-semibold mb-2">
            Simpanan Sukarela
          </label>


          <input

            type="number"

            value={simpananSukarela}

            onChange={(e) =>
              setSimpananSukarela(e.target.value)
            }

            className="w-full border rounded-lg px-3 py-2"

          />

        </div>




        <button

          onClick={simpanSimpanan}

          className="
            mt-6
            bg-red-600
            text-white
            px-5
            py-2
            rounded-lg
            font-semibold
          "

        >

          SIMPAN

        </button>




        {/* REKAP */}

        <div className="mt-10">


          <h2 className="text-xl font-bold mb-4">
            Rekap Simpanan
          </h2>

{rekapSimpanan.length > 0 && (
  <div className="mb-5 bg-gray-50 p-4 rounded-lg">

    <p>
      <b>ID Anggota:</b>{" "}
      {rekapSimpanan[0]?.warga?.kode_warga || "-"}
    </p>

    <p>
      <b>Nama Anggota:</b>{" "}
      {rekapSimpanan[0]?.warga?.nama || "-"}
    </p>

    <p>
      <b>No KK:</b>{" "}
      {rekapSimpanan[0]?.warga?.no_kk || "-"}
    </p>

  </div>
)}

          <table className="w-full border">


            <thead>

              <tr className="bg-gray-100">


                <th className="border p-2">
                  Tanggal
                </th>


                <th className="border p-2">
                  Pokok
                </th>


                <th className="border p-2">
                  Wajib
                </th>


                <th className="border p-2">
  Sukarela
</th>

<th className="border p-2">
  Total
</th>
<th className="border p-2">
  Aksi
</th>

              </tr>

            </thead>



            <tbody>


              {rekapSimpanan.map((item) => (

                <tr key={item.id}>


                  <td className="border p-2 text-center">

                    {item.tanggal_setor}

                  </td>


                  <td className="border p-2 text-right">

                    Rp {Number(item.simpanan_pokok)
                      .toLocaleString("id-ID")}

                  </td>
                  <td className="border p-2 text-center">

  <button
    onClick={() => editSimpanan(item)}
    className="
      bg-yellow-500
      text-white
      px-3
      py-1
      rounded
      mr-2
    "
  >
    Edit
  </button>


  <button
    onClick={() => hapusSimpanan(item.id)}
    className="
      bg-red-600
      text-white
      px-3
      py-1
      rounded
    "
  >
    Hapus
  </button>

</td>


                  <td className="border p-2 text-right">

                    Rp {Number(item.simpanan_wajib)
                      .toLocaleString("id-ID")}

                  </td>


                  <td className="border p-2 text-right">

                    Rp {Number(item.simpanan_sukarela)
                      .toLocaleString("id-ID")}

                  </td>
<td className="border p-2 text-right font-semibold">

  Rp {(
    Number(item.simpanan_pokok || 0) +
    Number(item.simpanan_wajib || 0) +
    Number(item.simpanan_sukarela || 0)
  ).toLocaleString("id-ID")}

</td>
<td className="border p-2 text-center">

  <button
    onClick={() => editSimpanan(item)}
    className="
      bg-yellow-500
      text-white
      px-3
      py-1
      rounded
    "
  >
    Edit
  </button>
<button
  onClick={() => hapusSimpanan(item.id)}
  className="
    bg-red-600
    text-white
    px-3
    py-1
    rounded
    ml-2
  "
>
  Hapus
</button>
</td>
                </tr>

              ))}


            </tbody>


          </table>


        </div>


      </div>


    </div>

  );

}
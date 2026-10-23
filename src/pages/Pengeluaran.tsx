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

      const [
        pengeluaran,
        periodeData

      ] = await Promise.all([

        getPengeluaran(),
        getPeriode()

      ]);


      setData(pengeluaran);
      setPeriode(periodeData);


    } catch (error) {

      console.error(error);

      alert(
        "Gagal mengambil data pengeluaran."
      );

    }

  }



  useEffect(() => {

    loadData();


    const today =
      new Date()
      .toISOString()
      .split("T")[0];


    setTanggal(today);


  }, []);




  function resetForm() {


    const today =
      new Date()
      .toISOString()
      .split("T")[0];


    setEditId(null);

    setTanggal(today);

    setPeriodeId("");

    setKeterangan("");

    setJumlah("");

  }




  async function handleSubmit(
    e: React.FormEvent
  ) {


    e.preventDefault();



    if (
      !tanggal ||
      !keterangan ||
      !jumlah
    ) {

      alert(
        "Tanggal, keterangan, dan jumlah wajib diisi."
      );

      return;

    }



    const nominal =
      Number(jumlah);



    if (nominal <= 0) {

      alert(
        "Jumlah pengeluaran harus lebih dari 0."
      );

      return;

    }



    const selectedPeriode =
      periodeId === ""
        ? null
        : Number(periodeId);



    try {


      if(editId !== null){


        await updatePengeluaran(
          editId,
          tanggal,
          selectedPeriode,
          keterangan,
          nominal
        );


        alert(
          "Data pengeluaran berhasil diperbarui."
        );



      } else {


        await addPengeluaran(
          tanggal,
          selectedPeriode,
          keterangan,
          nominal
        );


        alert(
          "Data pengeluaran berhasil ditambahkan."
        );


      }



      resetForm();

      await loadData();



    } catch(error){

      console.error(error);

      alert(
        "Gagal menyimpan data pengeluaran."
      );

    }


  }
  function handleEdit(
    item: PengeluaranData
  ) {

    setEditId(item.id);

    setTanggal(item.tanggal);

    setPeriodeId(
      item.periode_id !== null
        ? String(item.periode_id)
        : ""
    );

    setKeterangan(item.keterangan);

    setJumlah(
      String(item.jumlah)
    );


    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  }





  async function handleDelete(
    id: number
  ) {


    const yakin =
      window.confirm(
        "Yakin ingin menghapus data pengeluaran ini?"
      );


    if(!yakin) return;



    try {


      await deletePengeluaran(id);


      await loadData();


      alert(
        "Data pengeluaran berhasil dihapus."
      );


    } catch(error:any){


      console.error(error);


      alert(
        "Gagal menghapus data pengeluaran.\n\n" +
        (error?.message || "")
      );


    }


  }





  const totalPengeluaran =
    data.reduce(

      (total,item)=>
        total +
        Number(
          item.jumlah || 0
        ),

      0

    );





  const formatRupiah =
    (value:number)=>{

      return new Intl.NumberFormat(
        "id-ID",
        {
          style:"currency",
          currency:"IDR",
          maximumFractionDigits:0,
        }

      ).format(value);

    };






  return (

    <Layout>


      <div className="
        space-y-8
      ">



        {/* HEADER */}

        <div
          className="
          rounded-3xl
          p-6
          bg-gradient-to-r
          from-red-600/20
          via-purple-600/20
          to-blue-600/20
          backdrop-blur-xl
          border
          border-white/10
          shadow-[0_0_40px_rgba(168,85,247,0.25)]
          "
        >


          <h1
            className="
            text-4xl
            font-black
            text-white
            "
          >

            💰 Pengeluaran

          </h1>



          <p
            className="
            text-gray-300
            mt-2
            "
          >

            Kelola biaya operasional koperasi dan Pertashop.

          </p>


        </div>





        {/* FORM */}


        <div
          className="
          rounded-3xl
          p-8
          bg-white/5
          backdrop-blur-xl
          border
          border-white/10
          shadow-[0_0_35px_rgba(59,130,246,0.15)]
          "
        >



          <h2
            className="
            text-2xl
            font-bold
            text-white
            mb-6
            "
          >


            {editId !== null

              ? "✏️ Edit Pengeluaran"

              : "➕ Tambah Pengeluaran"

            }


          </h2>





          <form
            onSubmit={handleSubmit}
            className="
            grid
            grid-cols-1
            md:grid-cols-2
            lg:grid-cols-3
            gap-5
            "
          >



            {/* TANGGAL */}

            <div>

              <label
                className="
                text-sm
                font-semibold
                text-gray-300
                "
              >

                Tanggal

              </label>


              <input

                type="date"

                value={tanggal}

                onChange={(e)=>
                  setTanggal(e.target.value)
                }


                className="
                w-full
                mt-2
                rounded-xl
                bg-black/30
                border
                border-white/20
                px-4
                py-3
                text-white
                "
              />


            </div>





            {/* PERIODE */}


            <div>


              <label
                className="
                text-sm
                font-semibold
                text-gray-300
                "
              >

                Periode

              </label>



              <select

                value={periodeId}

                onChange={(e)=>
                  setPeriodeId(e.target.value)
                }


                className="
                w-full
                mt-2
                rounded-xl
                bg-black/30
                border
                border-white/20
                px-4
                py-3
                text-white
                "
              >


                <option value="">
                  -- Umum / Tanpa Periode --
                </option>


                {periode.map((item)=>(


                  <option
                    key={item.id}
                    value={item.id}
                  >

                    {item.nama_periode}

                  </option>


                ))}


              </select>


            </div>





            {/* JUMLAH */}


            <div>


              <label
                className="
                text-sm
                font-semibold
                text-gray-300
                "
              >

                Jumlah Pengeluaran

              </label>


              <input

                type="number"

                min="0"

                value={jumlah}

                onChange={(e)=>
                  setJumlah(e.target.value)
                }


                placeholder="Contoh: 50000"


                className="
                w-full
                mt-2
                rounded-xl
                bg-black/30
                border
                border-white/20
                px-4
                py-3
                text-white
                "

              />


            </div>
                      



            {/* KETERANGAN */}

            <div
              className="
              md:col-span-2
              lg:col-span-3
              "
            >

              <label
                className="
                text-sm
                font-semibold
                text-gray-300
                "
              >

                Keterangan

              </label>


              <input

                type="text"

                value={keterangan}

                onChange={(e)=>
                  setKeterangan(e.target.value)
                }


                placeholder="Contoh: Ongkos kirim BBM"


                className="
                w-full
                mt-2
                rounded-xl
                bg-black/30
                border
                border-white/20
                px-4
                py-3
                text-white
                "

              />

            </div>





            {/* BUTTON */}


            <div
              className="
              lg:col-span-3
              flex
              gap-3
              "
            >


              <button

                type="submit"

                className="
                bg-gradient-to-r
                from-red-600
                to-purple-600
                hover:scale-105
                transition
                text-white
                font-bold
                px-8
                py-3
                rounded-xl
                shadow-lg
                "

              >

                {editId !== null

                  ? "💾 Simpan Perubahan"

                  : "➕ Simpan Pengeluaran"

                }


              </button>





              {editId !== null && (

                <button

                  type="button"

                  onClick={resetForm}


                  className="
                  bg-gray-600
                  hover:bg-gray-700
                  text-white
                  font-bold
                  px-8
                  py-3
                  rounded-xl
                  "

                >

                  ❌ Batal

                </button>

              )}


            </div>



          </form>


        </div>







        {/* RINGKASAN */}



        <div
          className="
          grid
          grid-cols-1
          md:grid-cols-2
          gap-5
          "
        >



          <div
            className="
            rounded-3xl
            p-6
            bg-white/5
            backdrop-blur-xl
            border
            border-white/10
            shadow-[0_0_30px_rgba(34,197,94,0.15)]
            "
          >


            <p
              className="
              text-gray-400
              "
            >

              Jumlah Pengeluaran

            </p>


            <p
              className="
              text-4xl
              font-black
              text-white
              mt-2
              "
            >

              {data.length}

            </p>


          </div>






          <div
            className="
            rounded-3xl
            p-6
            bg-white/5
            backdrop-blur-xl
            border
            border-white/10
            shadow-[0_0_30px_rgba(239,68,68,0.25)]
            "
          >


            <p
              className="
              text-gray-400
              "
            >

              Total Pengeluaran

            </p>



            <p
              className="
              text-3xl
              font-black
              text-red-400
              mt-2
              "
            >

              {formatRupiah(totalPengeluaran)}

            </p>



          </div>


        </div>







        {/* TABLE */}



        <div
          className="
          rounded-3xl
          overflow-hidden
          bg-white/5
          backdrop-blur-xl
          border
          border-white/10
          shadow-[0_0_40px_rgba(59,130,246,0.15)]
          "
        >



          <div
            className="
            p-6
            border-b
            border-white/10
            "
          >

            <h2
              className="
              text-2xl
              font-bold
              text-white
              "
            >

              📋 Riwayat Pengeluaran

            </h2>


          </div>





          <div
            className="
            overflow-x-auto
            "
          >


            <table
              className="
              w-full
              "
            >



              <thead
                className="
                bg-black/30
                text-gray-300
                "
              >

                <tr>


                  <th
                    className="
                    px-4
                    py-3
                    text-left
                    "
                  >
                    No
                  </th>


                  <th
                    className="
                    px-4
                    py-3
                    text-left
                    "
                  >
                    Tanggal
                  </th>


                  <th
                    className="
                    px-4
                    py-3
                    text-left
                    "
                  >
                    Periode
                  </th>


                  <th
                    className="
                    px-4
                    py-3
                    text-left
                    "
                  >
                    Keterangan
                  </th>


                  <th
                    className="
                    px-4
                    py-3
                    text-right
                    "
                  >
                    Jumlah
                  </th>


                  <th
                    className="
                    px-4
                    py-3
                    text-center
                    "
                  >
                    Aksi
                  </th>


                </tr>


              </thead>





              <tbody>
                
                {data.length === 0 ? (

                  <tr>

                    <td
                      colSpan={6}
                      className="
                      text-center
                      py-10
                      text-gray-400
                      "
                    >

                      Belum ada data pengeluaran.

                    </td>


                  </tr>



                ) : (


                  data.map((item,index)=>{


                    const namaPeriode =
                      periode.find(
                        (p)=>
                          p.id === item.periode_id
                      )?.nama_periode
                      ??
                      "Umum";



                    return (


                      <tr

                        key={item.id}

                        className="
                        border-t
                        border-white/10
                        hover:bg-white/5
                        transition
                        "

                      >



                        <td
                          className="
                          px-4
                          py-4
                          text-gray-200
                          "
                        >

                          {index + 1}

                        </td>





                        <td
                          className="
                          px-4
                          py-4
                          text-gray-200
                          "
                        >

                          {item.tanggal}

                        </td>





                        <td
                          className="
                          px-4
                          py-4
                          text-gray-200
                          "
                        >

                          {namaPeriode}

                        </td>





                        <td
                          className="
                          px-4
                          py-4
                          text-gray-200
                          "
                        >

                          {item.keterangan}

                        </td>





                        <td
                          className="
                          px-4
                          py-4
                          text-right
                          font-bold
                          text-red-400
                          "
                        >

                          {formatRupiah(
                            Number(item.jumlah)
                          )}

                        </td>





                        <td
                          className="
                          px-4
                          py-4
                          "
                        >


                          <div
                            className="
                            flex
                            justify-center
                            gap-2
                            "
                          >



                            <button

                              onClick={()=>
                                handleEdit(item)
                              }


                              className="
                              bg-yellow-500
                              hover:bg-yellow-600
                              text-white
                              px-4
                              py-2
                              rounded-lg
                              shadow
                              "

                            >

                              ✏️

                            </button>





                            <button

                              onClick={()=>
                                handleDelete(item.id)
                              }


                              className="
                              bg-red-600
                              hover:bg-red-700
                              text-white
                              px-4
                              py-2
                              rounded-lg
                              shadow
                              "

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

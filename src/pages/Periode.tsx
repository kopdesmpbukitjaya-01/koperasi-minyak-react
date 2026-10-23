import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { getJenisBBM } from "../services/jenis_bbm";
import { getRekapLiterPeriode } from "../services/transaksi";
import {
  getPeriode,
  addPeriode,
  updatePeriode,
  deletePeriode,
} from "../services/periode";


export default function Periode() {

  const navigate = useNavigate();

  const [list, setList] = useState<any[]>([]);
  const [rekapLiter, setRekapLiter] = useState<Record<number, number>>({});
  const [jenisBBM, setJenisBBM] = useState<any[]>([]);

  const [jenisBBMId, setJenisBBMId] = useState("");

  const [namaPeriode, setNamaPeriode] = useState("");
  const [kuotaLiter, setKuotaLiter] = useState(0);
  const [aktif, setAktif] = useState(false);

  const [editId, setEditId] = useState<number | null>(null);


  useEffect(() => {
    loadData();
    loadJenisBBM();
  }, []);



  // =========================
  // LOAD PERIODE
  // =========================

  async function loadData() {

    const [dataPeriode, dataRekap] = await Promise.all([
      getPeriode(),
      getRekapLiterPeriode(),
    ]);

    setList(dataPeriode);
    setRekapLiter(dataRekap);
  }



  // =========================
  // LOAD JENIS BBM
  // =========================

  async function loadJenisBBM() {

    try {

      const data = await getJenisBBM();

      setJenisBBM(data);


      if (data.length > 0 && !jenisBBMId) {
        setJenisBBMId(String(data[0].id));
      }


    } catch (err:any) {

      console.error(err);
      alert(err.message);

    }

  }



  // =========================
  // RESET FORM
  // =========================

  function resetForm(){

    setEditId(null);
    setNamaPeriode("");
    setJenisBBMId("");
    setKuotaLiter(0);
    setAktif(false);

  }




  // =========================
  // SIMPAN / UPDATE
  // =========================

  async function simpan(){

    try{


      if(namaPeriode.trim()===""){
        alert("Nama periode harus diisi");
        return;
      }


      if(!jenisBBMId){
        alert("Jenis BBM harus dipilih");
        return;
      }


      if(kuotaLiter<=0){
        alert("Kuota liter harus lebih dari 0");
        return;
      }



      if(editId===null){


        await addPeriode(
          namaPeriode.trim(),
          Number(jenisBBMId),
          kuotaLiter,
          aktif
        );


        alert("Periode berhasil ditambahkan");


      }else{


        await updatePeriode(
          editId,
          namaPeriode.trim(),
          Number(jenisBBMId),
          kuotaLiter,
          aktif
        );


        alert("Periode berhasil diupdate");

      }



      resetForm();

      await loadData();


    }catch(err:any){

      console.error(err);
      alert(err.message);

    }

  }





  // =========================
  // EDIT
  // =========================

  function edit(p:any){

    setEditId(p.id);

    setNamaPeriode(
      p.nama_periode
    );


    setJenisBBMId(
      p.jenis_bbm_id
      ? String(p.jenis_bbm_id)
      : ""
    );


    setKuotaLiter(
      Number(p.kuota_liter || 0)
    );


    setAktif(
      Boolean(p.aktif)
    );

  }




  // =========================
  // HAPUS
  // =========================

  async function hapus(id:number){


    if(!confirm("Yakin ingin menghapus periode ini?")){
      return;
    }



    try{


      await deletePeriode(id);


      await loadData();


      alert("Periode berhasil dihapus");



    }catch(err:any){

      console.error(err);
      alert(err.message);

    }

  }



  return (

    <Layout>

      <div className="space-y-8">


        {/* HEADER */}

        <div
          className="
          relative overflow-hidden
          rounded-3xl
          p-6
          bg-gradient-to-br
          from-[#18002f]
          via-[#0b1026]
          to-[#050816]
          border border-purple-500/30
          shadow-[0_0_35px_rgba(168,85,247,0.25)]
          "
        >

          <div
            className="
            absolute
            -top-20
            -right-20
            w-60
            h-60
            bg-red-500/20
            blur-3xl
            rounded-full
            "
          />


          <div className="relative flex justify-between items-center">


            <div>

              <h1
                className="
                text-3xl
                md:text-4xl
                font-black
                bg-gradient-to-r
                from-red-400
                via-purple-400
                to-blue-400
                bg-clip-text
                text-transparent
                "
              >
                📅 DATA PERIODE
              </h1>


              <p className="text-gray-300 mt-2">

                Kelola periode distribusi BBM Pertashop

              </p>


            </div>



            <button

              onClick={()=>navigate("/dashboard")}

              className="
              px-5
              py-3
              rounded-xl
              text-white
              font-bold
              bg-gradient-to-r
              from-blue-600
              to-purple-600
              shadow-[0_0_20px_rgba(59,130,246,0.5)]
              hover:scale-105
              transition
              "

            >

              ← Dashboard

            </button>


          </div>


        </div>





        {/* FORM */}

        <div

          className="
          rounded-3xl
          p-6
          md:p-8
          bg-white/5
          backdrop-blur-xl
          border
          border-white/10
          shadow-[0_0_40px_rgba(139,92,246,0.15)]
          "

        >


          <h2

            className="
            text-2xl
            font-black
            text-white
            mb-8
            "

          >

            ⚡

            {
              editId===null
              ? " Tambah Periode"
              : " Edit Periode"
            }


          </h2>
                    <div className="grid md:grid-cols-2 gap-6">


            {/* NAMA PERIODE */}

            <div>

              <label className="text-sm text-gray-300 font-semibold mb-2 block">
                Nama Periode
              </label>


              <input

                type="text"

                placeholder="Contoh: Oktober 2026"

                value={namaPeriode}

                onChange={(e)=>setNamaPeriode(e.target.value)}

                className="
                w-full
                rounded-xl
                px-4
                py-3
                bg-black/30
                text-white
                placeholder-gray-500
                border
                border-purple-500/30
                focus:border-purple-400
                focus:ring-2
                focus:ring-purple-500/30
                outline-none
                "

              />

            </div>




            {/* JENIS BBM */}

            <div>

              <label className="text-sm text-gray-300 font-semibold mb-2 block">
                Jenis BBM
              </label>



              <select

                value={jenisBBMId}

                onChange={(e)=>setJenisBBMId(e.target.value)}

                className="
                w-full
                rounded-xl
                px-4
                py-3
                bg-black/30
                text-white
                border
                border-blue-500/30
                focus:border-blue-400
                outline-none
                "

              >


                <option
                  value=""
                  className="bg-[#050816]"
                >
                  -- Pilih Jenis BBM --
                </option>



                {
                  jenisBBM.map((bbm)=>(

                    <option

                      key={bbm.id}

                      value={bbm.id}

                      className="bg-[#050816]"

                    >

                      {bbm.nama}

                    </option>

                  ))
                }


              </select>


            </div>





            {/* KUOTA */}

            <div>

              <label className="text-sm text-gray-300 font-semibold mb-2 block">

                Kuota Liter

              </label>


              <input

                type="number"

                min="1"

                value={kuotaLiter}

                onChange={(e)=>setKuotaLiter(Number(e.target.value))}

                className="
                w-full
                rounded-xl
                px-4
                py-3
                bg-black/30
                text-white
                border
                border-red-500/30
                focus:border-red-400
                outline-none
                "

              />


            </div>





            {/* AKTIF */}

            <div className="md:col-span-2">


              <label

                className="
                flex
                items-center
                gap-3
                p-4
                rounded-xl
                bg-black/20
                border
                border-green-500/30
                cursor-pointer
                "

              >


                <input

                  type="checkbox"

                  checked={aktif}

                  onChange={(e)=>setAktif(e.target.checked)}

                  className="
                  w-5
                  h-5
                  accent-green-500
                  "

                />


                <span className="text-white font-semibold">

                  Jadikan sebagai Periode Aktif

                </span>


              </label>


            </div>


          </div>






          {/* BUTTON */}

          <div className="flex gap-4 mt-8">


            <button

              onClick={simpan}

              className="
              px-8
              py-3
              rounded-xl
              font-bold
              text-white
              bg-gradient-to-r
              from-red-500
              via-purple-500
              to-blue-500
              shadow-[0_0_25px_rgba(168,85,247,0.5)]
              hover:scale-105
              transition
              "

            >

              {
                editId===null
                ? "💾 SIMPAN"
                : "✏️ UPDATE"
              }


            </button>





            {
              editId!==null &&

              <button

                onClick={resetForm}

                className="
                px-8
                py-3
                rounded-xl
                bg-gray-700
                text-white
                hover:bg-gray-600
                "

              >

                Batal

              </button>

            }


          </div>


        </div>







        {/* DAFTAR PERIODE */}


        <div

          className="
          rounded-3xl
          p-6
          md:p-8
          bg-white/5
          backdrop-blur-xl
          border
          border-white/10
          shadow-[0_0_40px_rgba(59,130,246,0.15)]
          "

        >


          <h2

            className="
            text-2xl
            font-black
            text-white
            mb-6
            "

          >

            📊 DAFTAR PERIODE

          </h2>





          <div className="overflow-x-auto">


            <table className="w-full text-white">


              <thead>


                <tr

                  className="
                  bg-gradient-to-r
                  from-red-600
                  via-purple-600
                  to-blue-600
                  "

                >


                  <th className="px-4 py-3 text-left">
                    Periode
                  </th>


                  <th className="px-4 py-3">
                    BBM
                  </th>


                  <th className="px-4 py-3">
                    Kuota
                  </th>


                  <th className="px-4 py-3">
                    Terjual
                  </th>


                  <th className="px-4 py-3">
                    Sisa
                  </th>


                  <th className="px-4 py-3">
                    Status
                  </th>


                  <th className="px-4 py-3">
                    Aksi
                  </th>


                </tr>


              </thead>





              <tbody>


              {
                list.map((p)=>{


                  const terjual = rekapLiter[p.id] || 0;

                  const sisa =
                    Number(p.kuota_liter) - terjual;



                  return (

                    <tr

                      key={p.id}

                      className="
                      border-b
                      border-white/10
                      hover:bg-white/5
                      transition
                      "

                    >


                      <td className="px-4 py-4 font-semibold">

                        {p.nama_periode}

                      </td>



                      <td className="px-4 py-4 text-center">

                        {p.jenis_bbm?.nama || "-"}

                      </td>




                      <td className="px-4 py-4 text-center">

                        {p.kuota_liter} L

                      </td>




                      <td className="px-4 py-4 text-center text-blue-300 font-bold">

                        {terjual} L

                      </td>




                      <td className="px-4 py-4 text-center text-green-300 font-bold">

                        {sisa} L

                      </td>





                      <td className="px-4 py-4 text-center">


                        {
                          p.aktif

                          ?

                          <span

                            className="
                            px-3
                            py-1
                            rounded-full
                            bg-green-500/20
                            text-green-400
                            border
                            border-green-400/40
                            text-sm
                            font-bold
                            "

                          >

                            🟢 AKTIF

                          </span>


                          :

                          <span

                            className="
                            text-gray-400
                            "

                          >

                            Tidak Aktif

                          </span>

                        }


                      </td>





                      <td className="px-4 py-4 text-center">


                        <button

                          onClick={()=>edit(p)}

                          className="
                          px-4
                          py-2
                          rounded-lg
                          bg-blue-600
                          hover:bg-blue-500
                          text-white
                          mr-2
                          shadow-lg
                          "

                        >

                          Edit

                        </button>





                        <button

                          onClick={()=>hapus(p.id)}

                          className="
                          px-4
                          py-2
                          rounded-lg
                          bg-red-600
                          hover:bg-red-500
                          text-white
                          shadow-lg
                          "

                        >

                          Hapus

                        </button>


                      </td>



                    </tr>

                  );


                })

              }




              {
                list.length===0 &&

                <tr>

                  <td

                    colSpan={7}

                    className="
                    text-center
                    py-10
                    text-gray-400
                    "

                  >

                    Belum ada data periode

                  </td>


                </tr>

              }



              </tbody>


            </table>


          </div>


        </div>




      </div>


    </Layout>


  );

}

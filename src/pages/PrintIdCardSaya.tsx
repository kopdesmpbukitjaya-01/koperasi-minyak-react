import { useLocation, Navigate } from "react-router-dom";
import IdCard from "../components/IdCard";
import { useRef } from "react";
import { toPng } from "html-to-image";

export default function PrintIdCardSaya(){

  const location = useLocation();

  const anggota = location.state?.anggota;

  const cardRef = useRef<HTMLDivElement>(null);


  if(!anggota){
    return (
      <Navigate
        to="/portal-anggota"
        replace
      />
    );
  }



  async function downloadImage(){

    if(!cardRef.current)
      return;


    try{


      const dataUrl =
        await toPng(
          cardRef.current,
          {
            quality:1,
            pixelRatio:3,
            cacheBust:true
          }
        );


      const link =
        document.createElement("a");


      link.download =
        `ID-Card-${anggota.nama}.png`;


      link.href =
        dataUrl;


      link.click();



    }catch(error){

      console.error(error);

      alert(
        "Gagal menyimpan ID Card"
      );

    }


  }



return (

<div
className="
min-h-screen
bg-slate-950
flex
flex-col
items-center
justify-center
gap-8
p-6
"
>


<div
ref={cardRef}
>

<IdCard

nama={anggota.nama}

noKK={anggota.no_kk}

kodeWarga={anggota.kode_warga}

status={anggota.status}

/>

</div>



<button

onClick={downloadImage}

className="
px-6
py-3
rounded-xl
font-bold
text-white
bg-gradient-to-r
from-cyan-500
to-blue-600
shadow-lg
"

>

📥 Simpan ID Card

</button>


</div>


);

}
// Deploy trigger
import logo from "../assets/logo_crop.png";
interface IdCardProps {
  nama: string;
  noKK: string;
  kodeWarga: string;
  status: string;
  onClose: () => void;
}

export default function IdCard({
  nama,
  noKK,
  kodeWarga,
  status,
  onClose,
}: IdCardProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative">
        {/* ID CARD 8,5 x 5,4 cm */}
        <div
  id="id-card"
  className="relative h-[8.6cm] w-[5.4cm] overflow-hidden rounded-2xl bg-white shadow-2xl"

>{/* Background */}

{/* Ornamen atas */}
<div className="absolute top-0 left-0 w-full h-32 overflow-hidden z-0">
  <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[160%] h-44 rounded-b-[100%] bg-red-700"></div>

  <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-[150%] h-40 rounded-b-[100%] border-b-[6px] border-yellow-400"></div>
</div>


          {/* Background Header */}


<div className="absolute top-4 z-20 w-full text-center text-white">
  <h1 className="text-[11px] font-bold tracking-wide">
    KOPERASI DESA MERAH PUTIH
  </h1>

  <p className="text-[9px]">
    BUKIT JAYA
  </p>
</div>


          {/* Isi */}
<div
  className="relative z-10 flex h-full flex-col items-center px-5 pt-24 pb-12"
>

  <img
    src={logo}
    alt="Logo Koperasi"
  className="mb-3 h-16 w-16 object-contain"
  />

  <div className="mb-1 text-[9px] font-medium text-gray-500">
              NAMA WARGA
            </div>

           <div className="mb-3 text-center text-[15px] font-bold uppercase text-gray-800">
              {nama}
            </div>
            <div className="mt-1 text-[8px] text-white/80">
  NOMOR KK
</div>

<div className="mb-3 text-[10px] font-semibold text-gray-700">
  {noKK}
</div>

            <div className="mt-2 rounded-lg bg-white px-5 py-2 shadow-lg">
              <div className="text-center text-[16px] font-bold tracking-wider text-red-600">
                {kodeWarga}
              </div>
            </div>

            <div className="mt-3 rounded-full bg-white px-4 py-1">
  <div className="text-[9px] font-bold uppercase text-red-700">
                {status === "Anggota" ? "ANGGOTA" : "NON ANGGOTA"}
              </div>
            </div>
          </div>
{/* Ornamen bawah */}
<div className="absolute bottom-0 left-0 w-full h-24 overflow-hidden z-0">
  <div className="absolute bottom-[-70px] left-1/2 -translate-x-1/2 w-[160%] h-36 rounded-t-[100%] bg-red-700"></div>

  <div className="absolute bottom-[-62px] left-1/2 -translate-x-1/2 w-[150%] h-32 rounded-t-[100%] border-t-[6px] border-yellow-400"></div>
</div>
          {/* Footer */}
          <div className="absolute bottom-3 w-full text-center z-20">
            <div className="text-[8px] font-semibold text-white">
  KARTU IDENTITAS WARGA
</div>
          </div>
        </div>

        {/* Tombol tutup */}
        <button
          type="button"
          onClick={onClose}
          className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-800 text-lg text-white shadow-lg hover:bg-gray-700"
        >
          ×
        </button>
      </div>
    </div>
  );
}

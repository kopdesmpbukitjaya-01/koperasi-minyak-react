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
        {/* ID CARD 8,5 x 5,5 cm */}
        <div
          id="id-card"
          className="relative flex h-[5.5cm] w-[8.5cm] flex-col overflow-hidden rounded-lg border border-gray-300 bg-white shadow-2xl"
        >
          {/* Header */}
          <div className="bg-red-700 px-3 py-2 text-center text-white">
            <div className="text-[10px] font-bold tracking-wide">
              KOPERASI DESA MERAH PUTIH
            </div>

            <div className="text-[9px] font-semibold">
              BUKIT JAYA
            </div>
          </div>

          {/* Isi */}
<div className="flex flex-1 flex-col items-center justify-center px-3">

  <img
    src={logo}
    alt="Logo Koperasi"
    className="mb-2 h-12 w-12 object-contain"
  />

  <div className="mb-1 text-[9px] font-medium text-gray-500">
              NAMA WARGA
            </div>

            <div className="mb-3 text-center text-[15px] font-bold uppercase text-gray-800">
              {nama}
            </div>
            <div className="mt-1 text-[8px] text-gray-500">
  NOMOR KK
</div>

<div className="mb-3 text-[10px] font-semibold text-gray-800">
  {noKK}
</div>

            <div className="rounded-md border-2 border-red-700 px-4 py-1">
              <div className="text-center text-[16px] font-bold tracking-wider text-red-700">
                {kodeWarga}
              </div>
            </div>

            <div className="mt-3 rounded-full bg-gray-100 px-4 py-1">
              <div className="text-[9px] font-bold uppercase text-gray-700">
                {status === "Anggota" ? "ANGGOTA" : "NON ANGGOTA"}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 py-1 text-center">
            <div className="text-[7px] text-gray-500">
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

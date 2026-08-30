
import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import IdCard from "../components/IdCard";

export default function PrintIdCard() {
  const [dataWarga, setDataWarga] = useState<any[]>([]);
  const [downloadingPage, setDownloadingPage] = useState<number | null>(null);

  const pageRefs = useRef<HTMLDivElement[]>([]);

  const cardsPerPage = 9;

  // =====================================================
  // BAGI DATA MENJADI 9 KARTU PER HALAMAN
  // =====================================================

  const pages: any[][] = [];

  for (
    let i = 0;
    i < dataWarga.length;
    i += cardsPerPage
  ) {
    pages.push(
      dataWarga.slice(
        i,
        i + cardsPerPage
      )
    );
  }

  // =====================================================
  // LOAD DATA WARGA
  // =====================================================

  useEffect(() => {
    loadWarga();
  }, []);

  async function loadWarga() {
    const { data, error } = await supabase
      .from("warga")
      .select(`
        id,
        nama,
        no_kk,
        kode_warga,
        status
      `)
      .order("id", {
        ascending: true,
      });

    if (error) {
      console.error(
        "Gagal mengambil data warga:",
        error
      );

      return;
    }

    setDataWarga(data || []);
  }

  // =====================================================
  // DOWNLOAD PDF SATU HALAMAN
  // =====================================================

  async function downloadPagePDF(
    pageIndex: number
  ) {
    const page =
      pageRefs.current[pageIndex];

    if (!page) {
      alert(
        "Halaman ID Card tidak ditemukan."
      );

      return;
    }

    setDownloadingPage(pageIndex);

    try {
      // Tunggu sebentar agar QR dan gambar selesai dirender
      await new Promise((resolve) =>
        setTimeout(resolve, 300)
      );

      const canvas =
        await html2canvas(page, {
          scale: 2,
          useCORS: true,
          allowTaint: false,
          backgroundColor: "#ffffff",
          logging: false,
          imageTimeout: 15000,
          foreignObjectRendering: false,
        });

      const image =
        canvas.toDataURL(
          "image/png"
        );

      const pdf =
        new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: [210, 330],
          compress: true,
        });

      pdf.addImage(
        image,
        "PNG",
        0,
        0,
        210,
        330,
        undefined,
        "FAST"
      );

      pdf.save(
        `ID-Card-Halaman-${pageIndex + 1}.pdf`
      );

    } catch (error) {
      console.error(
        "Gagal membuat PDF:",
        error
      );

      alert(
        "Gagal membuat PDF halaman ini. Silakan coba lagi."
      );

    } finally {
      setDownloadingPage(null);
    }
  }

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <div className="min-h-screen bg-gray-200 p-6">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mb-8">

        <h1 className="text-3xl font-bold text-red-700">
          Cetak ID Card
        </h1>

        <p className="mt-2 text-gray-500">
          Total warga: {dataWarga.length}
        </p>

      </div>


      {/* =================================================
          HALAMAN
      ================================================= */}

      <div className="flex flex-col items-center gap-10">

        {pages.map(
          (page, pageIndex) => (

            <div
              key={pageIndex}
              className="flex flex-col items-center"
            >

              {/* =========================================
                  HEADER HALAMAN
              ========================================= */}

              <div
                className="
                  mb-4
                  flex
                  w-full
                  items-center
                  justify-between
                "
              >

                <h2 className="text-lg font-bold text-gray-700">
                  Halaman {pageIndex + 1}
                </h2>

                <button
                  type="button"
                  onClick={() =>
                    downloadPagePDF(
                      pageIndex
                    )
                  }
                  disabled={
                    downloadingPage !== null
                  }
                  className="
                    rounded-lg
                    bg-red-700
                    px-5
                    py-2
                    font-semibold
                    text-white
                    shadow
                    transition
                    hover:bg-red-800
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >

                  {downloadingPage ===
                  pageIndex
                    ? "⏳ Membuat PDF..."
                    : `📄 Download Halaman ${
                        pageIndex + 1
                      }`}

                </button>

              </div>


              {/* =========================================
                  HALAMAN ID CARD
              ========================================= */}

              <div
                ref={(el) => {

                  if (el) {
                    pageRefs.current[
                      pageIndex
                    ] = el;
                  }

                }}
                className="print-page"
              >

                {page.map(
                  (warga) => (

                    <IdCard
                      key={warga.id}
                      nama={warga.nama}
                      noKK={warga.no_kk}
                      kodeWarga={
                        warga.kode_warga
                      }
                      status={
                        warga.status
                      }
                    />

                  )
                )}

              </div>

            </div>

          )
        )}

      </div>


      {/* =================================================
          STYLE
      ================================================= */}

      <style>{`

        .print-page {

          width: 210mm;
          height: 330mm;

          background: white;

          box-sizing: border-box;

          padding: 32.5mm 17.5mm;

          display: grid;

          grid-template-columns:
            repeat(3, 55mm);

          grid-template-rows:
            repeat(3, 85mm);

          gap: 5mm;

          box-shadow:
            0 10px 35px
            rgba(0, 0, 0, .18);

          overflow: hidden;

        }

      `}</style>

    </div>
  );
}

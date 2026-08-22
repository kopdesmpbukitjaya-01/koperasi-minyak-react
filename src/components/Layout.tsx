import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import logo from "../assets/logo.png";

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <Sidebar />

      {/* Content */}
      <div className="flex-1 flex flex-col">

        {/* Header */}
        <header className="bg-white shadow-lg border-b border-gray-200">

          <div className="flex items-center justify-between px-8 py-5">

            {/* Judul */}
            <div>

              <h1 className="text-3xl font-extrabold text-red-700">
                PERTASHOP
              </h1>

              <h2 className="text-xl font-bold text-gray-800 mt-1">
                KOPERASI DESA MERAH PUTIH
              </h2>

              <p className="text-gray-500 mt-1">
                Bukit Jaya • Kecamatan Bulik Timur
              </p>

            </div>

            {/* User */}
            <div className="flex items-center gap-5">

              <div className="text-right">

                <p className="text-sm text-gray-500">
                  Selamat Datang
                </p>

                <h3 className="text-lg font-bold text-gray-800">
                  Administrator
                </h3>

              </div>

              <img
                src={logo}
                alt="Logo"
                className="w-16 h-16 rounded-full border-4 border-red-600 bg-white object-contain p-1 shadow-lg"
              />

            </div>

          </div>

        </header>

        {/* Isi Halaman */}
        <main className="flex-1 p-8 overflow-auto">
          {children}
        </main>

      </div>

    </div>
  );
}
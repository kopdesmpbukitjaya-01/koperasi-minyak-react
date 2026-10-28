import { BrowserRouter, Routes, Route } from "react-router-dom";
import PlatformLayout from "./components/PlatformLayout";
import AndroidBackHandler from "./components/AndroidBackHandler";
import PublicDashboardMobile from "./pages/PublicDashboardMobile";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Warga from "./pages/Warga";
import Periode from "./pages/Periode";
import Transaksi from "./pages/Transaksi";
import PembelianBBM from "./pages/PembelianBBM";
import Laporan from "./pages/Laporan";
import PrintLaporan from "./pages/PrintLaporan";
import PrintIdCard from "./pages/PrintIdCard";
import Anggota from "./pages/Anggota";
import ProtectedRoute from "./components/ProtectedRoute";
import Pengeluaran from "./pages/Pengeluaran";
import Rat from "./pages/Rat";
import Backup from "./pages/Backup";
import PortalAnggota from "./pages/PortalAnggota";
import AlokasiSHU from "./pages/AlokasiSHU";
import ProfilKoperasi from "./pages/ProfilKoperasi";
export default function App() {

  return (
    <BrowserRouter>

<AndroidBackHandler />

      <Routes>
        <Route
  path="/pengeluaran"
  element={
    <ProtectedRoute>
      <Pengeluaran />
    </ProtectedRoute>
  }
  
/>
<Route
path="/alokasi-shu"
element={
<AlokasiSHU/>
}
/>
<Route
  path="/rat"
  element={
    <ProtectedRoute>
      <Rat />
    </ProtectedRoute>
  }
  
/>
<Route
  path="/backup"
  element={
    <ProtectedRoute>
      <Backup />
    </ProtectedRoute>
  }
/>
<Route
  path="/login"
  element={<Login />}
/>


<Route
  path="/portal-anggota"
  element={
    <PlatformLayout>
      <PortalAnggota />
    </PlatformLayout>
  }
/>



{/* =========================
    HALAMAN ADMIN
========================== */}


        {/* =========================
            HALAMAN UMUM
        ========================== */}

        <Route
  path="/"
  element={
    <PlatformLayout>
      <PublicDashboardMobile />
    </PlatformLayout>
  }
/>


        <Route
          path="/login"
          element={<Login />}
        />



        {/* =========================
            HALAMAN ADMIN
        ========================== */}


        <Route
 path="/dashboard"
 element={
   <ProtectedRoute>
     <PlatformLayout>
       <Dashboard />
     </PlatformLayout>
   </ProtectedRoute>
 }
/>


        <Route
          path="/warga"
          element={
            <ProtectedRoute>
              <Warga />
            </ProtectedRoute>
          }
        />


        <Route
          path="/periode"
          element={
            <ProtectedRoute>
              <Periode />
            </ProtectedRoute>
          }
        />
<Route
  path="/pembelian-bbm"
  element={
    <ProtectedRoute>
      <PembelianBBM />
    </ProtectedRoute>
  }
/>

        <Route
          path="/transaksi"
          element={
            <ProtectedRoute>
              <Transaksi />
            </ProtectedRoute>
          }
        />


        <Route
          path="/laporan"
          element={
            <ProtectedRoute>
              <Laporan />
            </ProtectedRoute>
          }
        />
<Route
  path="/anggota"
  element={
    <ProtectedRoute>
      <Anggota />
    </ProtectedRoute>
  }
/>
<Route
 path="/rat"
 element={
   <ProtectedRoute>
     <Rat />
   </ProtectedRoute>
 }
/>

        <Route
          path="/print-laporan"
          element={
            <ProtectedRoute>
              <PrintLaporan />
            </ProtectedRoute>
          }
        />


        {/* CETAK ID CARD WARGA */}

        <Route
          path="/print-id-card"
          element={
            <ProtectedRoute>
              <PrintIdCard />
            </ProtectedRoute>
          }
        />

<Route
  path="/profil-koperasi"
  element={
    <ProtectedRoute>
      <ProfilKoperasi />
    </ProtectedRoute>
  }
/>
      </Routes>


    </BrowserRouter>
  );
}

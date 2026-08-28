import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Warga from "./pages/Warga";
import Periode from "./pages/Periode";
import Transaksi from "./pages/Transaksi";
import Laporan from "./pages/Laporan";
import PrintLaporan from "./pages/PrintLaporan";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Halaman umum */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Halaman admin */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
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
          path="/print-laporan"
          element={
            <ProtectedRoute>
              <PrintLaporan />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
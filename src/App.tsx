import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Warga from "./pages/Warga";
import Periode from "./pages/Periode";
import Transaksi from "./pages/Transaksi";
import Laporan from "./pages/Laporan";
import PrintLaporan from "./pages/PrintLaporan";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/warga" element={<Warga />} />

        <Route path="/periode" element={<Periode />} />

        <Route path="/transaksi" element={<Transaksi />} />
         
        <Route path="/laporan" element={<Laporan />} />
        <Route path="/print-laporan" element={<PrintLaporan />} />
       
      </Routes>
    </BrowserRouter>
  );
}
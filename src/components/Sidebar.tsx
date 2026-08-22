import { useNavigate } from "react-router-dom";
import sidebarBg from "../assets/sidebar-bg.png";

export default function Sidebar() {
  const navigate = useNavigate();

  const menus = [
    {
      title: "Dashboard",
      icon: "🏠",
      path: "/dashboard",
    },
    {
      title: "Data Warga",
      icon: "👥",
      path: "/warga",
    },
    {
      title: "Periode",
      icon: "📅",
      path: "/periode",
    },
    {
      title: "Pengambilan",
      icon: "🛢️",
      path: "/transaksi",
    },
    {
      title: "Laporan PDF",
      icon: "📄",
      path: "/laporan",
    },
  ];

  return (
    <div
      className="w-64 min-h-screen text-white shadow-xl bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,.45), rgba(0,0,0,.45)), url(${sidebarBg})`,
      }}
    >
      <div className="p-6 backdrop-blur-sm bg-black/20 border-b border-white/20">
        <h2 className="text-2xl font-bold">
          KDMP Bukit Jaya
        </h2>

        <p className="text-sm text-gray-200">
          Pertashop
        </p>
      </div>

      <div className="p-3">
        {menus.map((menu) => (
          <button
            key={menu.title}
            onClick={() => navigate(menu.path)}
            className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/20 transition-all duration-300 mb-2"
          >
            <span className="mr-3">{menu.icon}</span>
            {menu.title}
          </button>
        ))}
      </div>
    </div>
  );
}
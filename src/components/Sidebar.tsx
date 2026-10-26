import { useLocation, useNavigate } from "react-router-dom";


export default function Sidebar() {

  const navigate = useNavigate();
  const location = useLocation();


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
      title: "Pembelian BBM",
      icon: "⛽",
      path: "/pembelian-bbm",
    },
    {
      title: "Pengeluaran",
      icon: "💰",
      path: "/pengeluaran",
    },
    {
      title: "Pengambilan",
      icon: "🛢️",
      path: "/transaksi",
    },
    {
      title: "Anggota Koperasi",
      icon: "🤝",
      path: "/anggota",
    },
    {
      title: "Laporan PDF",
      icon: "📄",
      path: "/laporan",
    },
    {
  title: "Laporan RAT",
  icon: "🏛️",
  path: "/rat",
},
{
  title: "Backup Data",
  icon: "💾",
  path: "/backup",
},
  ];



  return (

    <aside
      className="
      w-64
      min-h-screen
      hidden
      md:block

      bg-gradient-to-b
      from-[#09001f]
      via-[#10002b]
      to-[#001b3d]

      border-r
      border-purple-500/40

      shadow-[0_0_35px_rgba(168,85,247,0.35)]
      "
    >



      {/* HEADER SIDEBAR */}

      <div
        className="
        p-6

        border-b
        border-purple-500/40

        bg-black/20

        backdrop-blur-xl
        "
      >

        <h2
          className="
          text-xl
          font-black

          bg-gradient-to-r
          from-red-400
          via-purple-400
          to-blue-400

          bg-clip-text
          text-transparent
          "
        >
          KOPERASI DESA
        </h2>


        <h3
          className="
          text-lg
          font-bold
          text-white
          "
        >
          MERAH PUTIH
        </h3>


        <p
          className="
          text-xs
          text-blue-300
          mt-1
          "
        >
          Bukit Jaya
        </p>


      </div>





      {/* MENU */}

      <nav
        className="
        p-4
        space-y-3
        "
      >


        {menus.map((menu)=>{


          const aktif =
            location.pathname === menu.path;



          return (

            <button

              key={menu.title}

              onClick={()=>navigate(menu.path)}

              className={`
              
              group

              relative

              w-full

              flex
              items-center

              gap-3

              px-4
              py-3

              rounded-2xl


              transition-all
              duration-300


              border


              ${
                aktif

                ?

                `
                bg-gradient-to-r
                from-red-600/80
                via-purple-600/80
                to-blue-600/80

                border-purple-300

                shadow-[0_0_20px_rgba(168,85,247,0.8)]

                scale-[1.03]
                `

                :

                `
                bg-white/5

                border-white/10

                hover:bg-white/10

                hover:border-blue-400

                hover:shadow-[0_0_15px_rgba(59,130,246,0.7)]

                hover:translate-x-2
                `
              }

              `}

            >



              {/* ICON */}

              <span
                className="
                text-xl

                group-hover:scale-125

                transition
                "
              >
                {menu.icon}
              </span>




              <span
                className="
                font-semibold

                text-sm

                text-white
                "
              >

                {menu.title}

              </span>



              {/* ACTIVE LINE */}

              {
                aktif &&

                <span
                  className="
                  absolute

                  left-0

                  top-3

                  h-8

                  w-1

                  rounded-full

                  bg-white

                  shadow-[0_0_15px_white]

                  "
                />

              }



            </button>


          );


        })}


      </nav>



    </aside>


  );

}

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


import { supabase } from "../lib/supabase";



type Props = {
  children: ReactNode;
};


export default function MobileLayout({
  children
}: Props) {


  const navigate = useNavigate();

  const [user,setUser] = useState<any>(null);



  useEffect(()=>{

    supabase.auth.getSession()
    .then(({data})=>{

      setUser(data.session);

    });


  },[]);



  return (

    <div
    className="
    min-h-screen
    bg-[#050816]
    text-white
    pb-20
    relative
    overflow-x-hidden
    "
    >



      {/* BACKGROUND */}

      <div
      className="
      fixed
      inset-0
      pointer-events-none
      "
      >

        <div
        className="
        absolute
        -top-40
        -left-40
        w-80
        h-80
        rounded-full
        bg-purple-600/20
        blur-3xl
        "
        />


        <div
        className="
        absolute
        bottom-0
        right-0
        w-96
        h-96
        rounded-full
        bg-red-600/20
        blur-3xl
        "
        />


      </div>





      {/* HEADER */}

      <header
      className="
      relative
      z-10

      p-4

      flex
      items-center
      justify-between

      bg-[#080d24]/80

      backdrop-blur-xl

      border-b
      border-white/10
      "
      >



        {/* KIRI : LOGO TRANSPARAN + TEXT */}

<div
className="
flex
items-center
"
>

<div>

<h1
className="
font-black
text-base
bg-gradient-to-r
from-red-400
via-purple-400
to-blue-400
bg-clip-text
text-transparent
"
>
KDMP BUKIT JAYA
</h1>


<p
className="
text-xs
text-blue-200
"
>
Kecamatan Bulik Timur
</p>


</div>


</div>




        {/* LOGOUT ADMIN */}

        {
        user && (

          <button

          onClick={async()=>{

            await supabase.auth.signOut();

            localStorage.removeItem("user");

            setUser(null);

            navigate("/");

          }}

          className="
          px-4
          py-2

          rounded-full

          bg-gradient-to-r
          from-red-500
          to-pink-600

          text-xs

          font-bold

          active:scale-95

          transition
          "

          >

          Keluar

          </button>

        )
        }



      </header>






      {/* CONTENT */}

      <main
      className="
      relative
      z-10

      p-4
      "
      >

        {children}

      </main>






      {/* MENU BAWAH */}

      <nav
      className="
      fixed

      bottom-0
      left-0
      right-0

      z-50

      h-20

      bg-[#080d24]/90

      backdrop-blur-xl

      border-t
      border-white/10

      flex
      justify-evenly
      items-center
      "
      >


        <Menu
        icon="🏠"
        text="Home"
        onClick={()=>navigate("/dashboard")}
        />


        <Menu
        icon="⛽"
        text="Transaksi"
        onClick={()=>navigate("/transaksi")}
        />


        <Menu
        icon="👥"
        text="Warga"
        onClick={()=>navigate("/warga")}
        />


        <Menu
        icon="📊"
        text="Laporan"
        onClick={()=>navigate("/laporan")}
        />
<Menu
icon="🏛️"
text="RAT"
onClick={()=>navigate("/rat")}
/>


<Menu
icon="🏢"
text="Profil"
onClick={()=>navigate("/profil-koperasi")}
/>

      </nav>



    </div>

  );

}





function Menu({
icon,
text,
onClick
}:any){


return (

<button

onClick={onClick}

className="
flex
flex-col
items-center

text-xs

text-gray-300

hover:text-white
"

>


<span
className="
text-xl
"
>

{icon}

</span>


<span>

{text}

</span>


</button>


);

}





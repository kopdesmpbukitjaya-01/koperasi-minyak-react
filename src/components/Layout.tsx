import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Sidebar";
import logo from "../assets/logo_transparan.png";
import { supabase } from "../lib/supabase";

type Props = {
  children: ReactNode;
};


export default function Layout({ children }: Props) {


  const navigate = useNavigate();
const [menuOpen,setMenuOpen] = useState(false);


  async function logout(){

  await supabase.auth.signOut();

  localStorage.removeItem("user");

  navigate("/login");

}



return (

<div
className="
flex
min-h-screen
overflow-hidden
bg-[#050816]
text-white
relative
"
>


{/* =========================
    FUTURISTIC BACKGROUND
========================= */}


<div
className="
absolute
inset-0
overflow-hidden
pointer-events-none
"
>


<div
className="
absolute
-top-40
-left-40
w-[500px]
h-[500px]
bg-purple-600/20
rounded-full
blur-[130px]
"
/>



<div
className="
absolute
top-1/3
right-[-200px]
w-[600px]
h-[600px]
bg-blue-600/20
rounded-full
blur-[150px]
"
/>



<div
className="
absolute
bottom-[-200px]
left-1/3
w-[500px]
h-[500px]
bg-red-600/20
rounded-full
blur-[130px]
"
/>



{/* garis futuristik */}

<div
className="
absolute
top-0
left-0
w-full
h-[2px]
bg-gradient-to-r
from-red-500
via-purple-500
to-blue-500
shadow-[0_0_20px_rgba(168,85,247,.8)]
"
/>


</div>





{/* =========================
        SIDEBAR
========================= */}


{/* DESKTOP SIDEBAR */}

<div
className="
hidden
md:block
relative
z-20
"
>
<Sidebar />
</div>



{/* MOBILE SIDEBAR */}

{
menuOpen && (

<div
className="
fixed
inset-0
z-50
md:hidden
"
>


<div
className="
absolute
inset-0
bg-black/60
"
onClick={()=>setMenuOpen(false)}
/>


<div
className="
relative
w-72
h-full
bg-[#080d24]
shadow-2xl
"
>

<Sidebar />

</div>


</div>

)
}







{/* =========================
        CONTENT
========================= */}



<div
className="
flex-1
w-full
flex
flex-col
relative
z-10
min-w-0
"
>




{/* =========================
        HEADER
========================= */}


<header
className="
relative
px-4
md:px-8
py-5

bg-[#080d24]/80
backdrop-blur-xl

border-b
border-white/10

shadow-[0_0_30px_rgba(139,92,246,.25)]
"
>



<div
className="
flex
items-center
justify-between
gap-4
"
>

<button
  onClick={()=>setMenuOpen(true)}
  className="
  md:hidden
  text-2xl
  p-2
  rounded-xl
  bg-white/10
  border
  border-white/20
  "
>
  ☰
</button>


{/* TITLE */}


<div
className="
min-w-0
"
>


<h1
className="
text-lg
sm:text-xl
md:text-3xl

font-black

bg-gradient-to-r
from-red-400
via-purple-400
to-blue-400

bg-clip-text
text-transparent

tracking-wide

truncate
"
>

<span className="md:hidden">
KDMP BUKIT JAYA
</span>

<span className="hidden md:inline">
KOPERASI DESA MERAH PUTIH BUKIT JAYA
</span>

</h1>


<h2
className="
text-sm
md:text-xl
font-bold
text-blue-200
"
>

<span className="md:hidden">
BULIK TIMUR
</span>

<span className="hidden md:inline">
KECAMATAN BULIK TIMUR
</span>

</h2>


<p
className="
text-xs
md:text-sm

text-gray-400

mt-1
"
>

Sistem Informasi Koperasi Digital

</p>



</div>







{/* USER AREA */}



<div
className="
flex
items-center
gap-3
"
>



<div
className="
hidden
md:block
text-right
"
>


<p
className="
text-xs
text-gray-400
"
>

Selamat Datang

</p>



<h3
className="
font-bold
text-purple-300
"
>

Administrator

</h3>



<button

onClick={logout}

className="
mt-2

px-5
py-2

rounded-xl

font-bold

text-sm

bg-gradient-to-r
from-red-600
to-purple-600

shadow-[0_0_20px_rgba(239,68,68,.6)]

hover:scale-105

transition

"

>

Logout

</button>


</div>







{/* LOGO */}



{/* LOGO */}

<img
src={logo}
className="
w-14
h-14
object-cover
"
/>



</div>




</div>



</header>







{/* =========================
        PAGE CONTENT
========================= */}



<main

className="
flex-1
w-full

overflow-auto

p-4
md:p-8

relative

"

>


<div

className="
w-full

animate-fadeIn

"

>


{children}


</div>



</main>





</div>



</div>


);


}
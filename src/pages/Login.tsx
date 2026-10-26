import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { Preferences } from "@capacitor/preferences";

import logo from "../assets/logo_transparan.png";


export default function Login() {


  const navigate = useNavigate();


  const [email,setEmail] = useState("");

  const [password,setPassword] = useState("");



  async function login(){


    console.log("LOGIN EMAIL:",email);



    const {data,error} =
      await supabase.auth.signInWithPassword({

        email,

        password,

      });



    console.log(
      "LOGIN DATA:",
      data
    );


    console.log(
      "LOGIN ERROR:",
      error
    );



    if(error){

  alert(error.message);

  return;

}


// SIMPAN SESSION UNTUK APK ANDROID

if(data.session){

  await Preferences.set({

    key: "kdmp_session",

    value: JSON.stringify(data.session),

  });

}


navigate("/dashboard");


  }





return (

<div
className="
min-h-screen
flex
items-center
justify-center
p-6
bg-gradient-to-br
from-slate-950
via-red-900
to-red-600
"
>



<div
className="
w-full
max-w-md
bg-white/95
backdrop-blur
rounded-3xl
shadow-2xl
p-8
border
border-white/40
"
>





{/* HEADER LOGO */}

<div
className="
flex
items-center
justify-center
gap-4
mb-8
"
>


<div
className="
w-24
h-24
rounded-full
bg-white
shadow-xl
border-4
border-red-600
flex
items-center
justify-center
overflow-hidden
"
>

<img

src={logo}

alt="Logo Koperasi"

className="
w-full
h-full
object-contain
p-2
"

/>

</div>




<div>


<h1
className="
text-xl
font-extrabold
text-red-700
leading-tight
"
>

KOPERASI DESA
<br/>

MERAH PUTIH

</h1>



<p
className="
text-gray-600
font-semibold
mt-1
"
>

BUKIT JAYA

</p>



<p
className="
text-xs
text-gray-500
"
>

Kecamatan Bulik Timur

</p>


</div>


</div>





{/* JUDUL LOGIN */}


<div
className="
text-center
mb-7
"
>


<h2
className="
text-2xl
font-bold
text-gray-800
"
>

LOGIN ADMIN

</h2>



<p
className="
text-gray-500
mt-2
"
>

Sistem Informasi KDMP Bukit Jaya

</p>


</div>







{/* FORM */}



<div
className="
space-y-5
"
>




<div>


<label
className="
block
font-semibold
text-gray-700
mb-2
"
>

Email

</label>



<input

type="email"

placeholder="Masukkan Email"

value={email}

onChange={(e)=>
setEmail(e.target.value)
}

className="
w-full
rounded-xl
border
border-gray-300
px-4
py-3
text-gray-800
focus:outline-none
focus:ring-2
focus:ring-red-500
"

/>


</div>





<div>


<label
className="
block
font-semibold
text-gray-700
mb-2
"
>

Password

</label>



<input

type="password"

placeholder="Masukkan Password"

value={password}

onChange={(e)=>
setPassword(e.target.value)
}

className="
w-full
rounded-xl
border
border-gray-300
px-4
py-3
text-gray-800
focus:outline-none
focus:ring-2
focus:ring-red-500
"

/>


</div>












<button

onClick={login}

className="
w-full
py-3
rounded-xl
font-bold
text-white
bg-gradient-to-r
from-red-700
to-red-500
shadow-lg
hover:scale-[1.02]
transition
"

>

LOGIN

</button>
<button

onClick={()=>navigate("/")}

className="
w-full
mt-3
py-3
rounded-xl
font-bold
text-white
bg-gradient-to-r
from-slate-700
to-slate-900
border
border-red-400/50
shadow-lg
hover:scale-[1.02]
transition
"

>
← KEMBALI DASHBOARD UMUM
</button>






</div>






{/* FOOTER */}

<p
className="
text-center
text-xs
text-gray-400
mt-8
"
>

© KDMP Bukit Jaya
<br/>
Sistem Informasi Koperasi Desa Merah Putih

</p>



</div>



</div>


);


}











import { APP_VERSION, APP_NAME } from "../config/appVersion";
import logo from "../assets/logo_transparan.png";
import { useEffect, useState } from "react";
export default function AppSplash(){const [progress,setProgress] = useState(50);


useEffect(()=>{

const timer1 = setTimeout(()=>{
setProgress(70);
},700);


const timer2 = setTimeout(()=>{
setProgress(100);
},1500);


return ()=>{
clearTimeout(timer1);
clearTimeout(timer2);
}

},[]);

return (

<div
className="
fixed
inset-0
z-50
flex
flex-col
items-center
justify-center
bg-gradient-to-br
from-[#050816]
via-purple-900
to-red-900
text-white
"
>


<img
src={logo}
className="
w-32
h-32
object-contain
mb-8
animate-pulse
"
/>


<p
className="
text-sm
font-serif
italic
font-semibold
text-center
tracking-[0.18em]
leading-relaxed
text-white
drop-shadow-[0_2px_3px_rgba(0,0,0,0.7)]
"
>
Sugeng Rawuh Wonten
</p>


<h1
className="
text-xl
font-black
text-center
uppercase
tracking-widest
leading-tight
text-white
drop-shadow-[0_3px_3px_rgba(0,0,0,0.8)]
"
>
{APP_NAME.split(" Mobile")[0]}
<br />
MOBILE
</h1>

<p
className="
mt-5
text-green-300
font-bold
"
>
"Transparan • Cepat • Akuntabel"
</p>


<div
className="
mt-10
w-64
h-3
rounded-full
bg-white/20
overflow-hidden
"
>

<div
className="
h-full
bg-green-400
rounded-full
transition-all
duration-700
"
style={{
width:`${progress}%`
}}
/>

</div>


<p className="mt-3 text-sm text-gray-300">
Memuat aplikasi...
</p>


<p className="mt-2 text-sm text-gray-400">
Versi {APP_VERSION}
</p>


</div>

)

}